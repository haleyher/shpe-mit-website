import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { commservPurpose, mentorship, nocheDeCiencias } from "@/data/commserv";

// The "CommServ" page: three text sections (purpose, mentorship, Noche de
// Ciencias), with one big feature photo on the Noche de Ciencias section, then a
// Get Involved call-to-action. Edit the section text in src/data/commserv.ts.

type SectionData = { eyebrow: string; title: string; body: string[] };

// A section: accent eyebrow + heading + paragraphs, with optional content
// (e.g. a photo) below.
function Section({ data, accent, alt, children }: { data: SectionData; accent: string; alt: boolean; children?: React.ReactNode }) {
  return (
    <section className={`py-16 px-6 ${alt ? "bg-muted" : ""}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8" style={{ backgroundColor: accent }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: accent }}>{data.eyebrow}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#001F5B] uppercase mb-5 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{data.title}</h2>
        <div className="max-w-3xl">
          {data.body.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">{p}</p>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

export function CommServPage() {
  return (
    <div className="pt-24">
      <PageHeader
        section="Community Service"
        title="CommServ"
        subtitle="SHPE MIT is committed to giving back — bringing STEM, mentorship, and opportunity to Greater Boston."
      />

      {/* 1 — Purpose */}
      <Section data={commservPurpose} accent="#FD652F" alt={false} />

      {/* 2 — Mentorship */}
      <Section data={mentorship} accent="#0070C0" alt={true} />

      {/* 3 — Noche de Ciencias (one big feature photo) */}
      <Section data={nocheDeCiencias} accent="#72A9BE" alt={false}>
        <div className="mt-10">
          <ImagePlaceholder ratio="aspect-[2/1]" label="Add the Noche de Ciencias photo" alt="Noche de Ciencias" />
        </div>
      </Section>

      {/* Get Involved */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto bg-[#FD652F] p-12 text-center">
          <h2 className="text-4xl font-bold text-white uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Get Involved</h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8 text-sm leading-relaxed">Join our CommServ committee and help us make a difference in the Cambridge and Boston communities. No experience required — ¡todos son bienvenidos!</p>
          <a href="mailto:shpe-comm-serve@mit.edu" className="inline-block px-8 py-3 bg-[#f8f8f7] text-[#FD652F] font-bold hover:bg-[#001F5B] hover:text-white transition-all duration-300">Sign Up to Volunteer</a>
        </div>
      </section>
    </div>
  );
}
