import { calendarConfig } from "@/config";
import { eventCategoryColors } from "@/data/events";
import type { CalendarEvent } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE CALENDAR SERVICE
// Fetches events from a public Google Calendar and converts them into the same
// `CalendarEvent` shape the UI already uses ({ id, title, date, category }).
// Nothing here needs editing when events change — add/edit/remove events in
// Google Calendar and they show up automatically. Configure the calendar in
// src/config.ts.
// ─────────────────────────────────────────────────────────────────────────────

// Minimal shape of the fields we read from the Google Calendar API response.
interface GoogleEvent {
  status?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
}

// Categories the UI knows about (drives the dot colors + legend). An event is
// matched to one of these by looking for the keyword in its title, so the board
// can colour an event just by naming it (e.g. "Social: Bowling Night"). Events
// that don't match fall back to the first category.
const CATEGORY_ALIASES: Record<string, string> = {
  gbm: "GBM",
  social: "Social",
  professional: "Professional",
  "prof dev": "Professional",
  commserv: "CommServ",
  "community service": "CommServ",
  academic: "Academic",
  fundraiser: "Fundraiser",
};
const DEFAULT_CATEGORY = Object.keys(eventCategoryColors)[0] ?? "GBM";

function categoryFor(title: string): string {
  const text = title.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_ALIASES)) {
    if (text.includes(keyword)) return category;
  }
  return DEFAULT_CATEGORY;
}

// Turn a Google start object into a local Date.
//  • Timed events ("dateTime") include a timezone offset, so `new Date` is exact.
//  • All-day events ("date" = "YYYY-MM-DD") must be built from parts, otherwise
//    they'd be parsed as UTC midnight and could land on the previous day.
function parseStart(start: { dateTime?: string; date?: string }): Date {
  if (start.dateTime) return new Date(start.dateTime);
  const [year, month, day] = (start.date ?? "").split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Fetch all events from the configured public Google Calendar.
 * Recurring events are expanded (singleEvents=true) and the result is sorted
 * chronologically. Throws a friendly Error if the calendar can't be reached.
 */
export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const { calendarId, apiKey } = calendarConfig;
  if (!apiKey) {
    throw new Error("Google Calendar isn't configured yet (missing API key — see README).");
  }

  // Pull events from the start of the current year onward. `singleEvents=true`
  // expands recurring events into individual instances; `orderBy=startTime`
  // returns them in chronological order.
  const timeMin = new Date(new Date().getFullYear(), 0, 1).toISOString();
  const params = new URLSearchParams({
    key: apiKey,
    singleEvents: "true",
    orderBy: "startTime",
    timeMin,
    maxResults: "2500",
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Couldn't load the calendar (error ${res.status}).`);
  }

  const data: { items?: GoogleEvent[] } = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];

  return items
    .filter((item) => item.status !== "cancelled" && (item.start?.dateTime || item.start?.date))
    .map((item, index) => ({
      id: index + 1,
      title: item.summary ?? "(untitled event)",
      date: parseStart(item.start!),
      category: categoryFor(item.summary ?? ""),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
