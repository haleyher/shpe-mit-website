import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";
import { LoginModal } from "@/components/LoginModal";
import { HomePage } from "@/pages/home/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { EventsPage } from "@/pages/EventsPage";
import { ConventionPage } from "@/pages/ConventionPage";
import { ExecPage } from "@/pages/ExecPage";
import { CommServPage } from "@/pages/CommServPage";
import { SponsorsPage } from "@/pages/SponsorsPage";
import { ContactPage } from "@/pages/ContactPage";
import { PortalPage } from "@/pages/PortalPage";
import { useAuth } from "@/hooks/useAuth";
import type { Page } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Root of the app. It keeps track of which page is showing, and uses useAuth()
// for real member login (Sign in with Slack → Google Apps Script backend).
//
// Navigation is done with simple React state (not URLs) — clicking a nav link
// swaps `currentPage`. To add a NEW page:
//   1. Add its id to the `Page` type in src/types/index.ts.
//   2. Add a nav link in src/data/navigation.ts.
//   3. Create the page component in src/pages/ and add a `case` in renderPage below.
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const { member, points, entries, isLoggedIn, justLoggedIn, loggingIn, login, logout, refresh } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isPortal, setIsPortal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll so the navbar can fade from transparent to solid on the Home page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // After returning from Slack login, drop the member straight into their portal.
  useEffect(() => {
    if (justLoggedIn) setIsPortal(true);
  }, [justLoggedIn]);

  const navigate = (page: Page) => {
    setIsPortal(false);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => { logout(); setIsPortal(false); setCurrentPage("home"); };
  const openPortal = () => { setIsPortal(true); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const activePage: Page | "portal" = isPortal ? "portal" : currentPage;
  const transparent = currentPage === "home" && !isPortal && !scrolled;

  const renderPage = () => {
    if (isPortal && isLoggedIn && member) {
      return <PortalPage member={member} points={points} entries={entries} onRefresh={refresh} />;
    }
    switch (currentPage) {
      case "about": return <AboutPage />;
      case "events": return <EventsPage />;
      case "convention": return <ConventionPage onNavigate={navigate} />;
      case "exec": return <ExecPage />;
      case "commserv": return <CommServPage />;
      case "sponsors": return <SponsorsPage />;
      case "contact": return <ContactPage />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  // Full-screen "Signing you in…" while we finish a fresh Slack login.
  if (loggingIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#001F5B] px-6 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Loader2 size={40} className="text-[#FD652F] animate-spin" />
        <div>
          <div className="text-white font-bold text-2xl uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Signing you in…</div>
          <div className="text-white/60 text-sm mt-1">Connecting your SHPE MIT account</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar
        currentPage={activePage}
        onNavigate={navigate}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        onPortal={openPortal}
        transparent={transparent}
      />
      {renderPage()}
      {!isPortal && <Footer onNavigate={navigate} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={login} />}
    </div>
  );
}
