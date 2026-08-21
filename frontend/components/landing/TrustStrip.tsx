"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { useDict } from "@/lib/i18n";

export function TrustStrip() {
  const dict = useDict();
  const t = dict.trust;
  const [activeKpiIndex, setActiveKpiIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveKpiIndex((prev) => (prev + 1) % t.kpis.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [t.kpis.length]);

  const activeKpi = t.kpis[activeKpiIndex];

  return (
    <section
      aria-label="Источник данных и ключевые показатели"
      className="relative py-10 sm:py-16"
    >
      <Container>
        <div className="glass relative overflow-hidden rounded-2xl p-5 sm:px-10 sm:py-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-shimmer)] to-transparent"
          />
          <div className="flex flex-col items-stretch justify-between gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-3 text-[13px] text-[color:var(--color-text-muted)]">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-violet">
                <ShieldCheck size={16} strokeWidth={1.75} />
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[color:var(--color-border-subtle)]" />
              </span>
              <span className="max-w-[28ch] text-[13px] font-medium leading-snug text-[color:var(--color-text-primary)]">
                {t.badge}
              </span>
            </div>

            {/* Desktop KPI 3-columns */}
            <ul className="hidden sm:grid sm:grid-cols-3 sm:gap-8 md:gap-12">
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

            {/* Mobile Animated 3-second Rotator */}
            <div className="relative flex flex-col items-center rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 px-4 py-3.5 sm:hidden">
              <div className="relative flex h-14 w-full items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeKpiIndex}
                    initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center text-center"
                  >
                    <Counter
                      target={activeKpi.target}
                      prefix={"prefix" in activeKpi ? (activeKpi.prefix as string) : ""}
                      suffix={activeKpi.suffix}
                      className="font-mono text-[26px] font-bold leading-none tracking-tight tabular-nums text-[color:var(--color-text-primary)]"
                    />
                    <span className="mt-1.5 text-[11.5px] font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
                      {activeKpi.label}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Indicator dots */}
              <div className="mt-2 flex items-center gap-1.5">
                {t.kpis.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveKpiIndex(i)}
                    aria-label={`KPI ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeKpiIndex
                        ? "w-5 bg-violet"
                        : "w-1.5 bg-[color:var(--color-border-strong)] opacity-60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
