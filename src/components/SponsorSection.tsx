import { sponsors, sponsorTierConfig } from "@/data/sponsors";
import type { Sponsor } from "@/types";

// Renders one tier's worth of sponsors (e.g. all "gold" sponsors) as a titled
// grid. Used on the Sponsors page, once per tier.
// Edit the sponsors themselves in src/data/sponsors.ts.

type Tier = Sponsor["tier"];

export function SponsorSection({ tier }: { tier: Tier }) {
  const config = sponsorTierConfig[tier];
  const tierSponsors = sponsors.filter((s) => s.tier === tier);
  if (tierSponsors.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-8" style={{ backgroundColor: config.color }} />
        <span className="text-sm font-bold uppercase tracking-widest" style={{ color: config.color }}>
          {config.label} Sponsors
        </span>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${config.cols} gap-5`}>
        {tierSponsors.map((sponsor) => (
          <div key={sponsor.name} className={`${config.bg} ${config.border} border p-6 flex flex-col hover:border-[#FD652F] hover:shadow-md transition-all duration-300`}>
            {/* Logo area: show the real logo if we have one, otherwise a clean
                wordmark of the company name so the card still looks finished. */}
            <div className="mb-4 flex items-center justify-center h-16">
              {sponsor.logo ? (
                <img src={sponsor.logo} alt={sponsor.name} className="max-h-12 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-bold text-center leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: config.color }}>
                  {sponsor.name}
                </span>
              )}
            </div>
            <div className="text-center mt-auto">
              <div className="text-sm font-semibold text-[#001F5B]">{sponsor.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{sponsor.tagline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
