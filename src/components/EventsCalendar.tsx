import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { eventCategoryColors, googleCalendarEmbedUrl } from "@/data/events";
import { MONTH_NAMES, DAY_NAMES } from "@/utils/dates";
import type { CalendarEvent } from "@/types";

// Interactive month calendar shown on the Events page. Click a day to see its
// events; toggle the optional Google Calendar embed at the bottom.
// Events are loaded from Google Calendar and passed in via props (see EventsPage).

export function EventsCalendar({ events, loading, error }: { events: CalendarEvent[]; loading: boolean; error: string | null }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build the grid cells: leading blanks, then each day, then trailing blanks.
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsOnDay = (day: number) =>
    events.filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month && e.date.getDate() === day);

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : [];

  return (
    <div>
      {/* Header: month label + prev / today / next */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#001F5B]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{MONTH_NAMES[month]} {year}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); }} className="w-8 h-8 flex items-center justify-center border border-border hover:border-[#FD652F] hover:text-[#FD652F] transition-colors">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => { setViewDate(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDay(today.getDate()); }} className="px-3 py-1.5 text-xs font-medium border border-border hover:border-[#FD652F] hover:text-[#FD652F] transition-colors uppercase tracking-wider">
            Today
          </button>
          <button onClick={() => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); }} className="w-8 h-8 flex items-center justify-center border border-border hover:border-[#FD652F] hover:text-[#FD652F] transition-colors">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2 uppercase tracking-widest">{d}</div>)}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="aspect-square" />;
          const dayEvents = eventsOnDay(day);
          const todayFlag = isToday(day);
          const selected = selectedDay === day;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(selected ? null : day)}
              className={`aspect-square flex flex-col items-center pt-2 px-1 transition-all duration-200 ${selected ? "bg-[#001F5B]" : todayFlag ? "border-2 border-[#FD652F]" : "border border-transparent hover:border-border hover:bg-muted"}`}
            >
              <span className={`text-sm font-medium leading-none mb-1.5 ${selected ? "text-white" : todayFlag ? "text-[#FD652F] font-bold" : "text-foreground"}`}>{day}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center">
                  {dayEvents.slice(0, 3).map((e, ei) => (
                    <div key={ei} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: eventCategoryColors[e.category] || "#999" }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading / error status (only appears while fetching or on failure) */}
      {loading && <div className="mt-3 text-xs text-muted-foreground">Loading events…</div>}
      {error && !loading && <div className="mt-3 text-xs text-muted-foreground">{error}</div>}

      {/* Selected-day panel */}
      {selectedDay && (
        <div className="mt-4 p-4 border border-border bg-[#f8f8f7]">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{MONTH_NAMES[month]} {selectedDay}</div>
          {selectedEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground">No events on this day.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: eventCategoryColors[e.category] }} />
                  <span className="text-sm text-[#001F5B] font-medium">{e.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{e.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category legend */}
      <div className="flex flex-wrap gap-4 mt-5 pb-5 border-b border-border">
        {Object.entries(eventCategoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-muted-foreground">{cat}</span>
          </div>
        ))}
      </div>

      {/* Optional Google Calendar embed */}
      <div className="mt-5">
        <button onClick={() => setShowEmbed(!showEmbed)} className="flex items-center gap-2 text-sm font-medium text-[#001F5B] hover:text-[#FD652F] transition-colors">
          <Calendar size={14} />
          {showEmbed ? "Hide Google Calendar Embed" : "Show Google Calendar Embed"}
          <ChevronRight size={13} className={`transition-transform duration-300 ${showEmbed ? "rotate-90" : ""}`} />
        </button>
        {showEmbed && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              To show your own Google Calendar, update <code className="bg-muted px-1 py-0.5">googleCalendarEmbedUrl</code> in src/data/events.ts.
            </p>
            <div className="border border-border overflow-hidden">
              <iframe
                src={googleCalendarEmbedUrl}
                style={{ borderWidth: 0 }}
                width="100%"
                height="420"
                title="SHPE MIT Google Calendar"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
