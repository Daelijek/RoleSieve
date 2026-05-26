import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Sparkline } from "@/components/ui/Sparkline";
import { SectionHeader } from "./SectionHeader";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export function StatsBand() {
  const s = dict.stats;
  return (
    <section
      aria-labelledby="stats-title"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <div id="stats-title">
          <SectionHeader
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
          />
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((item, i) => (
            <li
              key={item.label}
              className="group glass relative overflow-hidden rounded-2xl p-6 transition-[transform,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <Sparkline
                  values={item.sparkline}
                  width={92}
                  height={28}
                  strokeFrom={i % 2 === 0 ? "#8B6CFF" : "#FF6A5A"}
                  strokeTo={i % 2 === 0 ? "#FF6A5A" : "#6CE7FF"}
                  ariaLabel={`Динамика: ${item.label}`}
                />
              </div>
              <Counter
                target={item.target}
                suffix={item.suffix}
                duration={1600}
                className="mt-5 block font-mono text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-none tracking-tight tabular-nums text-[color:var(--color-text-primary)]"
              />
              <p className="mt-2.5 text-[13px] leading-[1.5] text-[color:var(--color-text-muted)]">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
