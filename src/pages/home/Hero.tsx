import { ArrowRight } from "lucide-react";
import { mitDome } from "@/assets/images";
import { heroTagline, heroStats } from "@/data/home";
import type { Page } from "@/types";

// The full-screen hero at the top of the Home page (MIT dome photo + big title).
// Edit the tagline and stat blocks in src/data/home.ts.

// Soft off-white used for text on the hero (easier on the eyes than pure white).
const cream = "#f8f8f7";
// A subtle shadow so text stays readable over the photo.
const textShadow = "0 2px 14px rgba(0, 12, 38, 0.55)";

export function Hero({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="relative h-screen overflow-hidden">
      <img src={mitDome} alt="MIT Great Dome" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 40%" }} />
      {/* Darkened gradients keep the off-white text legible over the photo. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00133D]/65 via-[#00133D]/25 to-[#00133D]/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#00133D]/55 via-transparent to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-between" style={{ paddingTop: "5.5rem", paddingBottom: "5rem", color: cream }}>
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-[#FD652F]" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ textShadow }}>{heroTagline}</span>
        </div>
        <div className="flex items-end justify-between gap-8">
          <div className="flex-1">
            <p className="text-lg md:text-xl font-semibold uppercase tracking-[0.16em] mb-5" style={{ textShadow }}>Society of Hispanic Professional Engineers</p>
            <h1 className="font-extrabold uppercase leading-[0.84]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(4.5rem, 13vw, 11rem)", textShadow: "0 4px 28px rgba(0, 12, 38, 0.6)" }}>
              SHPE<br /><span className="text-[#FD652F]">MIT</span>
            </h1>
          </div>
          <div className="hidden lg:flex flex-col gap-6 text-right mb-1 min-w-[200px]">
            {heroStats.map((stat, i) => (
              <div key={stat.label} className={i === 0 ? "border-b border-white/25 pb-6" : ""}>
                <div className="font-extrabold leading-none mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "3.5rem", textShadow }}>{stat.number}</div>
                <div className="text-sm font-semibold uppercase tracking-widest" style={{ textShadow }}>{stat.label}</div>
                <div className="text-xs mt-1.5 leading-snug" style={{ color: "rgba(248,248,247,0.7)", textShadow }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button onClick={() => onNavigate("about")} className="flex items-center gap-3 bg-[#f8f8f7] text-[#001F5B] font-bold px-8 py-3 text-sm hover:bg-[#FD652F] hover:text-white transition-all duration-300 shadow-xl uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}>
          Discover More <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}
