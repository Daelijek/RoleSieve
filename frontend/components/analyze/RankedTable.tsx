"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { RankedItem } from "@/lib/types/export-summary";
import { cn } from "@/lib/cn";
import { useDict, useLocale } from "@/lib/i18n";

type SortKey = "count" | "name" | "share";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob(["\uFEFF", content], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

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
  const dict = useDict();
  const { locale } = useLocale();
  const [sort, setSort] = useState<SortKey>("count");
  const [desc, setDesc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sort === "count") cmp = a.count - b.count;
      else if (sort === "name") cmp = a.name.localeCompare(b.name, locale);
      else cmp = a.count / successful - b.count / successful;
      return desc ? -cmp : cmp;
    });
    return copy;
  }, [items, sort, desc, successful, locale]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setDesc((d) => !d);
    else {
      setSort(key);
      setDesc(key !== "name");
    }
  };

  const thBase =
    "px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]";
  const thSortable = cn(
    thBase,
    "cursor-pointer select-none transition-colors hover:text-[color:var(--color-text-muted)]",
  );

  const sortMark = (key: SortKey) =>
    sort === key ? (desc ? " ↓" : " ↑") : "";

  const exportCsv = () => {
    const t = dict.analyze.table;
    const header = [t.rank, t.name, t.count, t.share].map(csvEscape).join(",");
    const rows = sorted.map((row, i) => {
      const sharePct = successful
        ? ((row.count / successful) * 100).toFixed(1)
        : "0.0";
      return [String(i + 1), row.name, String(row.count), `${sharePct}%`]
        .map(csvEscape)
        .join(",");
    });
    downloadCsv(`${filenameStem}.csv`, [header, ...rows].join("\n"));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--color-border-subtle)] px-4 py-3 sm:px-5">
        <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {title}
        </h3>
        <button
          type="button"
          onClick={exportCsv}
          disabled={sorted.length === 0}
          title={dict.analyze.table.csv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border-strong)] px-2.5 py-1 text-[11px] text-[color:var(--color-text-muted)] transition-colors hover:border-violet/40 hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={12} />
          {dict.analyze.table.csv}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-[13px]">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)]">
              <th className={cn(thBase, "w-10")} scope="col">
                {dict.analyze.table.rank}
              </th>
              <th
                className={thSortable}
                scope="col"
                onClick={() => toggleSort("name")}
              >
                {dict.analyze.table.name}
                {sortMark("name")}
              </th>
              <th
                className={cn(thSortable, "text-right")}
                scope="col"
                onClick={() => toggleSort("count")}
              >
                {dict.analyze.table.count}
                {sortMark("count")}
              </th>
              <th
                className={cn(thSortable, "text-right")}
                scope="col"
                onClick={() => toggleSort("share")}
              >
                {dict.analyze.table.share}
                {sortMark("share")}
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
    </div>
  );
}
