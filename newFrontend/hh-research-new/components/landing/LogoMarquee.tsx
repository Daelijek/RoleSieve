import { Container } from "@/components/ui/Container";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export function LogoMarquee() {
  const l = dict.logos;
  const items = [...l.items, ...l.items];

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
        <ul
          className="flex w-max items-center gap-12 animate-marquee group-hover:[animation-play-state:paused] sm:gap-16"
          aria-hidden
        >
          {items.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="select-none text-[clamp(1.25rem,2vw,1.625rem)] font-semibold tracking-tight text-[color:var(--color-text-muted)]/80 transition-colors duration-300 hover:text-[color:var(--color-text-primary)]"
              style={{ fontVariationSettings: "'opsz' 32" }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
