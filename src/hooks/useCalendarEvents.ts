import { useEffect, useState } from "react";
import { fetchCalendarEvents } from "@/services/googleCalendar";
import type { CalendarEvent } from "@/types";

// React hook that loads the Google Calendar events once and exposes loading and
// error states. This is the single data source the Events page consumes.
export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCalendarEvents()
      .then((data) => { if (active) { setEvents(data); setError(null); } })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Failed to load events."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { events, loading, error };
}
