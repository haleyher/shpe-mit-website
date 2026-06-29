import { Calendar, MapPin } from "lucide-react";
import type { HomeEvent } from "@/types";

// A single event card. Used in the "Upcoming Events" grid on the Home page.
// Edit the events themselves in src/data/events.ts.

// Background color per category badge. Categories not listed fall back to gray.
const categoryStyle: Record<string, string> = {
  Professional: "bg-[#0070C0] text-white",
  Social: "bg-[#FD652F] text-white",
  CommServ: "bg-[#2D8A4E] text-white",
};

export function EventCard({ event }: { event: HomeEvent }) {
  return (
    <div className="bg-[#f8f8f7] border border-border p-6 hover:border-[#FD652F] hover:shadow-md transition-all duration-300 group">
      <div className="mb-4">
        <span className={`inline-block text-xs font-medium px-2.5 py-1 ${categoryStyle[event.category] || "bg-muted text-foreground"}`}>
          {event.category}
        </span>
      </div>
      <h3 className="font-semibold text-[#001F5B] text-lg mb-2 group-hover:text-[#FD652F] transition-colors leading-snug" style={{ fontFamily: "'Barlow', sans-serif" }}>
        {event.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{event.description}</p>
      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-[#FD652F]" />
          {event.date} · {event.time}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-[#FD652F]" />
          {event.location}
        </div>
      </div>
    </div>
  );
}
