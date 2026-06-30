/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SHPE MIT — Points backend  (Google Apps Script)
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the small server that sits between the website / Slack and the Google
 * Sheet "database." It is NOT part of the website build — you paste it into a
 * Google Apps Script project and deploy it as a Web App. See SETUP.md.
 *
 * Phase 1 (this file): "Sign in with Slack" + read a member's points.
 * Later phases will add: submit point requests, exec approve/reject, add events,
 * and the Slack App Home dashboard.
 *
 * Secrets are NEVER stored in this file. They live in Project Settings →
 * Script Properties (see cfg() below and SETUP.md).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Tab names in the spreadsheet.
const TABS = { MEMBERS: 'Members', EVENTS: 'Events', ENTRIES: 'Entries' };

// ── Config (read from Script Properties so nothing secret is in the code) ──────
function cfg(key) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  if (!v) throw new Error('Missing Script Property: ' + key + ' (set it in Project Settings).');
  return v;
}

/**
 * Run this ONCE from the Apps Script editor (select `setup` → Run) to create the
 * three tabs with their headers. Safe to run again — it won't overwrite data.
 */
function setup() {
  const ss = SpreadsheetApp.openById(cfg('SHEET_ID'));
  ensureTab_(ss, TABS.MEMBERS, ['slack_user_id', 'name', 'email', 'role', 'joined']);
  ensureTab_(ss, TABS.EVENTS,  ['event_id', 'name', 'date', 'points', 'category', 'created_by']);
  ensureTab_(ss, TABS.ENTRIES, ['entry_id', 'slack_user_id', 'event_id', 'points', 'status', 'source', 'reviewed_by', 'note', 'created_at']);
}
function ensureTab_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
}

// ── HTTP entry point ──────────────────────────────────────────────────────────
// The website and Slack reach the script through this. We route on ?action=...
function doGet(e) {
  const action = ((e && e.parameter && e.parameter.action) || '').toLowerCase();
  try {
    if (action === 'exchange')      return json_(handleExchange_(e));
    if (action === 'me')            return json_(handleMe_(e));
    if (action === 'events')        return json_(handleEvents_(e));
    if (action === 'requestpoints') return json_(handleRequestPoints_(e));
    if (action === 'pending')       return json_(handlePending_(e));
    if (action === 'review')        return json_(handleReview_(e));
    if (action === 'createevent')   return json_(handleCreateEvent_(e));
    return json_({ ok: true, service: 'shpe-points', actions: ['exchange', 'me', 'events', 'requestPoints', 'pending', 'review', 'createEvent'] });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

// ── "Sign in with Slack" (OpenID Connect) ─────────────────────────────────────
// The WEBSITE sends the user straight to Slack, and Slack returns them to the
// website with a one-time `code`. The website then calls this endpoint with that
// code. We exchange it for the user's identity (server-side, using the secret),
// upsert their member row, and return a signed session token as JSON.
//
// (We deliberately do NOT redirect from here — Apps Script pages run in a Google
// iframe that can't navigate the top window, so redirects from here don't work.)
function handleExchange_(e) {
  const code = e.parameter.code;
  if (!code) throw new Error('Missing code.');

  const res = UrlFetchApp.fetch('https://slack.com/api/openid.connect.token', {
    method: 'post',
    payload: {
      client_id: cfg('SLACK_CLIENT_ID'),
      client_secret: cfg('SLACK_CLIENT_SECRET'),
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: cfg('SITE_URL'), // must match what the website used
    },
    muteHttpExceptions: true,
  });
  const data = JSON.parse(res.getContentText());
  if (!data.ok) throw new Error('Slack token exchange failed: ' + (data.error || 'unknown'));

  const claims = parseJwt_(data.id_token);
  const slackUserId = claims['https://slack.com/user_id'];
  if (!slackUserId) throw new Error('Could not read Slack user id from login.');

  // Optional gate: if SLACK_TEAM_ID is set, only allow members of that workspace.
  const teamId = PropertiesService.getScriptProperties().getProperty('SLACK_TEAM_ID');
  if (teamId && claims['https://slack.com/team_id'] !== teamId) {
    throw new Error('Please sign in with your SHPE MIT Slack account.');
  }

  const member = upsertMember_(slackUserId, claims['name'] || '', claims['email'] || '');
  return { ok: true, token: signToken_({ uid: slackUserId, role: member.role }) };
}

// ── Authenticated read: who am I + my points ──────────────────────────────────
function handleMe_(e) {
  const auth = requireAuth_(e);
  const member = findMember_(auth.uid);
  if (!member) throw new Error('Member not found.');

  const entries = entriesForMember_(auth.uid);
  const points = entries
    .filter(function (x) { return x.status === 'approved'; })
    .reduce(function (sum, x) { return sum + Number(x.points || 0); }, 0);

  return {
    ok: true,
    member: { slackUserId: member.slack_user_id, name: member.name, email: member.email, role: member.role },
    points: points,
    entries: entries,
  };
}

// ── Phase 2: events + point requests + exec review ────────────────────────────

// Any logged-in member: list all events (to pick from when requesting points).
function handleEvents_(e) {
  requireAuth_(e);
  return { ok: true, events: rows_(TABS.EVENTS) };
}

// A member requests points for an event → creates a PENDING entry for an exec
// to approve. The point value comes from the event itself.
function handleRequestPoints_(e) {
  const auth = requireAuth_(e);
  const eventId = e.parameter.eventId;
  if (!eventId) throw new Error('Missing eventId.');
  const ev = rows_(TABS.EVENTS).find(function (x) { return String(x.event_id) === String(eventId); });
  if (!ev) throw new Error('Event not found.');
  // Don't allow a duplicate request for the same event (unless the old one was rejected).
  const dup = entriesForMember_(auth.uid).find(function (x) {
    return String(x.event_id) === String(eventId) && x.status !== 'rejected';
  });
  if (dup) throw new Error('You already have a request for this event.');
  appendEntry_(auth.uid, eventId, Number(ev.points || 0), 'pending', 'self_request', '', e.parameter.note || '');
  return { ok: true };
}

// Exec only: list pending requests (with member + event names) for the review queue.
function handlePending_(e) {
  requireExec_(e);
  const members = rows_(TABS.MEMBERS);
  const events = rows_(TABS.EVENTS);
  const pending = rows_(TABS.ENTRIES).filter(function (x) { return x.status === 'pending'; });
  return {
    ok: true,
    pending: pending.map(function (x) {
      const m = members.find(function (mm) { return String(mm.slack_user_id) === String(x.slack_user_id); });
      const ev = events.find(function (ee) { return String(ee.event_id) === String(x.event_id); });
      return {
        entry_id: x.entry_id,
        member_name: m ? m.name : x.slack_user_id,
        event_name: ev ? ev.name : x.event_id,
        points: x.points,
        note: x.note,
      };
    }),
  };
}

// Exec only: approve or reject a pending request.
function handleReview_(e) {
  const auth = requireExec_(e);
  const entryId = e.parameter.entryId;
  const decision = (e.parameter.decision || '').toLowerCase();
  if (!entryId) throw new Error('Missing entryId.');
  if (decision !== 'approve' && decision !== 'reject') throw new Error('Invalid decision.');
  const ok = updateEntryStatus_(entryId, decision === 'approve' ? 'approved' : 'rejected', auth.uid);
  if (!ok) throw new Error('Request not found.');
  return { ok: true };
}

// Exec only: add a new event that members can then request points for.
function handleCreateEvent_(e) {
  const auth = requireExec_(e);
  const name = e.parameter.name;
  if (!name) throw new Error('Missing event name.');
  const eventId = 'EVT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  sheet_(TABS.EVENTS).appendRow([
    eventId, name, e.parameter.date || '', Number(e.parameter.points || 0), e.parameter.category || '', auth.uid,
  ]);
  return { ok: true, event_id: eventId };
}

