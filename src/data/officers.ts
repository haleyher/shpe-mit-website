import type { Officer } from "@/types";
import carlos from "@/assets/images/carlos2.jpg";
import emma from "@/assets/images/emma.jpg";
import evan from "@/assets/images/evan.jpg";


// ─────────────────────────────────────────────────────────────────────────────
// EXECUTIVE BOARD  (shown on the "Exec" page)
// ─────────────────────────────────────────────────────────────────────────────
// To update the board each year, edit this list:
//   • name     – officer's full name
//   • role     – their position (e.g. "President")
//   • major    – course / major
//   • year     – e.g. "Class of 2028"
//   • initials – two letters shown on the headshot placeholder
//   • email    – clicking the "email" button next to their name opens this.
//                Replace the shared shpe-mit@mit.edu address with each officer's
//                own MIT email (e.g. "kerb@mit.edu") when you have them.
//
// To add a real headshot photo, see the note at the top of
// src/components/TeamMember.tsx (add a `photo` field here).
// ─────────────────────────────────────────────────────────────────────────────
export const execBoard: Officer[] = [
  { name: "Carlos Nuñez-Sosa", photo: carlos, role: "President", major: "Computation & Cognition", year: "Class of 2028", initials: "CN", email: "shpe-mit@mit.edu" },
  { name: "Haley Hernandez", role: "Vice President", major: "AI & Decision-Making", year: "Class of 2028", initials: "HH", email: "shpe-mit@mit.edu" },
  { name: "Maria Taveras", role: "Secretary", major: "Mechanical Engineering", year: "Class of 2029", initials: "MT", email: "shpe-mit@mit.edu" },
  { name: "Isabel Duran", role: "Treasurer", major: "Mechanical Engineering", year: "Class of 2028", initials: "ID", email: "shpe-mit@mit.edu" },
  { name: "Fatima Hernandez", role: "External Affairs", major: "Mechanical Engineering", year: "Class of 2027", initials: "FH", email: "shpe-mit@mit.edu" },
  { name: "Evan Cabrera", photo: evan, role: "Social Chair", major: "Electrical Engineering + Physics", year: "Class of 2029", initials: "EC", email: "shpe-mit@mit.edu" },
  { name: "Cristopher Miranda", role: "Professional Development", major: "Mechanical Engineering", year: "Class of 2027", initials: "CM", email: "shpe-mit@mit.edu" },
  { name: "Montserrat Diaz-Botello", role: "Professional Development", major: "Mechanical Engineering", year: "Class of 2029", initials: "MD", email: "shpe-mit@mit.edu" },
  { name: "Emma Martinez", photo: emma, role: "Community Service", major: "Mechanical Engineering", year: "Class of 2029", initials: "EM", email: "shpe-comm-serve@mit.edu" },
  { name: "TBD", role: "Freshman Representative", major: "Undeclared", year: "Class of 2030", initials: "?", email: "shpe-mit@mit.edu" },
  { name: "TBD", role: "Freshman Representative", major: "Undeclared", year: "Class of 2030", initials: "?", email: "shpe-mit@mit.edu" },
];
