import { Mail } from "lucide-react";
import type { Officer } from "@/types";

// A single exec-board member card (used on the Exec page).
// Edit the people themselves in src/data/officers.ts.
//
// TO ADD A REAL HEADSHOT PHOTO:
//   1. Put the photo in src/assets/images/ (a portrait/4:5 crop looks best).
//   2. At the top of src/data/officers.ts add, e.g.:
//        import carlos from "@/assets/images/carlos.jpg";
//   3. Add `photo: carlos` to that officer's entry.
//   The card automatically shows the photo instead of the initials placeholder.

export function TeamMember({ member }: { member: Officer }) {
  return (
    <div className="border border-border overflow-hidden bg-[#f8f8f7] hover:border-[#FD652F] hover:shadow-md transition-all duration-300 group flex flex-col">
      {/* Headshot — typical portrait ratio (4:5). Shows the photo if provided,
          otherwise a navy placeholder with the member's initials. */}
      <div className="aspect-[4/5] bg-[#001F5B] relative overflow-hidden group-hover:bg-[#001847] transition-colors duration-300">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <>
            <span className="absolute inset-0 flex items-center justify-center text-white/15 font-bold select-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "4.5rem", lineHeight: 1 }}>
              {member.initials}
            </span>
            <span className="absolute bottom-2.5 left-0 right-0 text-center text-white/25 text-[10px] uppercase tracking-[0.2em]">Headshot</span>
          </>
        )}
      </div>
      {/* Role → Name (+ email button) → Major → Year */}
      <div className="p-4 flex flex-col">
        <div className="text-[#FD652F] text-[10px] font-bold uppercase tracking-wider mb-1.5 leading-snug">{member.role}</div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="font-bold text-[#001F5B] text-sm leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{member.name}</div>
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            title={`Email ${member.name}`}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-border text-[#001F5B] hover:bg-[#FD652F] hover:text-white hover:border-[#FD652F] transition-all duration-200"
          >
            <Mail size={13} />
          </a>
        </div>
        <div className="text-xs text-muted-foreground leading-tight">{member.major}</div>
        <div className="text-[10px] text-muted-foreground/70 mt-0.5">{member.year}</div>
      </div>
    </div>
  );
}
