import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { missionParagraphs, whatWeDo, aboutStats } from "@/data/about";

// The "About" page. All copy lives in src/data/about.ts.
// The <ImagePlaceholder> blocks are spots for photos — see that component for
// how to drop in real pictures.

// Accent colors cycled across the "What We Do" items for a little variety.
const accents = ["#FD652F", "#0070C0", "#72A9BE", "#f99323"];

export function AboutPage() {
  return (
    <div className="pt-24">
      <PageHeader section="About Us" title="Who We Are" />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        {/* Mission + a feature photo of the chapter */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Our Mission</h2>
            {missionParagraphs.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-5 last:mb-0">{p}</p>
            ))}
          </div>
          <ImagePlaceholder ratio="aspect-[4/3]" label="Add a group photo" alt="SHPE MIT members together" />
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>What We Do</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {whatWeDo.map((item, i) => (
              <div key={item.title} className="flex gap-4 p-4 border border-border hover:border-[#FD652F] hover:shadow-sm transition-all duration-300">
                <div className="w-1 flex-shrink-0" style={{ backgroundColor: accents[i % accents.length] }} />
                <div>
                  <div className="font-semibold text-[#001F5B] mb-1 text-sm">{item.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo gallery — our community in pictures */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#72A9BE]" />
            <span className="text-xs font-medium text-[#72A9BE] uppercase tracking-widest">La Familia</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ImagePlaceholder ratio="aspect-[4/3]" label="Add a photo" alt="SHPE MIT moment" />
            <ImagePlaceholder ratio="aspect-[4/3]" label="Add a photo" alt="SHPE MIT moment" />
            <ImagePlaceholder ratio="aspect-[4/3]" label="Add a photo" alt="SHPE MIT moment" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {aboutStats.map((s) => (
            <div key={s.label} className="bg-[#f8f8f7] p-10 text-center">
              <div className="text-4xl font-bold text-[#FD652F] mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.number}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
