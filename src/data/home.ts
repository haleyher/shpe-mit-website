import type { WhatWeDoItem } from "@/types";
import home1 from "@/assets/images/home/home1.jpg";
import home2 from "@/assets/images/home/home2.jpg";
import home3 from "@/assets/images/home/home3.jpg";
import home4 from "@/assets/images/home/home4.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE CONTENT
// Everything text/number-based on the Home page lives here so you can edit copy
// without touching the layout code.
// ─────────────────────────────────────────────────────────────────────────────

// Small line above the big "SHPE / MIT" title in the hero.
export const heroTagline = "MIT Chapter · Est. 1987";

// The two stat blocks on the right side of the hero image.
export const heroStats = [
  { number: "200+", label: "Active Members", sub: "Empowering Hispanic STEM students at MIT" },
  { number: "45+", label: "Events Per Year", sub: "Professional, social, and CommServ programs" },
];

// The "Our Mission" paragraph in the teaser section.
export const missionTeaser =
  "SHPE MIT is a chapter of the national Society of Hispanic Professional Engineers. We provide Hispanic and Latinx students at MIT with a strong professional network, career resources, and a supportive community to help them achieve their full potential in STEM.";

// The four small cards next to the mission teaser.
// `icon`  is the name of a Lucide icon — see https://lucide.dev/icons
// `color` is the accent color used for that card's icon.
export const missionHighlights = [
  { icon: "Users", title: "Community", desc: "A family of Hispanic engineers supporting each other through MIT and beyond.", color: "#FD652F" },
  { icon: "Award", title: "Professional Dev", desc: "Workshops, networking events, and connections to top employers.", color: "#0070C0" },
  { icon: "Heart", title: "Community Service", desc: "K-12 outreach and tutoring to give back to our local communities.", color: "#72A9BE" },
  { icon: "Star", title: "SHPE National", desc: "Connected to a nationwide network and an annual national convention.", color: "#f99323" },
];

// The dark navy stats bar in the middle of the Home page.
export const homeStatsBar = [
  { number: "200+", label: "Active Members" },
  { number: "45+", label: "Events Per Year" },
  { number: "11", label: "Exec Board Members" },
  { number: "16", label: "Corporate Sponsors" },
];

// The interactive "What We Do" section (hover the numbered blocks to swap photos).
export const whatWeDoItems: WhatWeDoItem[] = [
  {
    number: "01",
    category: "Community",
    title: "Built on Belonging",
    desc: "A close-knit family of Hispanic engineers at MIT. We celebrate culture, lift each other up, and create a home away from home.",
    image: home1,
  },
  {
    number: "02",
    category: "Professional Dev",
    title: "Launching STEM Careers",
    desc: "Resume workshops, mock interviews, industry panels, and direct connections to internships and full-time roles in STEM.",
    image: home2,
  },
  {
    number: "03",
    category: "Community Service",
    title: "Giving Back",
    desc: "K-12 STEM outreach, community tutoring, and engineering-for-good projects — bringing opportunity to Greater Boston.",
    image: home3,
  },
  {
    number: "04",
    category: "SHPE National",
    title: "Part of Something Bigger",
    desc: "Connected to SHPE chapters and members across the country. Access scholarships, the SHPE National Convention, and a lifelong network.",
    image: home4,
  },
];