// ── Spreadsheet helpers ───────────────────────────────────────────────────────
function sheet_(name) { return SpreadsheetApp.openById(cfg('SHEET_ID')).getSheetByName(name); }

// Reads a tab into an array of {header: value} objects.
function rows_(name) {
  const values = sheet_(name).getDataRange().getValues();
  const headers = values.shift();
  return values.map(function (r) {
    const o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
}
function findMember_(uid) {
  return rows_(TABS.MEMBERS).find(function (m) { return String(m.slack_user_id) === String(uid); }) || null;
}
// First time someone logs in, create their row as a "general" member.
// To make someone exec, open the sheet and change their role to "exec".
function upsertMember_(uid, name, email) {
  const existing = findMember_(uid);
  if (existing) return existing;
  sheet_(TABS.MEMBERS).appendRow([uid, name, email, 'general', new Date()]);
  return { slack_user_id: uid, name: name, email: email, role: 'general' };
}
function entriesForMember_(uid) {
  return rows_(TABS.ENTRIES).filter(function (x) { return String(x.slack_user_id) === String(uid); });
}
// Add a row to the Entries ledger.
function appendEntry_(uid, eventId, points, status, source, reviewedBy, note) {
  sheet_(TABS.ENTRIES).appendRow([
    'ENT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    uid, eventId, points, status, source, reviewedBy || '', note || '', new Date(),
  ]);
}
// Find an entry by id and update its status + who reviewed it.
function updateEntryStatus_(entryId, status, reviewedBy) {
  const sh = sheet_(TABS.ENTRIES);
  const data = sh.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]) === String(entryId)) {
      sh.getRange(r + 1, 5).setValue(status);     // status column
      sh.getRange(r + 1, 7).setValue(reviewedBy); // reviewed_by column
      return true;
    }
  }
  return false;
}

// ── Stateless signed session tokens (no storage / no backlog) ─────────────────
function signToken_(obj) {
  obj.exp = Date.now() + 1000 * 60 * 60 * 24 * 30; // valid 30 days
  const body = Utilities.base64EncodeWebSafe(JSON.stringify(obj));
  return body + '.' + sign_(body);
}
function verifyToken_(token) {
  if (!token) return null;
  const parts = String(token).split('.');
  if (parts.length !== 2 || sign_(parts[0]) !== parts[1]) return null;
  const obj = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString());
  if (!obj.exp || Date.now() > obj.exp) return null;
  return obj;
}
function sign_(body) {
  const raw = Utilities.computeHmacSha256Signature(body, cfg('SESSION_SECRET'));
  return Utilities.base64EncodeWebSafe(raw);
}
function requireAuth_(e) {
  const payload = verifyToken_(e.parameter.token);
  if (!payload) throw new Error('Not logged in (invalid or expired session).');
  return payload;
}
// Used by later phases to gate exec-only actions.
function requireExec_(e) {
  const payload = requireAuth_(e);
  if (payload.role !== 'exec') throw new Error('Exec only.');
  return payload;
}

// ── Small utilities ───────────────────────────────────────────────────────────
function parseJwt_(jwt) {
  let p = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  while (p.length % 4) p += '=';
  return JSON.parse(Utilities.newBlob(Utilities.base64Decode(p)).getDataAsString());
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
