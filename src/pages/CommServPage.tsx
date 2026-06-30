import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { commservPurpose, mentorship, nocheDeCiencias } from "@/data/commserv";

// The "CommServ" page: three main sections (purpose, mentorship, Noche de
// Ciencias), each with room for photos, then an "In the Community" gallery and a
// Get Involved call-to-action. Edit the section text in src/data/commserv.ts.
// The <ImagePlaceholder> blocks are spots for photos — see that component.

type SectionData = { eyebrow: string; title: string; body: string[] };

// One of the three main sections: an accent eyebrow + heading + text, then a
// generous row of photo spots.
function CommServSection({ data, accent, alt }: { data: SectionData; accent: string; alt: boolean }) {
  return (
    <section className={`py-16 px-6 ${alt ? "bg-muted" : ""}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8" style={{ backgroundColor: accent }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: accent }}>{data.eyebrow}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#001F5B] uppercase mb-5 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{data.title}</h2>
        <div className="max-w-3xl mb-8">
          {data.body.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">{p}</p>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ImagePlaceholder ratio="aspect-[4/3]" label="Add a photo" alt={data.title} />
          <ImagePlaceholder ratio="aspect-[4/3]" label="Add a photo" alt={data.title} />
          <ImagePlaceholder ratio="aspect-[4/3]" label="Add a photo" alt={data.title} />
        </div>
      </div>
    </section>
  );
}

export function CommServPage() {
  const sections: { data: SectionData; accent: string }[] = [
    { data: commservPurpose, accent: "#FD652F" },
    { data: mentorship, accent: "#0070C0" },
    { data: nocheDeCiencias, accent: "#72A9BE" },
  ];

  return (
    <div className="pt-24">
      <PageHeader
        section="Community Service"
        title="CommServ"
        subtitle="SHPE MIT is committed to giving back — bringing STEM, mentorship, and opportunity to Greater Boston."
      />

      {/* Three main sections */}
      {sections.map((s, i) => (
        <CommServSection key={s.data.title} data={s.data} accent={s.accent} alt={i % 2 === 1} />
      ))}

      {/* In the Community — photo gallery */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#f99323]" />
            <span className="text-xs font-medium text-[#f99323] uppercase tracking-widest">In the Community</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
            <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
            <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
            <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-[#FD652F] p-12 text-center">
          <h2 className="text-4xl font-bold text-white uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Get Involved</h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8 text-sm leading-relaxed">Join our CommServ committee and help us make a difference in the Cambridge and Boston communities. No experience required — ¡todos son bienvenidos!</p>
          <a href="mailto:shpe-comm-serve@mit.edu" className="inline-block px-8 py-3 bg-[#f8f8f7] text-[#FD652F] font-bold hover:bg-[#001F5B] hover:text-white transition-all duration-300">Sign Up to Volunteer</a>
        </div>
      </section>
    </div>
  );
}
