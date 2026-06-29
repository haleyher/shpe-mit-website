# SHPE MIT Website

The website for the MIT chapter of the Society of Hispanic Professional Engineers.
Built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

> **New to this?** Most updates (officers, events, sponsors, homepage text) don't
> require any real coding — you just edit lists of text in the `src/data/` folder.
> Jump to ["Where to update content"](#where-to-update-content) below.

---

## Running the site on your computer

You'll need [Node.js](https://nodejs.org) installed (LTS version is fine). Then,
from this folder, in a terminal:

```bash
npm install      # first time only — downloads the tools the site needs
npm run dev      # starts a live preview at http://localhost:5173
```

Leave `npm run dev` running while you edit — the preview updates automatically
every time you save a file. Press `Ctrl + C` in the terminal to stop it.

To make the final files for hosting the site live:

```bash
npm run build    # output goes into the dist/ folder
npm run preview  # preview that production build locally
```

---

## Where to update content

Everything you'll typically change lives in **`src/data/`**. Each file is a
plain list — copy an existing entry, change the text, and save. You do **not**
need to touch the page layout code.

| What you want to change | File to edit |
| --- | --- |
| **Officers / exec board** (incl. their email buttons) | `src/data/officers.ts` |
| **Home page "Upcoming Events" cards** | `src/data/events.ts` (`homepageEvents`) |
| **Events-page calendar** | _Add events in Google Calendar_ — see ["Events calendar"](#events-calendar-google-calendar) below |
| **Which Google Calendar to use** | `src/config.ts` or a `.env.local` file |
| **Sponsors** (and tiers: platinum/gold/silver/bronze) | `src/data/sponsors.ts` |
| **Homepage text & stats** (hero, mission, "What We Do") | `src/data/home.ts` |
| **About page text & stats** | `src/data/about.ts` |
| **National Convention page** | `src/data/convention.ts` |
| **Community service programs** | `src/data/commserv.ts` |
| **Menu links, email, social links** | `src/data/navigation.ts` |
| **Member portal sample data** | `src/data/member.ts` |

Every data file has comments at the top explaining each field. A few common tasks:

- **Update the exec board each year** → edit the list in `src/data/officers.ts`.
  To add real headshot photos, follow the steps at the top of
  `src/components/TeamMember.tsx`.
- **Add an event to the calendar** → just add it in Google Calendar (see below).
  The Events-page calendar updates automatically — no code changes needed.
- **Change the 3 featured cards on the home page** → edit `homepageEvents` in
  `src/data/events.ts` (these are separate from the live calendar).
- **Add a sponsor** → add an entry to `sponsors` in `src/data/sponsors.ts` and pick a
  `tier` of `"platinum"`, `"gold"`, `"silver"`, or `"bronze"`. Sponsors without a
  logo automatically show a clean text wordmark. To add a real logo, drop the file
  in `src/assets/images/sponsors/` and import it (instructions are in the comments).
- **Change homepage copy or numbers** → `src/data/home.ts`.
- **Update officer emails** → `src/data/officers.ts` (the email button next to each
  name currently points at the shared `shpe-mit@mit.edu` — swap in individual MIT
  emails when you have them).

### Adding photos (picture spaces)

Several pages (About, CommServ, Convention) have **picture spaces** — dashed boxes
that say "Add a photo." To fill one in:

1. Put the image in `src/assets/images/` and register it in
   `src/assets/images/index.ts`.
2. Import it on the page and pass it to the placeholder, e.g.
   `<ImagePlaceholder src={myPhoto} alt="..." />`.

The same pattern works anywhere — `import { yourImage } from "@/assets/images"`.

### Events calendar (Google Calendar)

The calendar on the **Events** page is powered by a public **Google Calendar**.
Add, edit, move, or delete an event in Google Calendar and the website updates on
its own — recurring events, times, and time zones are all handled for you. There
is **nothing to change in the code** when events change.

**One-time setup** (needed so the site can read the calendar):

1. Copy `.env.example` to a new file named `.env.local`.
2. Follow the steps in that file to (a) make the calendar public, (b) copy its
   Calendar ID, and (c) create a Google API key with the "Google Calendar API"
   enabled.
3. Paste both values into `.env.local` and restart `npm run dev`.

To point the site at a **different** calendar later, just change
`VITE_GOOGLE_CALENDAR_ID` in `.env.local` (or the fallback in `src/config.ts`).

How it fits together: `src/config.ts` (which calendar) → `src/services/googleCalendar.ts`
(fetches + parses the events) → `src/hooks/useCalendarEvents.ts` (loading/error
state) → the Events page. Event colors/categories come from the keyword in each
event's title (e.g. "Social", "GBM", "Professional") — see the category list in
`src/services/googleCalendar.ts`.

---

## How the project is organized

```
src/
├── App.tsx              Root: navigation state, decides which page to show
├── main.tsx             Entry point (you won't need to touch this)
├── config.ts            Which Google Calendar the Events page reads
│
├── data/                ⭐ ALL editable content lives here (see table above)
├── assets/images/       Photos and logos
│
├── pages/               One file per page
│   ├── home/            The home page, split into Hero, WhatWeDo, etc.
│   ├── AboutPage.tsx
│   ├── EventsPage.tsx
│   ├── ConventionPage.tsx
│   ├── ExecPage.tsx
│   ├── CommServPage.tsx
│   ├── SponsorsPage.tsx
│   ├── ContactPage.tsx
│   └── PortalPage.tsx
│
├── layouts/             Navbar and Footer (shown on every page)
├── components/          Reusable pieces (EventCard, TeamMember, calendar, …)
├── services/            Google Calendar fetching + parsing
├── hooks/               useCalendarEvents (loading/error state)
├── types/               Shared TypeScript types (the "shape" of the data)
├── utils/               Small helpers (e.g. month names)
└── styles/              Fonts, Tailwind setup, and the color theme
```

### Brand colors

The site uses a cool off-white background with a navy + orange core and a few
accent "pops":

- **Off-white background** `#f8f8f7`
- **Navy** `#001F5B`
- **Orange (primary accent)** `#FD652F`
- **Deep orange (hover/secondary)** `#D33A02`
- **Accent hints** — gold `#f99323`, blue `#0070C0`, teal `#72A9BE`

To recolor, search the project for the hex code you want to change.

---

## Things that are demos (not yet wired up)

A few features look real but are placeholders until a backend is added:

- **Member Login & Portal** — logging in does not check a real password; the portal
  shows sample data from `src/data/member.ts`.
- **Contact form** — submitting shows a thank-you message but does not actually
  send an email. See the note in `src/pages/ContactPage.tsx` to connect a real
  form service.
- **Newsletter sign-up** on the Events page is visual only.

---

## Adding a brand-new page

1. Add the page's id to the `Page` type in `src/types/index.ts`.
2. Add a menu link in `src/data/navigation.ts`.
3. Create the page component in `src/pages/`.
4. Add a `case` for it in the `renderPage` function in `src/App.tsx`.
