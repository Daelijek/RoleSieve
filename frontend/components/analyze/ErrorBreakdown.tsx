"use client";

import { AlertTriangle } from "lucide-react";
import type { ExportSummary } from "@/lib/types/export-summary";
import { useDict } from "@/lib/i18n";

type ErrorBreakdownProps = {
  items: NonNullable<ExportSummary["error_breakdown"]>;
};

export function ErrorBreakdown({ items }: ErrorBreakdownProps) {
  const dict = useDict();
  if (!items.length) return null;

  const max = Math.max(...items.map((e) => e.count), 1);

  return (
    <div className="bg-[color:var(--color-surface)]/40 p-5 sm:p-7">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle size={15} strokeWidth={1.75} className="text-coral" />
        <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {dict.analyze.errorsTitle}
        </h3>
      </div>
      <ul className="space-y-3">
        {items.map((row) => {
          const w = (row.count / max) * 100;
          return (
            <li key={row.reason} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="min-w-0 truncate text-[color:var(--color-text-muted)]">
                  {row.reason}
                </span>
                <span className="shrink-0 font-mono tabular-nums text-[color:var(--color-text-primary)]">
                  {row.count}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-coral/70"
                  style={{ width: `${w}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
