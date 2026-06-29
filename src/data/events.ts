import type { HomeEvent } from "@/types";
import { calendarConfig } from "@/config";

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS
//   • homepageEvents – the 3 highlighted cards in the "Upcoming Events" section
//                      on the Home page (edit these by hand).
//   • The Events-page calendar no longer uses a hardcoded list — it pulls events
//     live from Google Calendar (see src/services/googleCalendar.ts and
//     src/config.ts). Add/edit/remove events in Google Calendar and they appear
//     automatically; no code changes needed.
// ─────────────────────────────────────────────────────────────────────────────

// Colors for each event category (the dots on the calendar + the legend).
// Add a new category here and it automatically appears in the calendar legend.
export const eventCategoryColors: Record<string, string> = {
  GBM: "#FD652F",
  Social: "#E85D75",
  Professional: "#0070C0",
  CommServ: "#2D8A4E",
  Academic: "#72A9BE",
  Fundraiser: "#f99323",
};

// ── Home page: 3 featured cards ──────────────────────────────────────────────
export const homepageEvents: HomeEvent[] = [
  {
    id: 1,
    title: "Fall Kickoff & Networking Night",
    date: "Sep 12, 2026",
    time: "6:00 – 8:00 PM",
    location: "MIT Building 32-G449",
    category: "Social",
    description: "Kick off the semester with SHPE MIT! Meet the exec board and learn how to get involved.",
  },
  {
    id: 2,
    title: "Resume & Internship Workshop",
    date: "Sep 19, 2026",
    time: "5:30 – 7:30 PM",
    location: "MIT Building 4-231",
    category: "Professional",
    description: "Polish your resume and land your next internship with help from industry mentors.",
  },
  {
    id: 3,
    title: "K-12 STEM Saturday",
    date: "Oct 3, 2026",
    time: "10:00 AM – 2:00 PM",
    location: "Cambridge Rindge and Latin",
    category: "CommServ",
    description: "Lead hands-on STEM activities for Cambridge middle schoolers. Engineering challenges and coding demos.",
  },
];

// Embed URL for the optional Google Calendar iframe shown at the bottom of the
// Events page. Built from the same calendar ID configured in src/config.ts, so
// there's only one place to change the calendar.
export const googleCalendarEmbedUrl =
  `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarConfig.calendarId)}&ctz=America%2FNew_York&bgcolor=%23f8f8f7&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&mode=MONTH`;
