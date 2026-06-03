"use client";

import { Quote } from "lucide-react";
import type { RankedItem } from "@/lib/types/export-summary";
import { getDict } from "@/lib/i18n";

const dict = getDict();

type PhrasesRankChartProps = {
  items: RankedItem[];
  successful: number;
  maxItems?: number;
};

export function PhrasesRankChart({
  items,
  successful,
  maxItems = 8,
}: PhrasesRankChartProps) {
  const slice = items.slice(0, maxItems);
  const maxCount = Math.max(...slice.map((s) => s.count), 1);

  return (
    <div className="bg-[color:var(--color-surface)]/40 p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Quote size={15} strokeWidth={1.75} className="text-coral" />
          <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            {dict.analyze.phrasesTitle}
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {dict.analyze.phrasesHint}
        </span>
      </div>
      <ul className="space-y-2.5">
        {slice.map((phrase, i) => {
          const w = (phrase.count / maxCount) * 100;
          const pct = successful
            ? ((phrase.count / successful) * 100).toFixed(0)
            : "0";
          return (
            <li
              key={phrase.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-[color:var(--color-border-subtle)] hover:bg-[color:var(--color-surface-2)]/40"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div className="relative min-w-0 flex-1">
                  <span
                    aria-hidden
                    className="absolute -inset-y-1 left-0 -z-10 rounded-md bg-[var(--signature-gradient-soft)] transition-[width] duration-700 ease-[var(--ease-premium)]"
                    style={{ width: `${w}%` }}
                  />
                  <span className="relative truncate text-[13px] text-[color:var(--color-text-primary)]">
                    «{phrase.name}»
                  </span>
                </div>
              </div>
              <span className="font-mono text-[12px] tabular-nums text-[color:var(--color-text-muted)]">
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
