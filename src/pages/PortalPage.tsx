import { useEffect, useState } from "react";
import { Calendar, Clock, TrendingUp, Users, CheckCircle, Check, X, Plus, Loader2 } from "lucide-react";
import {
  getToken,
  listEvents,
  requestPoints,
  listPending,
  reviewEntry,
  createEvent,
} from "@/services/pointsApi";
import { eventCategoryColors } from "@/data/events";
import type { AuthMember, EventItem, PendingRequest, PointEntry, PortalTab } from "@/types";

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
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Per-event status: "loading" | "done" | an error message.
  const [reqState, setReqState] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    listEvents(token)
      .then((evs) => { if (active) { setEvents(evs); setError(null); } })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "Couldn't load events."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const handleRequest = async (eventId: string) => {
    setReqState((s) => ({ ...s, [eventId]: "loading" }));
    try {
      await requestPoints(token, eventId, "");
      setReqState((s) => ({ ...s, [eventId]: "done" }));
      onRefresh();
    } catch (e) {
      setReqState((s) => ({ ...s, [eventId]: e instanceof Error ? e.message : "Failed." }));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Request Points</h2>
        <p className="text-muted-foreground text-sm">Pick an event you attended and submit a request. An exec will review and approve it.</p>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin" /> Loading events…</div>}
      {error && !loading && <div className="text-sm text-muted-foreground">{error}</div>}
      {!loading && !error && events.length === 0 && (
        <div className="text-sm text-muted-foreground">No events yet. Check back once an exec adds some.</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {events.map((ev) => {
          const state = reqState[ev.event_id];
          const done = state === "done";
          const busy = state === "loading";
          const errMsg = state && state !== "done" && state !== "loading" ? state : null;
          return (
            <div key={ev.event_id} className="bg-[#f8f8f7] border border-border p-6 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-[#001F5B] text-lg leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{ev.name}</h3>
                {ev.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 text-white flex-shrink-0" style={{ backgroundColor: eventCategoryColors[ev.category] || "#999" }}>{ev.category}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                {ev.date ? formatDate(ev.date) || ev.date : "Date TBA"} · <span className="text-[#FD652F] font-semibold">{ev.points} pts</span>
              </div>
              <button
                onClick={() => handleRequest(ev.event_id)}
                disabled={busy || done}
                className={`mt-auto w-full py-2.5 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${done ? "bg-[#2D8A4E] text-white cursor-default" : "bg-[#FD652F] text-white hover:bg-[#D33A02] disabled:opacity-60"}`}
              >
                {busy && <Loader2 size={14} className="animate-spin" />}
                {done ? <><Check size={14} /> Requested</> : busy ? "Requesting…" : "Request Points"}
              </button>
              {errMsg && <div className="text-xs text-red-500 mt-2">{errMsg}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Review & Events tab (exec only) ───────────────────────────────────────────
function ManageTab({ token, onRefresh }: { token: string; onRefresh: () => void }) {
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", date: "", points: "", category: "" });
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventMsg, setEventMsg] = useState<string | null>(null);

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
      await reviewEntry(token, entryId, decision);
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
      setForm({ name: "", date: "", points: "", category: "" });
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
          {pending.map((p) => (
            <div key={p.entry_id} className="bg-[#f8f8f7] border border-border p-4 flex items-center gap-4">
              <div className="w-12 text-center flex-shrink-0">
                <div className="text-xl font-bold text-[#FD652F] leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.points}</div>
                <div className="text-xs text-muted-foreground uppercase">pts</div>
              </div>
              <div className="h-8 w-px bg-border flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#001F5B] truncate">{p.member_name}</div>
                <div className="text-xs text-muted-foreground truncate">{p.event_name}{p.note ? ` · "${p.note}"` : ""}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleReview(String(p.entry_id), "approve")} disabled={busyId === String(p.entry_id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#2D8A4E] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"><Check size={13} /> Approve</button>
                <button onClick={() => handleReview(String(p.entry_id), "reject")} disabled={busyId === String(p.entry_id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground hover:border-red-400 hover:text-red-500 disabled:opacity-50 transition-colors"><X size={13} /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add event */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-[#001F5B] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Add Event</h2>
        <form onSubmit={handleAddEvent} className="bg-[#f8f8f7] border border-border p-6 flex flex-col gap-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Event name" className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]" required />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F] text-muted-foreground" />
          <input type="number" min="0" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} placeholder="Points (e.g. 10)" className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#FD652F]">
            <option value="">Category…</option>
            {Object.keys(eventCategoryColors).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" disabled={savingEvent} className="w-full py-2.5 text-sm font-medium bg-[#FD652F] text-white hover:bg-[#D33A02] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
            {savingEvent ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} {savingEvent ? "Adding…" : "Add Event"}
          </button>
          {eventMsg && <div className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle size={12} className="text-[#2D8A4E]" /> {eventMsg}</div>}
        </form>
      </div>
    </div>
  );
}
