import { PageHeader } from "@/components/PageHeader";
import { EventsCalendar } from "@/components/EventsCalendar";
import { FeaturedEventCard } from "@/components/FeaturedEventCard";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

// The "Events" page: a big interactive calendar plus a sidebar with the next
// featured event and a newsletter sign-up. Events are loaded once here from
// Google Calendar and shared with both the calendar and the featured card.

export function EventsPage() {
  const { events, loading, error } = useCalendarEvents();

  return (
    <div className="pt-24">
      <PageHeader
        section="Events"
        title="Events & Programs"
        subtitle="Click any date to see events. Toggle the Google Calendar embed to sync with your calendar app."
      />
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventsCalendar events={events} loading={loading} error={error} />
          </div>
          <div className="flex flex-col gap-5">
            <FeaturedEventCard events={events} />
            <div className="bg-[#001F5B] p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#FD652F] mb-2">Stay in the Loop</div>
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Never Miss an Event</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-4">Subscribe to get notified about upcoming SHPE MIT events and opportunities.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@mit.edu" className="flex-1 px-3 py-2 text-xs border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#FD652F]" />
                <button className="px-4 py-2 bg-[#FD652F] text-white text-xs font-bold hover:bg-[#D33A02] transition-colors">Go</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
