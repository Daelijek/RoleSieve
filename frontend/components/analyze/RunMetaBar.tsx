"use client";

import { Download, Loader2 } from "lucide-react";
import type { AnalyzeRunMeta } from "@/lib/types/export-summary";
import { useDict } from "@/lib/i18n";

type RunMetaBarProps = {
  meta: AnalyzeRunMeta;
  downloadPath?: string | null;
  downloading?: boolean;
  onDownload?: () => void;
};

export function RunMetaBar({ meta, downloadPath, downloading, onDownload }: RunMetaBarProps) {
  const dict = useDict();
  const queryChip = [meta.queryLabel, meta.region, meta.experience, meta.workFormat]
    .filter(Boolean)
    .join(" · ");
  const canDownload = Boolean(downloadPath && onDownload);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-border-subtle)] px-5 py-4 sm:px-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {dict.analyze.runLabel} #{meta.runId}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] px-3 py-1 font-mono text-[11px] text-[color:var(--color-text-primary)]">
          <span className="h-1 w-1 rounded-full bg-aqua" />
          {queryChip}
        </span>
        <span className="hidden font-mono text-[10px] text-[color:var(--color-text-subtle)] sm:inline">
          {meta.period}
        </span>
        {meta.status === "ready" && (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
            {dict.analyze.statusReady}
          </span>
        )}
      </div>
      {canDownload ? (
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          title={dict.analyze.launcher.download}
          className="inline-flex items-center gap-2 rounded-full border border-violet/50 bg-[color:var(--color-violet)]/15 px-3 py-1.5 text-[12px] text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-violet)]/25 disabled:cursor-wait disabled:opacity-60"
        >
          {downloading ? (
            <Loader2 size={13} strokeWidth={2} className="animate-spin" />
          ) : (
            <Download size={13} strokeWidth={2} />
          )}
          <span className="font-medium">
            {downloading ? dict.analyze.launcher.downloading : dict.analyze.launcher.download}
          </span>
          {meta.fileSizeLabel !== "—" && (
            <span className="font-mono text-[10px] text-[color:var(--color-text-subtle)]">
              · {meta.fileSizeLabel}
            </span>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled
          title={dict.analyze.excelSoon}
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/70 px-3 py-1.5 text-[12px] text-[color:var(--color-text-muted)] opacity-60"
        >
          <Download size={13} strokeWidth={2} />
          <span className="font-medium">{dict.analyze.excel}</span>
          <span className="font-mono text-[10px] text-[color:var(--color-text-subtle)]">
            · {meta.fileSizeLabel}
          </span>
        </button>
      )}
    </div>
  );
}
