"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import type { RankedItem } from "@/lib/types/export-summary";
import { getDict } from "@/lib/i18n";
import {
  RANK_CHART_VISIBLE_ROWS,
  rankChartCardClass,
  rankChartListClass,
  rankChartRowClass,
} from "./rank-chart-shared";

const dict = getDict();

type SkillsRankChartProps = {
  items: RankedItem[];
  successful: number;
  maxItems?: number;
};

export function SkillsRankChart({
  items,
  successful,
  maxItems = RANK_CHART_VISIBLE_ROWS,
}: SkillsRankChartProps) {
  const reduce = useReducedMotion();
  const slice = items.slice(0, maxItems);
  const maxCount = Math.max(...slice.map((s) => s.count), 1);

  return (
    <div className={rankChartCardClass}>
      <div className="mb-5 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={15} strokeWidth={1.75} className="text-violet" />
          <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            {dict.analyze.skillsTitle}
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {dict.analyze.skillsHint}
        </span>
      </div>
      <ul className={rankChartListClass}>
        {slice.map((s, i) => {
          const w = (s.count / maxCount) * 100;
          const pct = successful ? ((s.count / successful) * 100).toFixed(0) : "0";
          return (
            <li key={s.name} className={rankChartRowClass}>
              <span className="w-6 text-right font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="w-24 truncate text-[13px] text-[color:var(--color-text-primary)] sm:w-28">
                {s.name}
              </span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--signature-gradient)] shadow-[0_0_12px_rgba(139,108,255,0.45)]"
                  initial={reduce ? { width: `${w}%` } : { width: 0 }}
                  whileInView={{ width: `${w}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.04 }}
                />
              </div>
              <span className="hidden w-10 text-right font-mono text-[11px] tabular-nums text-[color:var(--color-text-subtle)] sm:inline">
                {s.count}
              </span>
              <span className="w-11 text-right font-mono text-[12px] tabular-nums text-[color:var(--color-text-primary)]">
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
