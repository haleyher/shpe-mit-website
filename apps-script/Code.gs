/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SHPE MIT — Points backend  (Google Apps Script)
 * ─────────────────────────────────────────────────────────────────────────────
 * The small server between the website and the Google Sheet "database."
 * Paste it into a Google Apps Script project and deploy as a Web App (SETUP.md).
 *
 * IDENTITY: everyone is keyed by their lowercased MIT email. That's the join key
 * between the website (Slack login → MIT email) and the GBM Google Forms (which
 * collect MIT email). Secrets live in Script Properties, never in this file.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TABS = { MEMBERS: 'Members', EVENTS: 'Events', ENTRIES: 'Entries', FORMSOURCES: 'FormSources' };

const HEADERS = {
  Members:     ['email', 'name', 'role', 'slack_user_id', 'joined'],
  Events:      ['event_id', 'passcode', 'name', 'date', 'points', 'category', 'created_by'],
  Entries:     ['entry_id', 'email', 'event_id', 'points', 'status', 'source', 'reviewed_by', 'note', 'created_at'],
  FormSources: ['spreadsheet_id', 'sheet_name', 'default_points'],
};

// ── Config (Script Properties — nothing secret in code) ───────────────────────
function cfg(key) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  if (!v) throw new Error('Missing Script Property: ' + key + ' (set it in Project Settings).');
  return v;
}

// Run ONCE from the editor to create any missing tabs with their headers.
// Safe to re-run — it never touches existing data.
function setup() {
  const ss = SpreadsheetApp.openById(cfg('SHEET_ID'));
  Object.keys(HEADERS).forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS[name]);
  });
}

// DANGER: wipes the Members / Events / Entries tabs and recreates fresh headers.
// Use once when the schema changes (it erases test data — not real data).
function resetSchema() {
  const ss = SpreadsheetApp.openById(cfg('SHEET_ID'));
  ['Members', 'Events', 'Entries'].forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (sh) sh.clear();
    else sh = ss.insertSheet(name);
    sh.appendRow(HEADERS[name]);
  });
  let fs = ss.getSheetByName('FormSources');
  if (!fs) { fs = ss.insertSheet('FormSources'); fs.appendRow(HEADERS.FormSources); }
}

// ── HTTP entry point ──────────────────────────────────────────────────────────
function doGet(e) {
  const action = ((e && e.parameter && e.parameter.action) || '').toLowerCase();
  try {
    if (action === 'exchange')      return json_(handleExchange_(e));
    if (action === 'me')            return json_(handleMe_(e));
    if (action === 'events')        return json_(handleEvents_(e));
    if (action === 'requestpoints') return json_(handleRequestPoints_(e));
    if (action === 'execs')         return json_(handleExecs_(e));
    if (action === 'pending')       return json_(handlePending_(e));
    if (action === 'review')        return json_(handleReview_(e));
    if (action === 'createevent')   return json_(handleCreateEvent_(e));
    if (action === 'leaderboard')   return json_(handleLeaderboard_(e));
    if (action === 'sync')          return json_(handleSync_(e));
    return json_({ ok: true, service: 'shpe-points', actions: ['exchange', 'me', 'events', 'requestPoints', 'execs', 'pending', 'review', 'createEvent', 'leaderboard', 'sync'] });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

// ── "Sign in with Slack" (OpenID Connect) ─────────────────────────────────────
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
      redirect_uri: cfg('SITE_URL'),
    },
    muteHttpExceptions: true,
  });
  const data = JSON.parse(res.getContentText());
  if (!data.ok) throw new Error('Slack token exchange failed: ' + (data.error || 'unknown'));

  const claims = parseJwt_(data.id_token);
  const slackUserId = claims['https://slack.com/user_id'] || '';
  const email = normEmail_(claims['email']);
  if (!email) throw new Error('Your Slack account has no email, so we can\'t sign you in.');

  // Optional gate: only allow the SHPE MIT Slack workspace.
  const teamId = PropertiesService.getScriptProperties().getProperty('SLACK_TEAM_ID');
  if (teamId && claims['https://slack.com/team_id'] !== teamId) {
    throw new Error('Please sign in with your SHPE MIT Slack account.');
  }

  const member = upsertMemberByEmail_(email, claims['name'] || '', slackUserId);
  return { ok: true, token: signToken_({ email: email, role: member.role }) };
}

