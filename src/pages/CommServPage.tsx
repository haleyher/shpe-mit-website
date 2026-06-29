import { CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { commservPrograms } from "@/data/commserv";

// The "CommServ" (community service) page.
// Edit the programs in src/data/commserv.ts.
// The <ImagePlaceholder> blocks are spots for photos — see that component for
// how to drop in real pictures.

export function CommServPage() {
  return (
    <div className="pt-24">
      <PageHeader
        section="Community Service"
        title="CommServ"
        subtitle="SHPE MIT is committed to giving back. Our CommServ programs bring STEM education and mentorship to Greater Boston."
      />
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Intro + a featured photo of the team in action */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#FD652F]" />
                <span className="text-xs font-medium text-[#FD652F] uppercase tracking-widest">Our Impact</span>
              </div>
              <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Engineering a Stronger Community</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">From hands-on science nights to one-on-one mentorship, our volunteers bring STEM to students across Greater Boston — and show the next generation of Latinx engineers what's possible.</p>
            </div>
            <ImagePlaceholder ratio="aspect-[4/3]" label="Add a CommServ photo" alt="SHPE MIT volunteers at a community event" />
          </div>

          {/* Program cards, each with its own photo space */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {commservPrograms.map((p) => (
              <div key={p.title} className="border border-border overflow-hidden bg-[#f8f8f7] hover:border-[#FD652F] hover:shadow-md transition-all duration-300 flex flex-col">
                <ImagePlaceholder src={p.photo} ratio="aspect-[3/2]" label="Add a program photo" alt={p.title} />
                <div className="p-7 flex flex-col flex-1">
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3 className="text-2xl font-bold text-[#001F5B] uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-5 text-sm flex-1">{p.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#FD652F]"><CheckCircle size={14} />{p.impact}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Photo gallery — moments from our service events */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#0070C0]" />
              <span className="text-xs font-medium text-[#0070C0] uppercase tracking-widest">In the Community</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
              <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
              <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
              <ImagePlaceholder ratio="aspect-square" label="Add photo" alt="Community service moment" />
            </div>
          </div>

          <div className="bg-[#FD652F] p-12 text-center">
            <h2 className="text-4xl font-bold text-white uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Get Involved</h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8 text-sm leading-relaxed">Join our CommServ committee and help us make a difference in the Cambridge and Boston communities. No experience required — ¡todos son bienvenidos!</p>
            <a href="mailto:shpe-comm-serve@mit.edu" className="inline-block px-8 py-3 bg-[#f8f8f7] text-[#FD652F] font-bold hover:bg-[#001F5B] hover:text-white transition-all duration-300">Sign Up to Volunteer</a>
          </div>
        </div>
      </section>
    </div>
  );
}
