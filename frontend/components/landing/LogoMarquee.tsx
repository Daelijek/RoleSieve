"use client";

import { Container } from "@/components/ui/Container";
import { useDict } from "@/lib/i18n";

export function LogoMarquee() {
  const dict = useDict();
  const l = dict.logos;
  // Repeat items 3 times per track so a single track is wider than 4K screens (>4000px),
  // ensuring completely seamless infinite scrolling without gaps or abrupt resets.
  const items = [...l.items, ...l.items, ...l.items];

  return (
    <section
      aria-label={l.title}
      className="relative border-y border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40 py-10 backdrop-blur"
    >
      <Container className="mb-6">
        <p className="text-center font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {l.title}
        </p>
      </Container>

      <div className="group relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[color:var(--color-canvas)] to-transparent sm:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[color:var(--color-canvas)] to-transparent sm:w-40"
        />
        <div
          className="flex w-max animate-marquee group-hover:[animation-play-state:paused] [will-change:transform]"
          aria-hidden
        >
          <ul className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
            {items.map((name, i) => (
              <li
                key={`m1-${i}-${name}`}
                className="select-none text-[clamp(1.25rem,2vw,1.625rem)] font-semibold tracking-tight text-[color:var(--color-text-muted)]/80 transition-colors duration-300 hover:text-[color:var(--color-text-primary)]"
                style={{ fontVariationSettings: "'opsz' 32" }}
              >
                {name}
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16" aria-hidden="true">
            {items.map((name, i) => (
              <li
                key={`m2-${i}-${name}`}
                className="select-none text-[clamp(1.25rem,2vw,1.625rem)] font-semibold tracking-tight text-[color:var(--color-text-muted)]/80 transition-colors duration-300 hover:text-[color:var(--color-text-primary)]"
                style={{ fontVariationSettings: "'opsz' 32" }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
