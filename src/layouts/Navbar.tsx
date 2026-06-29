import { useState } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { shpeLogo } from "@/assets/images";
import { navLinks } from "@/data/navigation";
import type { Page } from "@/types";

// The fixed top navigation bar. On the Home page it starts transparent over the
// hero image and turns solid once you scroll (controlled by `transparent`).
// Edit the menu items in src/data/navigation.ts.

export function Navbar({
  currentPage,
  onNavigate,
  isLoggedIn,
  onLoginClick,
  onLogout,
  onPortal,
  transparent,
}: {
  currentPage: Page | "portal";
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onPortal: () => void;
  transparent: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkBase = "px-4 py-2 text-sm font-medium transition-all duration-300";
  const linkColor = (active: boolean) =>
    active ? "text-[#FD652F]" : transparent ? "text-white/85 hover:text-white" : "text-[#001F5B] hover:text-[#FD652F]";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${transparent ? "bg-transparent" : "bg-[#f8f8f7]/95 backdrop-blur-md border-b border-border shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => { onNavigate("home"); setMobileOpen(false); }}>
          <img
            src={shpeLogo}
            alt="SHPE MIT — Leading Hispanics in STEM"
            className="h-8 w-auto object-contain transition-all duration-300"
            style={{ filter: transparent ? "brightness(0) invert(1)" : "none" }}
          />
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center">
          {navLinks.map((l) => (
            <button key={l.page} onClick={() => onNavigate(l.page)} className={`${linkBase} ${linkColor(currentPage === l.page)}`}>{l.label}</button>
          ))}
        </div>

        {/* Desktop login / portal buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button onClick={onPortal} className={`${linkBase} ${linkColor(currentPage === "portal")}`}>My Portal</button>
              <button onClick={onLogout} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border transition-all duration-300 ${transparent ? "border-white/50 text-white hover:bg-white hover:text-[#001F5B]" : "border-[#001F5B] text-[#001F5B] hover:bg-[#001F5B] hover:text-white"}`}>
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className={`flex items-center gap-1.5 px-5 py-2 text-sm font-medium transition-all duration-300 ${transparent ? "bg-white/15 backdrop-blur-sm border border-white/40 text-white hover:bg-white hover:text-[#001F5B]" : "bg-[#FD652F] text-white hover:bg-[#D33A02]"}`}>
              <LogIn size={13} /> Member Login
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className={`md:hidden transition-colors duration-300 ${transparent ? "text-white" : "text-[#001F5B]"}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#f8f8f7]/97 backdrop-blur-md border-t border-border px-6 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <button key={l.page} onClick={() => { onNavigate(l.page); setMobileOpen(false); }} className={`py-2.5 text-left text-sm font-medium border-b border-border last:border-0 ${currentPage === l.page ? "text-[#FD652F]" : "text-[#001F5B]"}`}>{l.label}</button>
          ))}
          <div className="pt-3">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <button onClick={() => { onPortal(); setMobileOpen(false); }} className="py-2 text-left text-sm text-[#001F5B]">My Portal</button>
                <button onClick={() => { onLogout(); setMobileOpen(false); }} className="py-2 text-left text-sm text-[#001F5B]">Logout</button>
              </div>
            ) : (
              <button onClick={() => { onLoginClick(); setMobileOpen(false); }} className="w-full py-2.5 bg-[#FD652F] text-white text-sm font-medium">Member Login</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
