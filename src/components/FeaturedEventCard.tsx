import { Star } from "lucide-react";
import { eventCategoryColors } from "@/data/events";
import { MONTH_SHORT } from "@/utils/dates";
import type { CalendarEvent } from "@/types";

// Highlights the next upcoming event from the calendar (the soonest event whose
// date is today or later). Shown in the sidebar of the Events page. Events come
// from Google Calendar, passed in via props (see EventsPage).

export function FeaturedEventCard({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const featured = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  if (!featured) return null;

  const color = eventCategoryColors[featured.category] || "#FD652F";

  return (
    <div className="border border-border overflow-hidden">
      <div className="px-5 py-3.5 flex items-center gap-2 border-b border-border">
        <Star size={13} className="text-[#FD652F]" fill="#FD652F" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#001F5B]">Featured Event</span>
      </div>
      <div className="h-1.5" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#001F5B] px-3 py-2 text-center">
            <div className="font-bold text-[#FD652F] text-xl leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{featured.date.getDate()}</div>
            <div className="text-white/70 text-xs uppercase">{MONTH_SHORT[featured.date.getMonth()]}</div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 text-white" style={{ backgroundColor: color }}>{featured.category}</span>
        </div>
        <h3 className="text-xl font-bold text-[#001F5B] uppercase mb-2 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{featured.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">Mark your calendar! More details will be announced soon. Join our mailing list to stay updated on all SHPE MIT events.</p>
        <button className="w-full py-2.5 bg-[#FD652F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D33A02] transition-colors">Register / Learn More</button>
      </div>
    </div>
  );
}
