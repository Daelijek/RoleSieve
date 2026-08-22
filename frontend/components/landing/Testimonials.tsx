"use client";

import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Spotlight } from "@/components/ui/Spotlight";
import { DotGrid } from "@/components/ui/DotGrid";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";

const accentText = {
  violet: "text-violet",
  coral: "text-coral",
  aqua: "text-aqua",
} as const;

const accentBg = {
  violet: "bg-violet",
  coral: "bg-coral",
  aqua: "bg-aqua",
} as const;

export function Testimonials() {
  const dict = useDict();
  const t = dict.testimonials;
  return (
    <section
      aria-labelledby="testimonials-title"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      <DotGrid fade="center" />
      <Container className="relative">
        <div id="testimonials-title">
          <SectionHeader eyebrow={t.eyebrow} title={t.title} />
        </div>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {t.items.map((item) => (
            <li key={item.author}>
              <Spotlight
                tint={item.accent}
                size={420}
                intensity={0.1}
                className="group relative h-full overflow-hidden rounded-3xl p-5 sm:p-7 bg-neutral-300/20 hover:bg-neutral-300/30 dark:bg-neutral-400/20 dark:hover:bg-neutral-400/30 backdrop-blur-[1px] border border-neutral-400/20 transition-all duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:shadow-xl"
              >
                <div aria-hidden className="hairline-specular" />
                <Quote
                  aria-hidden
                  size={28}
                  className={`${accentText[item.accent]} opacity-90`}
                  strokeWidth={1.5}
                />
                <blockquote className="mt-5 text-[16px] leading-[1.55] text-[color:var(--color-text-primary)]">
                  «{item.quote}»
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-[color:var(--color-border-subtle)] pt-5">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${accentBg[item.accent]}/15 ${accentText[item.accent]} ring-1 ring-inset ring-[color:var(--color-border-subtle)]`}
                  >
                    <span className="font-mono text-[13px] font-semibold">
                      {item.author
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-[color:var(--color-text-primary)]">
                      {item.author}
                    </div>
                    <div className="text-[12px] text-[color:var(--color-text-muted)]">
                      {item.role}
                    </div>
                  </div>
                </div>
              </Spotlight>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
