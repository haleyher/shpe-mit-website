import { PageHeader } from "@/components/PageHeader";
import { SponsorSection } from "@/components/SponsorSection";
import { sponsorTierOrder } from "@/data/sponsors";

// The "Sponsors" page: one section per tier (gold / silver / bronze).
// Edit the sponsors in src/data/sponsors.ts.

export function SponsorsPage() {
  return (
    <div className="pt-24">
      <PageHeader
        section="Sponsors"
        title="Our Sponsors"
        subtitle="Our sponsors make SHPE MIT programming possible. We are grateful for their commitment to Hispanic excellence in engineering."
      />
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {sponsorTierOrder.map((tier) => (
            <SponsorSection key={tier} tier={tier} />
          ))}
          <div className="border-2 border-[#001F5B] p-12 text-center">
            <h2 className="text-3xl font-bold text-[#001F5B] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Become a Sponsor</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm leading-relaxed">Partner with SHPE MIT to connect with top Hispanic engineering talent at one of the world's best universities.</p>
            <button className="px-8 py-3 bg-[#FD652F] text-white font-bold hover:bg-[#D33A02] transition-all duration-300">Request a Sponsorship Package</button>
          </div>
        </div>
      </section>
    </div>
  );
}
