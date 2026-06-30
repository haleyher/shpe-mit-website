import { PageHeader } from "@/components/PageHeader";
import { EventsCalendar } from "@/components/EventsCalendar";
import { FeaturedEventCard } from "@/components/FeaturedEventCard";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import events1 from "@/assets/images/events/events1.jpg";
import events2 from "@/assets/images/events/events2.jpg";

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

      {/* Socials & mixers */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#E85D75]" />
              <span className="text-xs font-medium text-[#E85D75] uppercase tracking-widest">Socials & Mixers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#001F5B] uppercase mb-5 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>More Than Meetings</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We love bringing people together. Throughout the year we host <span className="font-semibold text-[#001F5B]">mixers</span> with other affinity and engineering communities — NSBE, Mujeres Latinas, Engineers Without Borders, and more — to build friendships across MIT.</p>
            <p className="text-muted-foreground leading-relaxed">And each year we throw a big <span className="font-semibold text-[#001F5B]">formal</span> for the local Boston SHPE chapters. Past celebrations have included <span className="italic">Gala Gigante</span> and <span className="italic">SHPE on a Ship</span> — nights to dress up, dance, and celebrate our community.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImagePlaceholder src={events1} ratio="aspect-[3/4]" alt="SHPE MIT social" />
            <ImagePlaceholder src={events2} ratio="aspect-[3/4]" alt="SHPE MIT formal" />
          </div>
        </div>
      </section>
    </div>
  );
}
