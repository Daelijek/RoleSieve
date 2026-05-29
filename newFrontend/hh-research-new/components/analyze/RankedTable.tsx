"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { RankedItem } from "@/lib/types/export-summary";
import { cn } from "@/lib/cn";
import { getDict } from "@/lib/i18n";

const dict = getDict();

type SortKey = "count" | "name" | "share";

type RankedTableProps = {
  title: string;
  items: RankedItem[];
  successful: number;
  filenameStem: string;
};

export function RankedTable({
  title,
  items,
  successful,
  filenameStem,
}: RankedTableProps) {
  const [sort, setSort] = useState<SortKey>("count");
  const [desc, setDesc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sort === "count") cmp = a.count - b.count;
      else if (sort === "name") cmp = a.name.localeCompare(b.name, "ru");
      else cmp = a.count / successful - b.count / successful;
      return desc ? -cmp : cmp;
    });
    return copy;
  }, [items, sort, desc, successful]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setDesc((d) => !d);
    else {
      setSort(key);
      setDesc(key !== "name");
    }
  };

  const thClass =
    "cursor-pointer select-none px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)] transition-colors hover:text-[color:var(--color-text-muted)]";

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--color-border-subtle)] px-4 py-3 sm:px-5">
        <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {title}
        </h3>
        <button
          type="button"
          disabled
          title={dict.analyze.table.csvSoon}
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[color:var(--color-border-strong)] px-2.5 py-1 text-[11px] text-[color:var(--color-text-muted)] opacity-60"
        >
          <Download size={12} />
          {dict.analyze.table.csv}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-[13px]">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)]">
              <th className={cn(thClass, "w-10")} onClick={() => toggleSort("count")}>
                {dict.analyze.table.rank}
                {sort === "count" ? (desc ? " ↓" : " ↑") : ""}
              </th>
              <th className={thClass} onClick={() => toggleSort("name")}>
                {dict.analyze.table.name}
                {sort === "name" ? (desc ? " ↓" : " ↑") : ""}
              </th>
              <th className={cn(thClass, "text-right")} onClick={() => toggleSort("count")}>
                {dict.analyze.table.count}
              </th>
              <th className={cn(thClass, "text-right")} onClick={() => toggleSort("share")}>
                {dict.analyze.table.share}
                {sort === "share" ? (desc ? " ↓" : " ↑") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const share = successful
                ? ((row.count / successful) * 100).toFixed(1)
                : "0.0";
              return (
                <tr
                  key={row.name}
                  className="border-b border-[color:var(--color-border-subtle)]/60 last:border-0 transition-colors hover:bg-[color:var(--color-surface-2)]/30"
                >
                  <td className="px-3 py-2.5 font-mono text-[11px] text-[color:var(--color-text-subtle)]">
                    {(i + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-2.5 text-[color:var(--color-text-primary)] sm:max-w-none">
                    {row.name}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-[color:var(--color-text-primary)]">
                    {row.count}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-[color:var(--color-text-muted)]">
                    {share}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <span className="sr-only">{filenameStem}</span>
    </div>
  );
}
