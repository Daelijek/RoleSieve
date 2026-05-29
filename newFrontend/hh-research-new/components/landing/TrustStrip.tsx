import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export function TrustStrip() {
  const t = dict.trust;
  return (
    <section
      aria-label="Источник данных и ключевые показатели"
      className="relative py-14 sm:py-20"
    >
      <Container>
        <div className="glass relative overflow-hidden rounded-2xl px-6 py-6 sm:px-10 sm:py-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-shimmer)] to-transparent"
          />
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-[13px] text-[color:var(--color-text-muted)]">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-violet">
                <ShieldCheck size={16} strokeWidth={1.75} />
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[color:var(--color-border-subtle)]" />
              </span>
              <span className="max-w-[28ch]">{t.badge}</span>
            </div>
            <ul className="grid w-full grid-cols-3 gap-4 sm:w-auto sm:gap-10">
              {t.kpis.map((kpi) => (
                <li
                  key={kpi.label}
                  className="flex flex-col items-start text-left"
                >
                  <Counter
                    target={kpi.target}
                    prefix={"prefix" in kpi ? (kpi.prefix as string) : ""}
                    suffix={kpi.suffix}
                    className="font-mono text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-none tracking-tight tabular-nums text-[color:var(--color-text-primary)]"
                  />
                  <span className="mt-2 text-[12px] uppercase tracking-wider text-[color:var(--color-text-subtle)]">
                    {kpi.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
