// The navy banner shown at the top of every interior page
// (About, Events, Exec, etc.). Reused so all page headers look identical.

export function PageHeader({
  section,
  title,
  subtitle,
}: {
  section: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-[#001F5B] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-[#FD652F]" />
          <span className="text-xs font-medium text-[#FD652F] uppercase tracking-widest">{section}</span>
        </div>
        <h1 className="font-bold text-white uppercase text-5xl leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {title}
        </h1>
        {subtitle && <p className="text-white/60 mt-3 max-w-2xl text-sm leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
