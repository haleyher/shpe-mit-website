import { useCallback, useEffect, useState } from "react";
import {
  clearToken,
  exchangeCodeFromUrl,
  fetchMe,
  getToken,
  startLogin,
} from "@/services/pointsApi";
import type { MeResponse } from "@/services/pointsApi";
import type { AuthMember, PointEntry } from "@/types";

// Manages member authentication for the website:
//  • finishes the Slack login if we just came back with a ?code=…
//  • otherwise reuses a stored session token
//  • loads the member + their points from the backend
//  • exposes login() / logout() / refresh()
// This is the single source of truth the Navbar + Member Portal consume.
export function useAuth() {
  const [member, setMember] = useState<AuthMember | null>(null);
  const [points, setPoints] = useState(0);
  const [entries, setEntries] = useState<PointEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  // True while we're finishing a fresh Slack login (the slow code-exchange step),
  // so the UI can show a "Signing you in…" screen instead of looking frozen.
  const [loggingIn, setLoggingIn] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("code")
  );

  // Apply a /me response to state (or log out if the token is no longer valid).
  const applyMe = useCallback((res: MeResponse) => {
    if (res.ok && res.member) {
      setMember(res.member);
      setPoints(res.points ?? 0);
      setEntries(res.entries ?? []);
      setError(null);
    } else {
      clearToken();
      setMember(null);
      setError(res.error ?? null);
    }
  }, []);

  // Re-load the member's points/history (call after a write succeeds).
  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      applyMe(await fetchMe(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't refresh your points.");
    }
  }, [applyMe]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // If Slack just sent us back with a code, finish login first.
        const fresh = await exchangeCodeFromUrl();
        if (fresh && active) setJustLoggedIn(true);

        const token = fresh ?? getToken();
        if (!token) return;

        const res = await fetchMe(token);
        if (active) applyMe(res);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Couldn't reach the member system.");
      } finally {
        if (active) { setLoading(false); setLoggingIn(false); }
      }
    })();

    return () => { active = false; };
  }, [applyMe]);

  const logout = () => {
    clearToken();
    setMember(null);
    setPoints(0);
    setEntries([]);
    setJustLoggedIn(false);
  };

  return {
    member,
    points,
    entries,
    loading,
    loggingIn,
    error,
    justLoggedIn,
    isLoggedIn: !!member,
    login: startLogin,
    logout,
    refresh,
  };
}
