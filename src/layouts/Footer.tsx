import { shpeLogo } from "@/assets/images";
import { navLinks, contact } from "@/data/navigation";
import type { Page } from "@/types";

// The dark footer shown at the bottom of every page (except the Member Portal).
// Edit the links and email in src/data/navigation.ts.

export function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <footer className="bg-[#001F5B] py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="mb-5">
              <img src={shpeLogo} alt="SHPE MIT" className="h-10 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">Society of Hispanic Professional Engineers at MIT. Empowering the next generation of Hispanic engineers.</p>
          </div>
          <div>
            <div className="text-xs font-medium text-[#FD652F] uppercase tracking-widest mb-4">Navigation</div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {navLinks.map((l) => (
                <button key={l.page} onClick={() => onNavigate(l.page)} className="text-left text-sm text-white/60 hover:text-white transition-colors">{l.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-[#FD652F] uppercase tracking-widest mb-4">Connect</div>
            <div className="flex flex-col gap-2">
              {contact.socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors">{s.label}</a>)}
              <a href={`mailto:${contact.email}`} className="text-sm text-white/60 hover:text-white transition-colors mt-1">{contact.email}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-white/30 text-xs">© 2025 SHPE MIT. All rights reserved.</p>
          <p className="text-white/30 text-xs">A chapter of SHPE National</p>
        </div>
      </div>
    </footer>
  );
}
