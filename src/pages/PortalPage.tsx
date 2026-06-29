import { useState } from "react";
import { Calendar, Users, TrendingUp, Clock, MapPin, CheckCircle } from "lucide-react";
import { memberData } from "@/data/member";
import type { AuthMember, PointEntry, PortalTab } from "@/types";

// The logged-in Member Portal.
//
// Phase 1 (live now): the Overview tab shows REAL data — the member's name,
// points, and point history — loaded from the Google Sheet backend.
//
// The "My Calendar", "Committees", and "Ways to Join" tabs still show sample
// data from src/data/member.ts; they'll be wired to the backend in later phases.

// Target points for the semester (used for the progress bar). Adjust as needed.
const POINTS_GOAL = 300;

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
}: {
  member: AuthMember;
  points: number;
  entries: PointEntry[];
}) {
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");

  const pct = Math.min(100, Math.round((points / POINTS_GOAL) * 100));
  const approvedCount = entries.filter((e) => e.status === "approved").length;
  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const history = [...entries].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );

  const tabs: { id: PortalTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "calendar", label: "My Calendar" },
    { id: "committees", label: "Committees" },
    { id: "join", label: "Ways to Join" },
  ];

  return (
    <div className="pt-16 min-h-screen bg-muted">
      {/* Welcome banner */}
      <div className="bg-[#001F5B] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#FD652F]" />
            <span className="text-xs font-medium text-[#FD652F] uppercase tracking-widest">Member Portal</span>
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
        {/* Overview tab — LIVE data */}
        {activeTab === "overview" && (
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
                { label: "Entries Logged", value: entries.length, icon: <TrendingUp size={18} />, sub: "all time" },
                { label: "Member Role", value: member.role === "exec" ? "Exec" : "Member", icon: <Users size={18} />, sub: "your access" },
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
                <div className="text-sm text-muted-foreground">No points logged yet. Attend an event to get started!</div>
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
                          {e.note ? ` · ${e.note}` : ""}
                        </div>
                      </div>
                      <span className={`text-xs font-medium border px-2 py-1 flex-shrink-0 capitalize ${statusStyle[e.status] || "text-muted-foreground border-border"}`}>{e.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Calendar tab — sample data (wired up in a later phase) */}
        {activeTab === "calendar" && (
          <div className="bg-[#f8f8f7] border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-[#001F5B] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>My Calendar</h2>
              <p className="text-sm text-muted-foreground mt-1">Events you are registered for this semester.</p>
            </div>
            <div className="divide-y divide-border">
              {memberData.upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-6 p-6 hover:bg-muted transition-colors duration-200">
                  <div className="w-16 h-16 bg-[#001F5B] flex flex-col items-center justify-center flex-shrink-0">
                    <div className="text-2xl font-bold text-[#FD652F] leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{event.date.split(" ")[1]}</div>
                    <div className="text-white/60 text-xs uppercase">{event.date.split(" ")[0]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#001F5B] mb-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={10} /> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {event.location}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#FD652F] border border-[#FD652F] px-3 py-1 flex-shrink-0">Registered</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Committees tab — sample data (wired up in a later phase) */}
        {activeTab === "committees" && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-[#f8f8f7] border border-border p-8">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">My Active Committees</div>
              <div className="flex flex-col gap-3">
                {memberData.committees.map((c) => (
                  <div key={c} className="flex items-center gap-4 p-4 border border-[#FD652F] bg-accent">
                    <CheckCircle size={18} className="text-[#FD652F] flex-shrink-0" />
                    <div><div className="font-medium text-[#001F5B]">{c}</div><div className="text-xs text-muted-foreground">Active member</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#f8f8f7] border border-border p-8">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Committee Benefits</div>
              <div className="flex flex-col gap-3">
                {["Earn additional points per meeting attended", "Leadership opportunities each semester", "Direct mentorship from exec board members", "Priority registration for exclusive events", "Letter of support for internship applications"].map((b) => (
                  <div key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-[#FD652F] rounded-full mt-2 flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ways to Join tab — sample data (wired up in a later phase) */}
        {activeTab === "join" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Ways to Get Involved</h2>
              <p className="text-muted-foreground text-sm">Join a committee to deepen your impact and earn more points this semester.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {memberData.joinOptions.map((opt) => (
                <div key={opt.committee} className="bg-[#f8f8f7] border border-border p-8 hover:border-[#FD652F] hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#001F5B] uppercase group-hover:text-[#FD652F] transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{opt.committee}</h3>
                    <span className="text-xs text-[#FD652F] border border-[#FD652F] px-2 py-0.5 flex-shrink-0 ml-3">{opt.openSlots} {opt.openSlots === 1 ? "spot" : "spots"} open</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{opt.description}</p>
                  <button className="w-full py-2.5 bg-[#FD652F] text-white text-sm font-medium hover:bg-[#D33A02] transition-all duration-300">Apply to Join</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
