import type { Sponsor } from "@/types";

// Brand logos that ship with the site (transparent SVGs in src/assets/images/sponsors/).
// To add a logo for a sponsor that doesn't have one yet:
//   1. Drop the logo file (SVG or PNG, transparent background) into
//      src/assets/images/sponsors/
//   2. Import it here, e.g.:  import visa from "@/assets/images/sponsors/visa.svg";
//   3. Set that sponsor's `logo` field to the import below.
// Sponsors with `logo: null` automatically show a clean text wordmark instead,
// so the page always looks finished even before every logo is added.
import generalMotors from "@/assets/images/sponsors/general-motors.svg";
import visa from "@/assets/images/sponsors/visa.svg";
import geVernova from "@/assets/images/sponsors/ge-vernova.svg";
import akamai from "@/assets/images/sponsors/akamai.svg";
import nvidia from "@/assets/images/sponsors/nvidia.svg";
import accenture from "@/assets/images/sponsors/accenture.svg";
import google from "@/assets/images/sponsors/google.svg";

// ─────────────────────────────────────────────────────────────────────────────
// SPONSORS  (shown on the "Sponsors" page, grouped by tier)
// ─────────────────────────────────────────────────────────────────────────────
// For each sponsor:
//   • name    – company name
//   • tier    – "platinum", "gold", "silver", or "bronze"
//   • tagline – one short line under the name
//   • logo    – an imported logo (see above) or null for a text wordmark
// ─────────────────────────────────────────────────────────────────────────────
export const sponsors: Sponsor[] = [
  // Platinum
  { name: "General Motors", tier: "platinum", tagline: "Driving the future of mobility", logo: generalMotors },

  // Gold
  { name: "Visa", tier: "gold", tagline: "Global payments technology", logo: visa },
  { name: "Hudson River Trading", tier: "gold", tagline: "Quantitative trading & research", logo: null },
  { name: "Capital One", tier: "gold", tagline: "Technology-driven banking", logo: null },
  { name: "GE Vernova", tier: "gold", tagline: "The energy to change the world", logo: geVernova },
  { name: "MIT–GE Vernova Alliance", tier: "gold", tagline: "Powering research & talent at MIT", logo: null },
  { name: "Akamai", tier: "gold", tagline: "Cloud and content delivery", logo: akamai },

  // Silver
  { name: "Blue Origin", tier: "silver", tagline: "Building a road to space", logo: null },
  { name: "NVIDIA", tier: "silver", tagline: "Accelerated computing & AI", logo: nvidia },
  { name: "Jane Street", tier: "silver", tagline: "Quantitative trading firm", logo: null },
  { name: "D. E. Shaw", tier: "silver", tagline: "Investment & technology", logo: null },
  { name: "Accenture", tier: "silver", tagline: "Global technology consulting", logo: accenture },
  { name: "Bloomberg", tier: "silver", tagline: "Data, software & media", logo: null },

  // Bronze
  { name: "MathWorks", tier: "bronze", tagline: "MATLAB & Simulink", logo: null },
  { name: "Google", tier: "bronze", tagline: "Search, AI, and engineering", logo: google },
  { name: "Oligo Space", tier: "bronze", tagline: "Space systems & technology", logo: null },
];

// Visual styling for each tier. You usually don't need to change this.
export const sponsorTierConfig = {
  platinum: { label: "Platinum", color: "#3B4A5A", bg: "bg-slate-100/70", border: "border-slate-300", cols: "md:grid-cols-1 max-w-xl mx-auto" },
  gold: { label: "Gold", color: "#B45309", bg: "bg-amber-50/80", border: "border-amber-200", cols: "md:grid-cols-3" },
  silver: { label: "Silver", color: "#475569", bg: "bg-slate-50/80", border: "border-slate-200", cols: "md:grid-cols-3" },
  bronze: { label: "Bronze", color: "#92400E", bg: "bg-orange-50/80", border: "border-orange-100", cols: "md:grid-cols-3" },
} as const;

// The order tiers are displayed in, top to bottom.
export const sponsorTierOrder = ["platinum", "gold", "silver", "bronze"] as const;
