import { useState } from "react";
import { whatWeDoItems } from "@/data/home";

// The interactive "What We Do" section on the Home page: hover (or tap) one of
// the four numbered blocks to swap the large photo on the left.
// Edit the four panels in src/data/home.ts (whatWeDoItems).

export function WhatWeDo() {
  const [active, setActive] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px w-8 bg-[#FD652F]" />
        <span className="text-xs font-medium text-[#FD652F] uppercase tracking-widest">What We Do</span>
      </div>
      <div className="flex flex-col lg:flex-row border border-border overflow-hidden" style={{ minHeight: 520 }}>
        {/* Left: photo that changes with the active block */}
        <div className="relative lg:w-[55%] aspect-[4/3] lg:aspect-auto overflow-hidden bg-[#001F5B]">
          {whatWeDoItems.map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-7 left-7 right-7 pointer-events-none">
            <div className="text-[#FD652F] text-xs uppercase tracking-widest mb-1.5">{whatWeDoItems[active].category}</div>
            <h3 className="text-white text-3xl font-bold uppercase leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{whatWeDoItems[active].title}</h3>
          </div>
          <div className="absolute top-6 right-6 pointer-events-none">
            <span className="text-white/15 font-bold leading-none select-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "6rem" }}>{whatWeDoItems[active].number}</span>
          </div>
        </div>

        {/* Right: the four numbered blocks */}
        <div className="lg:w-[45%] flex flex-col divide-y divide-border">
          {whatWeDoItems.map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`flex-1 px-8 py-7 cursor-pointer transition-all duration-300 ${i === active ? "bg-[#001F5B]" : "bg-[#f8f8f7] hover:bg-[#ECECEA]"}`}
            >
              <div className="flex items-start gap-5">
                <span
                  className={`text-4xl font-bold leading-none flex-shrink-0 transition-colors duration-300 ${i === active ? "text-[#FD652F]" : "text-border"}`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {item.number}
                </span>
                <div className="min-w-0">
                  <div className={`text-xs uppercase tracking-widest mb-1 transition-colors duration-300 ${i === active ? "text-[#FD652F]" : "text-muted-foreground"}`}>{item.category}</div>
                  <div className={`font-bold text-lg uppercase mb-2 leading-tight transition-colors duration-300 ${i === active ? "text-white" : "text-[#001F5B]"}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.title}</div>
                  <div className={`text-sm leading-relaxed transition-colors duration-300 ${i === active ? "text-white/65" : "text-muted-foreground"}`}>{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
