import { PageHeader } from "@/components/PageHeader";
import { TeamMember } from "@/components/TeamMember";
import { execBoard } from "@/data/officers";

// The "Exec" page: cards of executive-board members, laid out in centered
// rows of three. Edit the officers in src/data/officers.ts.

export function ExecPage() {
  return (
    <div className="pt-24">
      <PageHeader section="Executive Board" title="Meet the Exec" subtitle="The 2026–2027 SHPE MIT Executive Board." />
      <section className="py-16 px-6">
        {/* Flex-wrap with centered rows so the final (partial) row stays centered. */}
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
          {execBoard.map((member, i) => (
            <div key={`${member.name}-${i}`} className="w-[260px] max-w-full">
              <TeamMember member={member} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
