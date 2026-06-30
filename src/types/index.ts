// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types used across the site.
// You normally do NOT need to edit this file to update content — see the files
// in `src/data/` instead. These types just describe the *shape* of that content
// so the editor can warn you if something is filled in incorrectly.
// ─────────────────────────────────────────────────────────────────────────────

/** The public pages of the site. Each value maps to one page component. */
export type Page =
  | "home"
  | "about"
  | "events"
  | "convention"
  | "exec"
  | "commserv"
  | "sponsors"
  | "contact";

/** Tabs shown inside the logged-in Member Portal. */
export type PortalTab = "overview" | "request" | "manage";

/** An event members can request points for (see apps-script Events tab). */
export interface EventItem {
  event_id: string;
  name: string;
  date: string;
  points: number;
  category: string;
  created_by?: string;
}

/** A pending point request in the exec review queue. */
export interface PendingRequest {
  entry_id: string | number;
  member_name: string;
  event_name: string;
  points: number;
  note?: string;
}

/** The logged-in member, returned by the backend's `me` endpoint. */
export interface AuthMember {
  slackUserId: string;
  name: string;
  email: string;
  role: "exec" | "general";
}

/** One row of the points ledger, returned by the backend (see apps-script/Code.gs). */
export interface PointEntry {
  entry_id: string | number;
  slack_user_id: string;
  event_id: string;
  points: number;
  status: "pending" | "approved" | "rejected";
  source: "self_request" | "exec_award";
  reviewed_by?: string;
  note?: string;
  created_at?: string;
}

/** A link in the top navigation bar and footer. */
export interface NavLink {
  label: string;
  page: Page;
}

/** An executive board officer (see src/data/officers.ts). */
export interface Officer {
  name: string;
  role: string;
  major: string;
  year: string;
  /** Two-letter initials shown in the headshot placeholder. */
  initials: string;
  /** Email shown behind the "email" button next to their name. */
  email: string;
  /** Optional imported headshot photo. Leave undefined to show the placeholder. */
  photo?: string;
}

/** A corporate sponsor (see src/data/sponsors.ts). */
export interface Sponsor {
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  tagline: string;
  /** Imported logo image, or null to show a clean text wordmark instead. */
  logo: string | null;
}

/** A featured event shown as a card on the Home page (see src/data/events.ts). */
export interface HomeEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
}

/** An event shown as a dot on the Events-page calendar (see src/data/events.ts). */
export interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  category: string;
}

/** A community-service program (see src/data/commserv.ts). */
export interface CommServProgram {
  title: string;
  description: string;
  impact: string;
  icon: string;
  /** Optional imported photo for this program. */
  photo?: string;
}

/** One panel of the interactive "What We Do" section (see src/data/home.ts). */
export interface WhatWeDoItem {
  number: string;
  category: string;
  title: string;
  desc: string;
  image: string;
}
