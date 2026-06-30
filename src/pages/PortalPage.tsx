import { useEffect, useState } from "react";
import { Calendar, Clock, TrendingUp, Users, CheckCircle, Check, X, Plus, Search, Loader2 } from "lucide-react";
import {
  getToken,
  requestPoints,
  listExecs,
  listPending,
  reviewEntry,
  createEvent,
  fetchLeaderboard,
  syncForms,
} from "@/services/pointsApi";
import { eventCategoryColors } from "@/data/events";
import type { AuthMember, LeaderboardData, LeaderboardRow, PendingRequest, PointEntry, PortalTab } from "@/types";

// The logged-in Member Portal (live data from the Google Sheet backend).
//  • Overview        — your points + history (all members)
//  • Request Points  — pick an event and submit a point request (all members)
//  • Review & Events — approve/reject requests + add events (EXEC only)

const POINTS_GOAL = 300; // semester goal for the progress bar — adjust as needed.

const statusStyle: Record<string, string> = {
  approved: "text-[#2D8A4E] border-[#2D8A4E]",
  pending: "text-[#FD652F] border-[#FD652F]",
  rejected: "text-muted-foreground border-border",
};

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function PortalPage({
  member,
  points,
  entries,
  onRefresh,
}: {
  member: AuthMember;
  points: number;
  entries: PointEntry[];
  onRefresh: () => void;
}) {
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const token = getToken() || "";
  const isExec = member.role === "exec";

  const pct = Math.min(100, Math.round((points / POINTS_GOAL) * 100));
  const approvedCount = entries.filter((e) => e.status === "approved").length;
  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const history = [...entries].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );

  const tabs: { id: PortalTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "request", label: "Request Points" },
    { id: "leaderboard", label: "Leaderboard" },
    ...(isExec ? [{ id: "manage" as PortalTab, label: "Review & Events" }] : []),
  ];

  return (
    <div className="pt-16 min-h-screen bg-muted">
      {/* Welcome banner */}
      <div className="bg-[#001F5B] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#FD652F]" />
            <span className="text-xs font-medium text-[#FD652F] uppercase tracking-widest">Member Portal{isExec ? " · Exec" : ""}</span>
          </div>
          <h1 className="text-4xl font-bold text-white uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Welcome back, <span className="text-[#FD652F]">{member.name.split(" ")[0]}</span>
          </h1>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-[#f8f8f7] border-b border-border px-6">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id ? "border-[#FD652F] text-[#FD652F]" : "border-transparent text-muted-foreground hover:text-[#001F5B]"}`}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === "overview" && (
          <OverviewTab points={points} pct={pct} approvedCount={approvedCount} pendingCount={pendingCount} entriesCount={entries.length} role={member.role} history={history} />
        )}
        {activeTab === "request" && <RequestTab token={token} onRefresh={onRefresh} />}
        {activeTab === "leaderboard" && <LeaderboardTab token={token} currentEmail={member.email} />}
        {activeTab === "manage" && isExec && <ManageTab token={token} onRefresh={onRefresh} />}
      </div>
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({ points, pct, approvedCount, pendingCount, entriesCount, role, history }: {
  points: number; pct: number; approvedCount: number; pendingCount: number; entriesCount: number; role: string; history: PointEntry[];
}) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      <div className="md:col-span-1 bg-[#f8f8f7] border border-border p-8">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5">Semester Points</div>
        <div className="text-6xl font-bold text-[#FD652F] mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{points}</div>
        <div className="text-sm text-muted-foreground mb-5">of {POINTS_GOAL} goal</div>
        <div className="w-full bg-muted h-2 mb-2"><div className="bg-[#FD652F] h-2 transition-all duration-700" style={{ width: `${pct}%` }} /></div>
        <div className="text-xs text-muted-foreground">{pct}% to semester goal</div>
      </div>
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        {[
          { label: "Events Attended", value: approvedCount, icon: <Calendar size={18} />, sub: "approved" },
          { label: "Pending Requests", value: pendingCount, icon: <Clock size={18} />, sub: "awaiting review" },
          { label: "Entries Logged", value: entriesCount, icon: <TrendingUp size={18} />, sub: "all time" },
          { label: "Member Role", value: role === "exec" ? "Exec" : "Member", icon: <Users size={18} />, sub: "your access" },
        ].map((s) => (
          <div key={s.label} className="bg-[#f8f8f7] border border-border p-6 hover:border-[#FD652F] transition-all duration-300">
            <div className="text-[#FD652F] mb-3">{s.icon}</div>
            <div className="text-3xl font-bold text-[#001F5B] mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="md:col-span-3 bg-[#f8f8f7] border border-border p-8">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Points History</div>
        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground">No points logged yet. Request points for an event to get started!</div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((e) => (
              <div key={e.entry_id} className="flex items-center gap-4 p-4 border border-border hover:border-[#FD652F] hover:shadow-sm transition-all duration-200">
                <div className="w-12 text-center flex-shrink-0">
                  <div className="text-xl font-bold text-[#FD652F] leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{e.points}</div>
                  <div className="text-xs text-muted-foreground uppercase">pts</div>
                </div>
                <div className="h-8 w-px bg-border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#001F5B] truncate">{e.event_id || "Event"}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.source === "exec_award" ? "Awarded by exec" : "Self-requested"}
                    {formatDate(e.created_at) && ` · ${formatDate(e.created_at)}`}
                  </div>
                </div>
                <span className={`text-xs font-medium border px-2 py-1 flex-shrink-0 capitalize ${statusStyle[e.status] || "text-muted-foreground border-border"}`}>{e.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Request Points tab ────────────────────────────────────────────────────────
function RequestTab({ token, onRefresh }: { token: string; onRefresh: () => void }) {
  const [execs, setExecs] = useState<string[]>([]);
  const [form, setForm] = useState({ eventName: "", verifier: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    listExecs(token).then((x) => { if (active) setExecs(x); }).catch(() => {});
    return () => { active = false; };
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventName.trim()) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await requestPoints(token, form);
      setMsg({ ok: true, text: "Request submitted! An exec will review it soon." });
      setForm({ eventName: "", verifier: "", note: "" });
      onRefresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Couldn't submit your request." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Request Points</h2>
        <p className="text-muted-foreground text-sm">Came in late or didn't get marked for something? Tell us what you attended and who can vouch for you — an exec will review and assign the points.</p>
      </div>

      <form onSubmit={submit} className="bg-[#f8f8f7] border border-border p-6 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Event name</label>
          <input value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} placeholder="e.g. GBM #3, Resume Workshop…" className="w-full px-3 py-2.5 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Who can verify you were there?</label>
          <select value={form.verifier} onChange={(e) => setForm({ ...form, verifier: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]" required>
            <option value="">Select an exec…</option>
            {execs.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {execs.length === 0 && <div className="text-xs text-muted-foreground mt-1">No execs listed yet.</div>}
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Details (optional)</label>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} placeholder="Anything that helps the exec confirm it" className="w-full px-3 py-2.5 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F] resize-none" />
        </div>
        <button type="submit" disabled={submitting} className="w-full py-3 text-sm font-medium bg-[#FD652F] text-white hover:bg-[#D33A02] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {submitting ? "Submitting…" : "Submit Request"}
        </button>
        {msg && (
          <div className={`text-xs flex items-center gap-1 ${msg.ok ? "text-[#2D8A4E]" : "text-red-500"}`}>
            {msg.ok && <CheckCircle size={12} />} {msg.text}
          </div>
        )}
      </form>
    </div>
  );
}

// ── Review & Events tab (exec only) ───────────────────────────────────────────
function ManageTab({ token, onRefresh }: { token: string; onRefresh: () => void }) {
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pointsById, setPointsById] = useState<Record<string, string>>({}); // exec-entered points per request

  const [form, setForm] = useState({ name: "", date: "", points: "", category: "", passcode: "" });
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventMsg, setEventMsg] = useState<string | null>(null);

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const r = await syncForms(token);
      setSyncMsg(`Synced ${r.added} new attendance${r.added === 1 ? "" : "s"}` + (r.newMembers ? ` · ${r.newMembers} new member${r.newMembers === 1 ? "" : "s"}` : "") + ".");
      onRefresh();
    } catch (e) {
      setSyncMsg(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const loadPending = () => {
    setLoading(true);
    listPending(token)
      .then((p) => { setPending(p); setError(null); })
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't load requests."))
      .finally(() => setLoading(false));
  };

  useEffect(loadPending, [token]);

  const handleReview = async (entryId: string, decision: "approve" | "reject") => {
    setBusyId(entryId);
    try {
      const pts = decision === "approve" ? Number(pointsById[entryId]) : undefined;
      await reviewEntry(token, entryId, decision, pts);
      setPending((p) => p.filter((x) => String(x.entry_id) !== String(entryId)));
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update the request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSavingEvent(true);
    setEventMsg(null);
    try {
      await createEvent(token, form);
      setEventMsg(`Added "${form.name}".`);
      setForm({ name: "", date: "", points: "", category: "", passcode: "" });
    } catch (err) {
      setEventMsg(err instanceof Error ? err.message : "Couldn't add the event.");
    } finally {
      setSavingEvent(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Review queue */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-[#001F5B] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Pending Requests</h2>
        {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin" /> Loading…</div>}
        {error && !loading && <div className="text-sm text-red-500">{error}</div>}
        {!loading && !error && pending.length === 0 && (
          <div className="text-sm text-muted-foreground bg-[#f8f8f7] border border-border p-6">🎉 All caught up — no pending requests.</div>
        )}
        <div className="flex flex-col gap-3">
          {pending.map((p) => {
            const id = String(p.entry_id);
            const pts = pointsById[id];
            const validPts = pts !== undefined && pts !== "" && !isNaN(Number(pts));
            const busy = busyId === id;
            return (
              <div key={p.entry_id} className="bg-[#f8f8f7] border border-border p-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <div className="font-medium text-[#001F5B] truncate">{p.member_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.event_name}{p.note ? ` · ${p.note}` : ""}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="number"
                    min="0"
                    value={pts ?? ""}
                    onChange={(e) => setPointsById((s) => ({ ...s, [id]: e.target.value }))}
                    placeholder="pts"
                    className="w-16 px-2 py-1.5 text-xs border border-border bg-white focus:outline-none focus:border-[#FD652F]"
                  />
                  <button onClick={() => handleReview(id, "approve")} disabled={busy || !validPts} title={!validPts ? "Enter a point value first" : "Approve"} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#2D8A4E] text-white hover:opacity-90 disabled:opacity-40 transition-opacity"><Check size={13} /> Approve</button>
                  <button onClick={() => handleReview(id, "reject")} disabled={busy} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground hover:border-red-400 hover:text-red-500 disabled:opacity-50 transition-colors"><X size={13} /> Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add event + GBM form sync */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Sync GBM forms */}
        <div>
          <h2 className="text-2xl font-bold text-[#001F5B] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>GBM Forms</h2>
          <div className="bg-[#001F5B] p-6 text-white">
            <p className="text-white/70 text-xs leading-relaxed mb-4">Pull attendance from the GBM Google Forms (listed in the FormSources tab) into the points ledger. Each passcode becomes an event; duplicates are skipped.</p>
            <button onClick={handleSync} disabled={syncing} className="w-full py-2.5 text-sm font-medium bg-[#FD652F] text-white hover:bg-[#D33A02] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {syncing ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />} {syncing ? "Syncing…" : "Sync GBM Forms"}
            </button>
            {syncMsg && <div className="text-xs text-white/80 mt-3 flex items-center gap-1"><CheckCircle size={12} className="text-[#FD652F]" /> {syncMsg}</div>}
          </div>
        </div>

        {/* Add event manually */}
        <div>
          <h2 className="text-2xl font-bold text-[#001F5B] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Add Event</h2>
          <form onSubmit={handleAddEvent} className="bg-[#f8f8f7] border border-border p-6 flex flex-col gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Event name" className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]" required />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F] text-muted-foreground" />
            <input type="number" min="0" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} placeholder="Points (e.g. 10)" className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]">
              <option value="">Category…</option>
              {Object.keys(eventCategoryColors).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.passcode} onChange={(e) => setForm({ ...form, passcode: e.target.value })} placeholder="Form passcode (optional)" className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]" />
            <button type="submit" disabled={savingEvent} className="w-full py-2.5 text-sm font-medium bg-[#FD652F] text-white hover:bg-[#D33A02] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {savingEvent ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} {savingEvent ? "Adding…" : "Add Event"}
            </button>
            {eventMsg && <div className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle size={12} className="text-[#2D8A4E]" /> {eventMsg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Leaderboard tab ───────────────────────────────────────────────────────────
function LeaderboardTab({ token, currentEmail }: { token: string; currentEmail: string }) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchLeaderboard(token)
      .then((d) => { if (active) { setData(d); setError(null); } })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "Couldn't load the leaderboard."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  if (loading) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin" /> Loading leaderboard…</div>;
  if (error) return <div className="text-sm text-muted-foreground">{error}</div>;
  if (!data) return null;

  const isExec = !!data.full;
  const rows = isExec
    ? (data.full || []).filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()))
    : (data.top || []);
  const me = data.me;
  const norm = (s: string) => s.trim().toLowerCase();
  const meInTop = !isExec && (data.top || []).some((r) => norm(r.email) === norm(currentEmail));

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Leaderboard</h2>
        <p className="text-muted-foreground text-sm">{isExec ? "Everyone's points, ranked. Search by name." : "Top 10 members this semester — and where you stand."}</p>
      </div>

      {isExec && (
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search members…" className="w-full pl-9 pr-3 py-2.5 text-sm border border-border bg-[#f8f8f7] focus:outline-none focus:border-[#FD652F]" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {rows.map((r) => <LeaderRow key={r.email} row={r} highlight={norm(r.email) === norm(currentEmail)} />)}
        {rows.length === 0 && <div className="text-sm text-muted-foreground">No members found.</div>}
      </div>

      {/* General member not in the top 10: show their own rank below. */}
      {!isExec && me && !meInTop && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Your Ranking</div>
          <LeaderRow row={me} highlight />
        </div>
      )}
    </div>
  );
}

function LeaderRow({ row, highlight }: { row: LeaderboardRow; highlight?: boolean }) {
  const medal = row.rank === 1 ? "#C9A227" : row.rank === 2 ? "#8A8D91" : row.rank === 3 ? "#B06A34" : null;
  return (
    <div className={`flex items-center gap-4 p-3 border transition-colors ${highlight ? "border-[#FD652F] bg-accent" : "border-border bg-[#f8f8f7]"}`}>
      <div className="w-10 text-center flex-shrink-0">
        <span className="text-lg font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: medal || "#001F5B" }}>#{row.rank}</span>
      </div>
      <div className="flex-1 min-w-0 font-medium text-[#001F5B] truncate">{row.name}{highlight ? " (you)" : ""}</div>
      <div className="flex-shrink-0 font-bold text-[#FD652F]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {row.points} <span className="text-xs text-muted-foreground font-normal">pts</span>
      </div>
    </div>
  );
}
