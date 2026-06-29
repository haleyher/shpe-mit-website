import type { CommServProgram } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNITY SERVICE PROGRAMS  (shown on the "CommServ" page)
// ─────────────────────────────────────────────────────────────────────────────
// These are SHPE MIT's real community-service programs. For each one:
//   • title       – program name
//   • description – short paragraph describing it
//   • impact      – a short highlight shown with a checkmark
//   • icon        – any emoji to display at the top of the card
//   • photo       – (optional) an imported photo; see ImagePlaceholder usage
//                   on the CommServ page to add pictures.
// CommServ questions? shpe-comm-serve@mit.edu
// ─────────────────────────────────────────────────────────────────────────────
export const commservPrograms: CommServProgram[] = [
  {
    title: "Noche de Ciencias",
    description: "Our flagship annual STEM festival for local families — featuring MIT student research exhibits, hands-on activities, and college and financial-aid information for students and their parents.",
    impact: "Annual chapter-wide event",
    icon: "🔬",
  },
  {
    title: "Youth Empowerment & Education Initiative",
    description: "In partnership with the Boston Higher Education Resource Center (HERC), we connect MIT students with underserved high schoolers through interactive, one-on-one STEM workshops.",
    impact: "Partnered with Boston HERC",
    icon: "🎓",
  },
  {
    title: "Social Media Awareness",
    description: "We create educational content — including videos exploring what it's like to be a first-generation Latinx student pursuing higher education — to inform and inspire the next generation.",
    impact: "Reaching students online",
    icon: "🎥",
  },
];
