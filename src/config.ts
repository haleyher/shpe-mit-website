// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
// The Events-page calendar pulls its events live from a public Google Calendar.
// Configure it here — preferably via a .env file so the API key isn't committed
// (see .env.example). The values below are used as fallbacks if no env var is set.
//
//   VITE_GOOGLE_CALENDAR_ID  – the calendar's ID (Calendar settings → "Integrate
//                              calendar" → Calendar ID). The calendar must be PUBLIC.
//   VITE_GOOGLE_API_KEY      – a Google API key with the "Google Calendar API"
//                              enabled. Required to read the calendar.
// ─────────────────────────────────────────────────────────────────────────────
export const calendarConfig = {
  calendarId:
    import.meta.env.VITE_GOOGLE_CALENDAR_ID ||
    "56d36bf0e3bc455597678635a94549acca94798cff993f644a5b2b9bbda4acfe@group.calendar.google.com",
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || "",
};

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER POINTS BACKEND
// ─────────────────────────────────────────────────────────────────────────────
// The Member Login + portal talk to the Google Apps Script web app (the "points
// backend" — see apps-script/SETUP.md). `apiUrl` is the deployed web-app URL
// ending in /exec. It's public (not a secret), so it's fine to keep here; you
// can also override it with VITE_POINTS_API_URL in a .env file.
// ─────────────────────────────────────────────────────────────────────────────
export const pointsConfig = {
  // The Apps Script web-app URL (ends in /exec).
  apiUrl:
    import.meta.env.VITE_POINTS_API_URL ||
    "https://script.google.com/macros/s/AKfycbwn4RcFimLAdzz10-ULmg3QnWDTDk6fzF44-Fk28SMfZ5Jh4U3gJi841KaJQlVJOxc/exec",
  // Slack app Client ID (public — safe to keep here). Used to start the login.
  slackClientId: import.meta.env.VITE_SLACK_CLIENT_ID || "2566533801857.11466251218710",
  // Where Slack sends members back after login. This MUST match, character-for-
  // character, BOTH the Redirect URL registered in the Slack app AND the SITE_URL
  // Script Property in the backend. Keep it clean: https, no trailing dot.
  siteUrl: import.meta.env.VITE_SITE_URL || "https://shpe.mit.edu/",
};
