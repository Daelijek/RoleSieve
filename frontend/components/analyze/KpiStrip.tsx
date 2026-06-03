"use client";

import { Spotlight } from "@/components/ui/Spotlight";
import { Counter } from "@/components/ui/Counter";
import { Sparkline } from "@/components/ui/Sparkline";
import type { ExportSummary, KpiSparkline } from "@/lib/types/export-summary";
import { getDict } from "@/lib/i18n";

const dict = getDict();

type KpiStripProps = {
  summary: ExportSummary;
  sparklines: KpiSparkline[];
};

export function KpiStrip({ summary, sparklines }: KpiStripProps) {
  const items = [
    {
      key: "requested" as const,
      label: dict.analyze.kpi.requested,
      value: summary.requested,
      color: "139,108,255",
    },
    {
      key: "processed" as const,
      label: dict.analyze.kpi.processed,
      value: summary.processed,
      color: "108,231,255",
    },
    {
      key: "errors" as const,
      label: dict.analyze.kpi.errors,
      value: summary.errors,
      color: "255,106,90",
    },
    {
      key: "uniqueSkills" as const,
      label: dict.analyze.kpi.uniqueSkills,
      value: summary.top_skills.length,
      color: "74,222,128",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px bg-[color:var(--color-border-subtle)] lg:grid-cols-4">
      {items.map((item, i) => {
        const spark = sparklines.find((s) => s.key === item.key);
        return (
          <Spotlight
            key={item.key}
            color={item.color}
            className="glass relative bg-[color:var(--color-surface)]/40 p-5 transition-[transform,border-color] duration-[var(--duration-base)] hover:-translate-y-0.5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {item.label}
                </p>
                <p className="mt-2 font-mono text-[28px] font-semibold leading-none tabular-nums tracking-tight text-[color:var(--color-text-primary)] sm:text-[32px]">
                  <Counter target={item.value} immediate={i < 2} />
                </p>
              </div>
              {spark && (
                <Sparkline
                  values={spark.sparkline}
                  width={72}
                  height={32}
                  strokeFrom={
                    i % 2 === 0 ? "#8B6CFF" : "#6CE7FF"
                  }
                  strokeTo={
                    i % 2 === 0 ? "#FF6A5A" : "#4ADE80"
                  }
                  ariaLabel={item.label}
                />
              )}
            </div>
          </Spotlight>
        );
      })}
    </div>
  );
}