// ── Read: who am I + my points/history ────────────────────────────────────────
function handleMe_(e) {
  const auth = requireAuth_(e);
  const member = findMemberByEmail_(auth.email);
  if (!member) throw new Error('Member not found.');

  const entries = entriesForEmail_(auth.email);
  const points = entries
    .filter(function (x) { return x.status === 'approved'; })
    .reduce(function (sum, x) { return sum + Number(x.points || 0); }, 0);

  return {
    ok: true,
    member: { email: member.email, name: member.name, role: member.role, slackUserId: member.slack_user_id },
    points: points,
    entries: entries,
  };
}

// ── Events + point requests + exec review ─────────────────────────────────────
function handleEvents_(e) {
  requireAuth_(e);
  return { ok: true, events: rows_(TABS.EVENTS) };
}

// A member submits a free-text point request (event name + who can verify) →
// a PENDING entry tied to their profile. Points start at 0; the exec sets the
// point value when they approve.
function handleRequestPoints_(e) {
  const auth = requireAuth_(e);
  const eventName = String(e.parameter.eventName || '').trim();
  if (!eventName) throw new Error('Please enter the event name.');
  const verifier = String(e.parameter.verifier || '').trim();
  const extra = String(e.parameter.note || '').trim();
  // Avoid an accidental duplicate of the same event by the same person.
  const dup = entriesForEmail_(auth.email).find(function (x) {
    return String(x.event_id).trim().toLowerCase() === eventName.toLowerCase() && x.status !== 'rejected';
  });
  if (dup) throw new Error('You already have a request for "' + eventName + '".');
  const note = verifier ? ('Verify: ' + verifier + (extra ? ' — ' + extra : '')) : extra;
  appendEntry_(auth.email, eventName, 0, 'pending', 'self_request', '', note, new Date());
  return { ok: true };
}

// Any logged-in member: list exec names (for the "who can verify" dropdown).
function handleExecs_(e) {
  requireAuth_(e);
  const execs = rows_(TABS.MEMBERS)
    .filter(function (m) { return String(m.role).toLowerCase() === 'exec' && String(m.name || '').trim(); })
    .map(function (m) { return String(m.name).trim(); })
    .sort();
  return { ok: true, execs: execs };
}

// Exec only: pending requests (with member + event names) for the review queue.
function handlePending_(e) {
  requireExec_(e);
  const members = rows_(TABS.MEMBERS);
  const events = rows_(TABS.EVENTS);
  const pending = rows_(TABS.ENTRIES).filter(function (x) { return x.status === 'pending'; });
  return {
    ok: true,
    pending: pending.map(function (x) {
      const m = members.find(function (mm) { return normEmail_(mm.email) === normEmail_(x.email); });
      const ev = events.find(function (ee) { return String(ee.event_id) === String(x.event_id); });
      return {
        entry_id: x.entry_id,
        member_name: m ? m.name : x.email,
        event_name: ev ? ev.name : x.event_id,
        points: x.points,
        note: x.note,
      };
    }),
  };
}

// Exec only: approve (with a point value) or reject a pending request.
function handleReview_(e) {
  const auth = requireExec_(e);
  const entryId = e.parameter.entryId;
  const decision = (e.parameter.decision || '').toLowerCase();
  if (!entryId) throw new Error('Missing entryId.');
  if (decision !== 'approve' && decision !== 'reject') throw new Error('Invalid decision.');
  const points = (e.parameter.points != null && e.parameter.points !== '') ? Number(e.parameter.points) : null;
  const ok = updateEntryStatus_(entryId, decision === 'approve' ? 'approved' : 'rejected', auth.email, points);
  if (!ok) throw new Error('Request not found.');
  return { ok: true };
}

