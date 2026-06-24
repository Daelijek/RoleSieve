"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useDict, useLocale } from "@/lib/i18n";
import {
  loadStoredRuns,
  mergeHistoryItems,
} from "@/lib/analyze/local-run-history";
import { ApiError, listRunHistory, type RunHistoryItem } from "@/lib/api/client";

type RunHistoryProps = {
  activeJobId: string | null;
  refreshToken?: number;
  onSelect: (jobId: string) => void;
};

function formatWhen(ts: number | null | undefined, locale: string): string {
  if (!ts) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts * 1000));
  } catch {
    return "—";
  }
}

function statusLabel(
  status: string,
  labels: ReturnType<typeof useDict>["analyze"]["history"]["status"],
): string {
  if (status === "succeeded") return labels.succeeded;
  if (status === "failed") return labels.failed;
  if (status === "running") return labels.running;
  if (status === "queued") return labels.queued;
  return status;
}

export function RunHistory({ activeJobId, refreshToken = 0, onSelect }: RunHistoryProps) {
  const dict = useDict();
  const { locale } = useLocale();
  const t = dict.analyze.history;
  const hydrated = useHydrated();
  const [items, setItems] = useState<RunHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    const local = loadStoredRuns();
    try {
      const rows = await listRunHistory({ limit: 30, signal });
      setItems(mergeHistoryItems(rows, local));
    } catch (e) {
      const merged = mergeHistoryItems([], local);
      if (merged.length > 0) {
        setItems(merged);
        if (e instanceof ApiError && e.status === 404) {
          setError(t.listUnavailable);
        } else if (e instanceof Error && e.message === "NO_API_URL") {
          setError(t.noApiUrl);
        } else {
          setError(t.listUnavailable);
        }
      } else if (e instanceof Error && e.message === "NO_API_URL") {
        setError(t.noApiUrl);
        setItems([]);
      } else if (e instanceof ApiError && e.status === 404) {
        setError(t.listUnavailable);
        setItems([]);
      } else {
        setError(t.loadFailed);
        setItems([]);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [t.listUnavailable, t.loadFailed, t.noApiUrl]);

  useEffect(() => {
    if (!hydrated) return;
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [hydrated, load, refreshToken]);

  return (
    <section className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock size={14} strokeWidth={1.75} className="text-violet" />
          <h2 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            {t.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={hydrated && loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border-strong)] px-2.5 py-1 text-[11px] text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-primary)] disabled:opacity-50"
        >
          <RotateCcw
            size={12}
            className={hydrated && loading ? "animate-spin" : ""}
          />
          {t.refresh}
        </button>
      </div>

      <div className="mt-4">
        {!hydrated || (loading && items.length === 0) ? (
          <div className="flex items-center gap-2 py-6 text-[13px] text-[color:var(--color-text-muted)]">
            <Loader2 size={14} className="animate-spin text-violet" />
            {t.loading}
          </div>
        ) : items.length === 0 ? (
          <p className="py-4 text-[13px] leading-[1.5] text-[color:var(--color-text-muted)]">
            {error ?? t.empty}
          </p>
        ) : (
          <>
            {error ? (
              <p className="mb-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] leading-[1.45] text-[color:var(--color-text-muted)]">
                {error}
              </p>
            ) : null}
            <ul className="max-h-[280px] space-y-1.5 overflow-y-auto pr-1">
            {items.map((row) => {
              const active = row.job_id === activeJobId;
              const failed = row.status === "failed";
              const chip = [
                row.run_meta?.region,
                row.run_meta?.experience,
                row.run_meta?.workFormat,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <li key={row.job_id}>
                  <button
                    type="button"
                    onClick={() => onSelect(row.job_id)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-left transition-colors duration-[var(--duration-fast)]",
                      active
                        ? "border-violet/50 bg-[color:var(--color-violet)]/12"
                        : "border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)]/70",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[color:var(--color-text-primary)]">
                          {row.query_label ?? row.run_meta?.queryLabel ?? "—"}
                        </p>
                        {chip ? (
                          <p className="mt-0.5 truncate font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                            {chip}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide",
                          failed
                            ? "bg-coral/15 text-coral"
                            : row.status === "succeeded"
                              ? "bg-success/15 text-success"
                              : "bg-[color:var(--color-surface-3)] text-[color:var(--color-text-subtle)]",
                        )}
                      >
                        {statusLabel(row.status, t.status)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] tabular-nums text-[color:var(--color-text-subtle)]">
                      <span suppressHydrationWarning>
                        {formatWhen(row.finished_at ?? row.created_at, locale)}
                      </span>
                      {row.status === "succeeded" && row.processed != null && (
                        <span>
                          {t.processed}: {row.processed}
                        </span>
                      )}
                      {row.top_skill ? (
                        <span className="truncate">
                          {row.top_skill}
                        </span>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          </>
        )}
      </div>
    </section>
  );
}
