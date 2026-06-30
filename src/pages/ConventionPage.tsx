import { Briefcase, GraduationCap, Users, Award, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import {
  conventionIntro,
  conventionHighlights,
  conventionSupport,
  conventionCta,
} from "@/data/convention";
import conv1 from "@/assets/images/convention/conv1.jpg";
import conv2 from "@/assets/images/convention/conv2.jpg";
import conv3 from "@/assets/images/convention/conv3.jpg";
import conv4 from "@/assets/images/convention/conv4.jpg";
import conv5 from "@/assets/images/convention/conv5.jpg";
import type { Page } from "@/types";

// The "Convention" page — explains the SHPE National Convention to new members
// and sponsors, and ties it to our professional-development goal.
// Edit all copy in src/data/convention.ts. The <ImagePlaceholder> blocks are
// spots for photos from past conventions.

// Maps the icon names used in src/data/convention.ts to Lucide components.
const icons = { Briefcase, GraduationCap, Users, Award } as const;

export function ConventionPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="pt-24">
      <PageHeader
        section="Professional Development"
        title="SHPE National Convention"
        subtitle="The largest gathering of Hispanic STEM talent in the country — and a cornerstone of how SHPE MIT launches careers."
      />
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Intro + a big feature photo */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#FD652F]" />
                <span className="text-xs font-medium text-[#FD652F] uppercase tracking-widest">What Is Convention?</span>
              </div>
              <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Three Days That Change Careers</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{conventionIntro}</p>
            </div>
            <ImagePlaceholder src={conv1} ratio="aspect-[4/3]" alt="SHPE MIT at the National Convention" />
          </div>

          {/* Why it matters — highlight cards */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-[#0070C0]" />
              <span className="text-xs font-medium text-[#0070C0] uppercase tracking-widest">Why It Matters</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {conventionHighlights.map((item) => {
                const Icon = icons[item.icon as keyof typeof icons];
                return (
                  <div key={item.title} className="border border-border p-6 bg-[#f8f8f7] hover:border-[#FD652F] hover:shadow-md transition-all duration-300">
                    <div className="mb-4" style={{ color: item.color }}>{Icon && <Icon size={24} />}</div>
                    <h3 className="font-bold text-[#001F5B] text-lg uppercase mb-2 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photo gallery from past conventions */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#72A9BE]" />
              <span className="text-xs font-medium text-[#72A9BE] uppercase tracking-widest">From Past Conventions</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ImagePlaceholder src={conv2} ratio="aspect-square" alt="Convention moment" />
              <ImagePlaceholder src={conv3} ratio="aspect-square" alt="Convention moment" />
              <ImagePlaceholder src={conv4} ratio="aspect-square" alt="Convention moment" />
              <ImagePlaceholder src={conv5} ratio="aspect-square" alt="Convention moment" />
            </div>
          </div>

          {/* How we help members attend */}
          <div className="bg-[#001F5B] p-10 md:p-14 mb-20">
            <h2 className="text-3xl font-bold text-white uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>How We Get Our Members There</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {conventionSupport.map((s) => (
                <div key={s.title}>
                  <div className="flex items-center gap-2 text-[#FD652F] mb-2">
                    <CheckCircle size={16} />
                    <h3 className="font-bold uppercase text-sm tracking-wide">{s.title}</h3>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA for sponsors */}
          <div className="border-2 border-[#FD652F] p-12 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{conventionCta.title}</h2>
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">{conventionCta.body}</p>
            </div>
            <button onClick={() => onNavigate("sponsors")} className="flex-shrink-0 px-10 py-4 bg-[#FD652F] text-white font-bold hover:bg-[#D33A02] transition-all duration-300 text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{conventionCta.buttonLabel}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
