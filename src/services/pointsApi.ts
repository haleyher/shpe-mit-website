import { pointsConfig } from "@/config";
import type { AuthMember, EventItem, LeaderboardData, PendingRequest, PointEntry } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// POINTS BACKEND CLIENT
// Login uses the standard "Sign in with Slack" (OpenID Connect) flow:
//   1. startLogin()  → send the member straight to Slack's sign-in page.
//   2. Slack returns them to this website with a ?code=… in the URL.
//   3. exchangeCodeFromUrl() hands that code to the backend (which holds the
//      secret), gets back a signed session token, and stores it.
//   4. fetchMe() reads the member + points using that token.
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = "shpe_session_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Where Slack sends the member back to. Uses the configured siteUrl so it's a
// fixed, clean value (NOT derived from the asset base path). Must match the
// Slack app's Redirect URL exactly.
function redirectUri(): string {
  return pointsConfig.siteUrl || window.location.origin + "/";
}

// Step 1 — send the member straight to Slack to sign in.
export function startLogin(): void {
  const params = new URLSearchParams({
    response_type: "code",
    scope: "openid email profile",
    client_id: pointsConfig.slackClientId,
    redirect_uri: redirectUri(),
  });
  window.location.href = `https://slack.com/openid/connect/authorize?${params.toString()}`;
}

// Step 3 — if Slack returned us here with ?code=…, swap it for a session token.
// Returns the token, or null if there was no code in the URL.
export async function exchangeCodeFromUrl(): Promise<string | null> {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return null;

  // Clear the code from the address bar right away.
  history.replaceState(null, "", window.location.pathname);

  const url = `${pointsConfig.apiUrl}?action=exchange&code=${encodeURIComponent(code)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Login failed (${res.status}).`);
  const data = await res.json();
  if (!data.ok || !data.token) throw new Error(data.error || "Login failed.");
  setToken(data.token);
  return data.token as string;
}

export interface MeResponse {
  ok: boolean;
  error?: string;
  member?: AuthMember;
  points?: number;
  entries?: PointEntry[];
}

// Step 4 — load the logged-in member, their total points, and their history.
export async function fetchMe(token: string): Promise<MeResponse> {
  const url = `${pointsConfig.apiUrl}?action=me&token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status}).`);
  return res.json();
}

// ── Phase 2: events, point requests, and exec review ──────────────────────────

// Shared GET helper. The session token authenticates; a cache-buster keeps the
// browser from serving a stale response. Throws with the backend's error message.
async function apiGet(params: Record<string, string>): Promise<any> {
  const query = new URLSearchParams({ ...params, _: String(Date.now()) });
  const res = await fetch(`${pointsConfig.apiUrl}?${query.toString()}`);
  if (!res.ok) throw new Error(`Request failed (${res.status}).`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export async function listEvents(token: string): Promise<EventItem[]> {
  const data = await apiGet({ action: "events", token });
  return data.events || [];
}

export async function requestPoints(token: string, eventId: string, note: string): Promise<void> {
  await apiGet({ action: "requestPoints", token, eventId, note });
}

export async function listPending(token: string): Promise<PendingRequest[]> {
  const data = await apiGet({ action: "pending", token });
  return data.pending || [];
}

export async function reviewEntry(token: string, entryId: string, decision: "approve" | "reject"): Promise<void> {
  await apiGet({ action: "review", token, entryId, decision });
}

export async function createEvent(
  token: string,
  ev: { name: string; date: string; points: string; category: string; passcode: string },
): Promise<void> {
  await apiGet({ action: "createEvent", token, ...ev });
}

export async function fetchLeaderboard(token: string): Promise<LeaderboardData> {
  const data = await apiGet({ action: "leaderboard", token });
  return { full: data.full, top: data.top, me: data.me };
}

// Pull all GBM form responses into the ledger. Returns how many were added.
export async function syncForms(token: string): Promise<{ added: number; newEvents: number; newMembers: number }> {
  const data = await apiGet({ action: "sync", token });
  return { added: data.added || 0, newEvents: data.newEvents || 0, newMembers: data.newMembers || 0 };
}
