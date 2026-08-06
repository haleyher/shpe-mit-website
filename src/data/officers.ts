import type { Officer } from "@/types";
import carlos from "@/assets/images/exec/carlos-cropped.jpg";
import emma from "@/assets/images/exec/emma-cropped.jpg";
import evan from "@/assets/images/exec/evan.jpg";
import haley from "@/assets/images/exec/haleyher.jpeg";
import isa from "@/assets/images/exec/isa.png";
import montse from "@/assets/images/exec/montse.jpg";
import fati from "@/assets/images/exec/fati-cropped-1.jpeg";
import cris from "@/assets/images/exec/cris.jpeg";
import maria from "@/assets/images/exec/maria.jpg";



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
//                Replace the shared shpe-exec@mit.edu address with each officer's
//                own MIT email (e.g. "kerb@mit.edu") when you have them.
//
// To add a real headshot photo, see the note at the top of
// src/components/TeamMember.tsx (add a `photo` field here).
// ─────────────────────────────────────────────────────────────────────────────
export const execBoard: Officer[] = [
  { name: "Carlos Nuñez-Sosa", photo: carlos, role: "President", major: "Computation & Cognition", year: "Class of 2028", initials: "CN", email: "cns@mit.edu" },
  { name: "Haley Hernandez", photo: haley, role: "Vice President", major: "AI & Decision-Making", year: "Class of 2028", initials: "HH", email: "haleyher@mit.edu" },
  { name: "Maria Taveras", photo: maria, role: "Secretary", major: "Electrical Engineering with Computing", year: "Class of 2029", initials: "MT", email: "mtav@mit.edu" },
  { name: "Isabel Duran", photo: isa, role: "Treasurer", major: "Electrical Engineering with Computing", year: "Class of 2028", initials: "ID", email: "iduran@mit.edu" },
  { name: "Fatima Hernandez", photo: fati, role: "External Affairs", major: "Mechanical Engineering", year: "Class of 2027", initials: "FH", email: "fhernand@mit.edu" },
  { name: "Evan Cabrera", photo: evan, role: "Social Chair", major: "Electrical Engineering with Computing & Physics", year: "Class of 2029", initials: "EC", email: "evacab@mit.edu" },
  { name: "Cristopher Miranda", photo: cris, role: "Professional Development", major: "Mechanical Engineering", year: "Class of 2027", initials: "CM", email: "crism@mit.edu" },
  { name: "Montserrat Diaz-Botello", photo: montse, role: "Professional Development", major: "Mechanical Engineering", year: "Class of 2029", initials: "MD", email: "montsedb@mit.edu" },
  { name: "Emma Martinez", photo: emma, role: "Community Service", major: "Mechanical Engineering", year: "Class of 2029", initials: "EM", email: "emartinz@mit.edu" },
  { name: "TBD", role: "Freshman Representative", major: "Undeclared", year: "Class of 2030", initials: "?", email: "shpe-exec@mit.edu" },
  { name: "TBD", role: "Freshman Representative", major: "Undeclared", year: "Class of 2030", initials: "?", email: "shpe-exec@mit.edu" },
];
