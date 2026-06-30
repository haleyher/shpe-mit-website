import type { NavLink } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// TOP NAVIGATION + FOOTER LINKS
// Add, remove, or reorder the tabs that appear in the navbar and footer here.
// `page` must be one of the values in the `Page` type (src/types/index.ts).
// ─────────────────────────────────────────────────────────────────────────────
export const navLinks: NavLink[] = [
  { label: "About", page: "about" },
  { label: "Exec", page: "exec" },
  { label: "Convention", page: "convention" },
  { label: "CommServ", page: "commserv" },
  { label: "Sponsors", page: "sponsors" },
  { label: "Contact", page: "contact" },
];

// Where to reach the chapter. Shown in the footer, contact page, and login help.
// To add or change a social link, edit the `socials` list below — each entry is
// a { label, url } pair.
export const contact = {
  email: "shpe-mit@mit.edu",
  location: "Massachusetts Institute of Technology, Cambridge, MA 02139",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/shpemit/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/groups/5182958/" },
  ],
};
