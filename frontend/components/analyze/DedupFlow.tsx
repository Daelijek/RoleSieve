"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Layers } from "lucide-react";
import type { ExportSummary } from "@/lib/types/export-summary";
import { useDict } from "@/lib/i18n";
import { rankChartCardClass, resultsPanelBodyClass } from "./rank-chart-shared";

type DedupFlowProps = {
  dedup: NonNullable<ExportSummary["dedup"]>;
};

export function DedupFlow({ dedup }: DedupFlowProps) {
  const dict = useDict();
  const reduce = useReducedMotion();
  const max = Math.max(dedup.input_count, dedup.unique_count, dedup.duplicates_removed, 1);

  const steps = [
    {
      key: "input",
      label: dict.analyze.dedupInput,
      value: dedup.input_count,
      color: "from-violet/30 to-violet/10",
      bar: "bg-violet/70",
    },
    {
      key: "unique",
      label: dict.analyze.dedupUnique,
      value: dedup.unique_count,
      color: "from-aqua/25 to-aqua/8",
      bar: "bg-aqua/60",
    },
    {
      key: "removed",
      label: dict.analyze.dedupRemoved,
      value: dedup.duplicates_removed,
      color: "from-coral/30 to-coral/10",
      bar: "bg-coral/70",
    },
  ];

  return (
    <div className={rankChartCardClass}>
      <div className="mb-5 flex shrink-0 items-center gap-2">
        <Layers size={15} strokeWidth={1.75} className="text-coral" />
        <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {dict.analyze.dedupTitle}
        </h3>
      </div>

      <div
        className={`${resultsPanelBodyClass} gap-4 sm:flex-row sm:items-end sm:justify-start sm:gap-3`}
      >
        {steps.map((step, i) => {
          const w = (step.value / max) * 100;
          return (
            <div key={step.key} className="flex min-w-0 flex-1 items-end gap-2 sm:flex-col sm:items-stretch">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden shrink-0 self-center pb-8 font-mono text-coral sm:inline"
                >
                  →
                </span>
              )}
              <div
                className={`flex flex-1 flex-col rounded-xl border border-[color:var(--color-border-subtle)] bg-gradient-to-b ${step.color} p-4`}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {step.label}
                </span>
                <span className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-[color:var(--color-text-primary)]">
                  {step.value}
                </span>
                <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${step.bar}`}
                    initial={reduce ? { width: `${w}%` } : { width: 0 }}
                    whileInView={{ width: `${w}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      ease: [0.2, 0.8, 0.2, 1],
                      delay: i * 0.12,
                    }}
                  />
                </div>
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden className="shrink-0 self-center text-coral sm:hidden">
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