// Exec only: add an event (optionally with a passcode that matches a GBM form).
function handleCreateEvent_(e) {
  const auth = requireExec_(e);
  const name = e.parameter.name;
  if (!name) throw new Error('Missing event name.');
  const eventId = 'EVT-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
  sheet_(TABS.EVENTS).appendRow([
    eventId, e.parameter.passcode || '', name, e.parameter.date || '',
    Number(e.parameter.points || 0), e.parameter.category || '', auth.email,
  ]);
  return { ok: true, event_id: eventId };
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function handleLeaderboard_(e) {
  const auth = requireAuth_(e);

  // Sum approved points per normalized email.
  const totals = {};
  rows_(TABS.ENTRIES).forEach(function (x) {
    if (x.status === 'approved') {
      const k = normEmail_(x.email);
      totals[k] = (totals[k] || 0) + Number(x.points || 0);
    }
  });

  // Collapse member rows by normalized email (handles kerb-vs-full-email dupes),
  // preferring a real (spaced) name over a kerb.
  const names = {};
  rows_(TABS.MEMBERS).forEach(function (m) {
    const k = normEmail_(m.email);
    if (!k) return;
    const nm = String(m.name || '');
    if (!(k in names) || (names[k].indexOf(' ') < 0 && nm.indexOf(' ') >= 0)) names[k] = nm;
  });
  Object.keys(totals).forEach(function (k) { if (!(k in names)) names[k] = k; });

  const board = Object.keys(names).map(function (k) {
    return { email: k, name: names[k] || k, points: totals[k] || 0 };
  }).sort(function (a, b) { return b.points - a.points; });

  // Tie-aware ranking: equal points share a rank (e.g. 1, 1, 3, 4, …).
  let lastPoints = null, lastRank = 0;
  board.forEach(function (row, i) {
    if (row.points === lastPoints) { row.rank = lastRank; }
    else { row.rank = i + 1; lastRank = row.rank; lastPoints = row.points; }
  });

  if (auth.role === 'exec') return { ok: true, full: board };
  const me = board.find(function (r) { return r.email === normEmail_(auth.email); }) || null;
  return { ok: true, top: board.slice(0, 10), me: me };
}

// ── GBM form sync (Model A: forms funnel into the ledger) ─────────────────────
function handleSync_(e) {
  requireExec_(e);
  return syncForms_();
}

// Pulls every row from every spreadsheet listed in the FormSources tab and turns
// it into an approved entry. Each unique passcode becomes an event. Deduped by
// (email + event). Reads/writes in batch so it stays fast.
// Form columns expected: Timestamp | Passcode | Full Name | MIT Email.
function syncForms_() {
  const ss = SpreadsheetApp.openById(cfg('SHEET_ID'));
  const defaultGlobal = Number(PropertiesService.getScriptProperties().getProperty('DEFAULT_EVENT_POINTS') || 5);

  // Snapshot existing state once.
  const eventsByPass = {};
  rows_(TABS.EVENTS).forEach(function (ev) {
    const p = String(ev.passcode || '').trim().toLowerCase();
    if (p) eventsByPass[p] = ev;
  });
  const seen = {};
  rows_(TABS.ENTRIES).forEach(function (x) { seen[normEmail_(x.email) + '|' + x.event_id] = true; });
  const memberEmails = {};
  rows_(TABS.MEMBERS).forEach(function (m) { memberEmails[normEmail_(m.email)] = true; });

  const newEvents = [], newMembers = [], newEntries = [];
  let added = 0;

  rows_(TABS.FORMSOURCES).forEach(function (src) {
    const id = String(src.spreadsheet_id || '').trim();
    if (!id) return;
    let formSs;
    try { formSs = SpreadsheetApp.openById(id); } catch (err) { return; } // skip if not shared with us
    const name = String(src.sheet_name || '').trim();
    const sh = name ? formSs.getSheetByName(name) : formSs.getSheets()[0];
    if (!sh) return;
    const data = sh.getDataRange().getValues();
    if (data.length < 2) return;
    const defPoints = Number(src.default_points || defaultGlobal);

    // Find columns by HEADER NAME, so forms with different layouts / extra
    // columns all work (order doesn't matter). We only need passcode + email.
    const hdr = data[0].map(function (h) { return String(h || '').trim().toLowerCase(); });
    const passIdx = hdr.findIndex(function (h) { return h.indexOf('passcode') >= 0; });
    const emailIdx = hdr.findIndex(function (h) { return h.indexOf('email') >= 0; });
    let nameIdx = hdr.findIndex(function (h) { return h.indexOf('full name') >= 0; });
    if (nameIdx < 0) nameIdx = hdr.findIndex(function (h) { return h.indexOf('name') >= 0; });
    let tsIdx = hdr.findIndex(function (h) { return h.indexOf('timestamp') >= 0; });
    if (tsIdx < 0) tsIdx = 0;
    if (passIdx < 0 || emailIdx < 0) return; // this sheet doesn't have what we need

    for (let r = 1; r < data.length; r++) {
      const ts = data[r][tsIdx] || new Date();
      const passcode = String(data[r][passIdx] || '').trim();
      const fullName = nameIdx >= 0 ? String(data[r][nameIdx] || '').trim() : '';
      const email = normEmail_(data[r][emailIdx]);
      if (!passcode || !email) continue;

      const pkey = passcode.toLowerCase();
      let ev = eventsByPass[pkey];
      if (!ev) {
        const eventId = 'EVT-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
        ev = { event_id: eventId, passcode: passcode, name: passcode, points: defPoints };
        eventsByPass[pkey] = ev;
        newEvents.push([eventId, passcode, passcode, '', defPoints, 'GBM', 'form-sync']);
      }
      if (!memberEmails[email]) {
        memberEmails[email] = true;
        newMembers.push([email, fullName, 'general', '', new Date()]);
      }
      const key = email + '|' + ev.event_id;
      if (seen[key]) continue;
      seen[key] = true;
      newEntries.push(['ENT-' + Date.now() + '-' + Math.floor(Math.random() * 100000), email, ev.event_id, Number(ev.points || defPoints), 'approved', 'form', 'form-sync', '', ts]);
      added++;
    }
  });

  appendRows_(ss.getSheetByName(TABS.EVENTS), newEvents);
  appendRows_(ss.getSheetByName(TABS.MEMBERS), newMembers);
  appendRows_(ss.getSheetByName(TABS.ENTRIES), newEntries);
  return { ok: true, added: added, newEvents: newEvents.length, newMembers: newMembers.length };
}

// ── Spreadsheet helpers ───────────────────────────────────────────────────────
function sheet_(name) { return SpreadsheetApp.openById(cfg('SHEET_ID')).getSheetByName(name); }

function rows_(name) {
  const sh = sheet_(name);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values.shift();
  return values.map(function (r) {
    const o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
}
function appendRows_(sh, rowsToAdd) {
  if (rowsToAdd && rowsToAdd.length) {
    sh.getRange(sh.getLastRow() + 1, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);
  }
}
function findMemberByEmail_(email) {
  const key = normEmail_(email);
  return rows_(TABS.MEMBERS).find(function (m) { return normEmail_(m.email) === key; }) || null;
}
// Match by email. On Slack login, fill in slack_user_id / name if we didn't have them.
function upsertMemberByEmail_(email, name, slackUserId) {
  email = normEmail_(email);
  const localPart = email.split('@')[0]; // their kerb
  const sh = sheet_(TABS.MEMBERS);
  const data = sh.getDataRange().getValues(); // [email, name, role, slack_user_id, joined]
  for (let r = 1; r < data.length; r++) {
    if (normEmail_(data[r][0]) === email) {
      if (slackUserId && !data[r][3]) sh.getRange(r + 1, 4).setValue(slackUserId);
      // Fix names: if the stored name is blank, or "kerb-looking" (someone typed
      // their kerb instead of their name in a form), replace it with the real
      // name from their Slack login. Leave a proper name alone.
      const cur = String(data[r][1] || '');
      const looksLikeKerb = cur && cur.indexOf(' ') < 0 && cur.toLowerCase() === localPart;
      if (name && (!cur || looksLikeKerb)) { sh.getRange(r + 1, 2).setValue(name); data[r][1] = name; }
      return { email: email, name: data[r][1] || name, role: data[r][2] || 'general', slack_user_id: data[r][3] || slackUserId || '' };
    }
  }
  sh.appendRow([email, name || '', 'general', slackUserId || '', new Date()]);
  return { email: email, name: name || '', role: 'general', slack_user_id: slackUserId || '' };
}
function entriesForEmail_(email) {
  const key = normEmail_(email);
  return rows_(TABS.ENTRIES).filter(function (x) { return normEmail_(x.email) === key; });
}
function appendEntry_(email, eventId, points, status, source, reviewedBy, note, createdAt) {
  sheet_(TABS.ENTRIES).appendRow([
    'ENT-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
    normEmail_(email), eventId, points, status, source, reviewedBy || '', note || '', createdAt || new Date(),
  ]);
}
function updateEntryStatus_(entryId, status, reviewedBy, points) {
  const sh = sheet_(TABS.ENTRIES);
  const data = sh.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]) === String(entryId)) {
      sh.getRange(r + 1, 5).setValue(status);     // status column
      sh.getRange(r + 1, 7).setValue(reviewedBy); // reviewed_by column
      if (points != null && !isNaN(points)) sh.getRange(r + 1, 4).setValue(points); // points column
      return true;
    }
  }
  return false;
}

// ── Stateless signed session tokens ───────────────────────────────────────────
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
function requireExec_(e) {
  const payload = requireAuth_(e);
  if (payload.role !== 'exec') throw new Error('Exec only.');
  return payload;
}

// ── Small utilities ───────────────────────────────────────────────────────────
// Normalize an email for matching. A bare kerb (no "@") is treated as the full
// MIT email, so "arevaloe" and "arevaloe@mit.edu" count as the same person.
function normEmail_(s) {
  let e = String(s || '').trim().toLowerCase();
  if (e && e.indexOf('@') < 0) e += '@mit.edu';
  return e;
}
function parseJwt_(jwt) {
  let p = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  while (p.length % 4) p += '=';
  return JSON.parse(Utilities.newBlob(Utilities.base64Decode(p)).getDataAsString());
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
