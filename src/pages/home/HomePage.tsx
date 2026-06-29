import { Users, Award, Heart, Star, ChevronRight } from "lucide-react";
import { Hero } from "./Hero";
import { WhatWeDo } from "./WhatWeDo";
import { missionTeaser, missionHighlights } from "@/data/home";
import type { Page } from "@/types";

// The Home page. It stitches together the sections below in order.
// • Hero / WhatWeDo live in their own files in this folder.
// • All the text & numbers come from src/data/home.ts and src/data/events.ts.

// Maps the icon names used in src/data/home.ts to actual Lucide icon components.
const icons = { Users, Award, Heart, Star } as const;

export function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div>
      <Hero onNavigate={onNavigate} />

      {/* Mission teaser */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#FD652F]" />
              <span className="text-xs font-medium text-[#FD652F] uppercase tracking-widest">Our Mission</span>
            </div>
            <h2 className="text-4xl font-bold text-[#001F5B] uppercase mb-6 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Building the Next Generation of Hispanic Engineers</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{missionTeaser}</p>
            <button onClick={() => onNavigate("about")} className="flex items-center gap-2 text-[#FD652F] font-medium hover:gap-3 transition-all text-sm">Read our full story <ChevronRight size={15} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {missionHighlights.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons];
              return (
                <div key={item.title} className="border border-border p-5 hover:border-[#FD652F] hover:shadow-sm transition-all duration-300">
                  <div className="mb-3" style={{ color: item.color }}>{Icon && <Icon size={18} />}</div>
                  <div className="font-semibold text-[#001F5B] mb-1.5 text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider between the mission and "What We Do" (the stats live in the hero) */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <div className="h-1.5 w-1.5 rotate-45 bg-[#FD652F]" />
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>

      <WhatWeDo />

      {/* Call to action */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto border-2 border-[#FD652F] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl font-bold text-[#001F5B] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Ready to Join SHPE MIT?</h2>
            <p className="text-muted-foreground max-w-lg text-sm">Open to all MIT students who share our values of community, excellence, and service.</p>
          </div>
          <button onClick={() => onNavigate("contact")} className="flex-shrink-0 px-10 py-4 bg-[#FD652F] text-white font-bold hover:bg-[#D33A02] transition-all duration-300 text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Get Involved</button>
        </div>
      </section>
    </div>
  );
}
