"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Play, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useDict } from "@/lib/i18n";
import {
  ApiError,
  JobFailedError,
  isAbortError,
  pollJob,
  startAutoExport,
  type AutoExportBody,
} from "@/lib/api/client";
import { normalizeExportSummary } from "@/lib/analyze/normalize-summary";
import { clampPeriodDays, filterValue } from "@/lib/api/hh-filters";
import { RegionPicker, type RegionValue } from "./RegionPicker";
import type { AnalyzeRunMeta, ExportSummary } from "@/lib/types/export-summary";

type Phase = "idle" | "running" | "done" | "error";

export type RunResult = {
  jobId: string;
  summary: ExportSummary;
  meta: AnalyzeRunMeta;
  downloadPath: string | null;
};

type RunLauncherProps = {
  onResult: (result: RunResult) => void;
};

function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <span className="block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
        {label}
      </span>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              type="button"
              key={opt.id || "any"}
              onClick={() => onChange(opt.id)}
              disabled={disabled}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] transition-colors duration-[var(--duration-fast)] disabled:opacity-50",
                active
                  ? "border-violet/50 bg-[color:var(--color-violet)]/15 text-[color:var(--color-text-primary)]"
                  : "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/60 text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-canvas)]/70 px-3 py-2 text-[14px] tabular-nums text-[color:var(--color-text-primary)] outline-none transition-colors focus:border-violet/50 disabled:opacity-60"
      />
    </label>
  );
}

function labelFromId(
  options: readonly { id: string; label: string }[],
  id: string,
): string {
  return options.find((o) => o.id === id)?.label ?? "";
}

export function RunLauncher({ onResult }: RunLauncherProps) {
  const dict = useDict();
  const t = dict.analyze.launcher;

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionValue>({
    id: t.regionPresets[0].id,
    label: t.regionPresets[0].label,
  });
  const [workFormat, setWorkFormat] = useState<string>("");
  const [exp, setExp] = useState<string>("");
  const [periodDays, setPeriodDays] = useState<number>(t.periods[1].days);

  const [pages, setPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [kwTopN, setKwTopN] = useState(30);
  const [kwMaxNgram, setKwMaxNgram] = useState(3);

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  function mapStartError(e: unknown): string {
    if (e instanceof JobFailedError) {
      const msg = e.detail;
      if (msg.includes("403") || /forbidden/i.test(msg)) {
        return t.errors.hhForbidden;
      }
      return msg;
    }
    if (e instanceof ApiError) {
      const vars = e.vars ?? {};
      switch (e.code) {
        case "too_many_vacancies":
          return fmt(t.errors.tooManyVacancies, {
            search_count: typeof vars.search_count === "number" ? vars.search_count : 0,
            max: typeof vars.max === "number" ? vars.max : 0,
          });
        case "search_failed":
          return t.errors.searchFailed;
        case "export_failed":
          return t.errors.exportFailed;
        default:
          return e.message || t.errors.unknown;
      }
    }
    if (e instanceof Error) {
      if (e.message === "NO_API_URL") return t.errors.noApiUrl;
      return e.message;
    }
    return t.errors.unknown;
  }

  async function run() {
    const q = query.trim();
    if (!q) {
      setError(t.errors.noQuery);
      return;
    }

    setError(null);
    setProgress(null);
    setPhase("running");

    const ac = new AbortController();
    abortRef.current = ac;

    const body: AutoExportBody = {
      queries: [q],
      pages,
      per_page: perPage,
      kw_top_n: kwTopN,
      kw_max_ngram: kwMaxNgram,
    };
    const area = filterValue(region.id);
    const experience = filterValue(exp);
    const wf = filterValue(workFormat);
    const period = clampPeriodDays(periodDays);

    const expLabel = labelFromId(t.experiences, exp);
    const workFormatLabel = labelFromId(t.workFormats, workFormat);
    const periodLabel = labelFromId(
      t.periods.map((p) => ({ id: String(p.days), label: p.label })),
      String(periodDays),
    );

    if (area) body.area = area;
    if (experience) body.experience = experience;
    if (wf) body.work_format = wf;
    if (period) body.period = period;
    body.client_meta = {
      queryLabel: q,
      region: region.label,
      experience: expLabel,
      period: periodLabel,
      workFormat: workFormatLabel,
    };

    try {
      const jobId = await startAutoExport(body, ac.signal);
      const job = await pollJob(jobId, {
        signal: ac.signal,
        onProgress: (done, total) => setProgress({ done, total }),
      });

      if (!job.summary) throw new Error(t.errors.unknown);
      const summary = normalizeExportSummary(job.summary);

      const meta: AnalyzeRunMeta = {
        runId: jobId.slice(0, 8),
        queryLabel: q,
        region: region.label,
        experience: expLabel,
        period: periodLabel,
        workFormat: workFormatLabel,
        completedAt: new Date().toISOString(),
        fileSizeLabel: "—",
        status: "ready",
      };

      onResult({
        jobId,
        summary,
        meta,
        downloadPath: job.download_url ?? null,
      });
      setPhase("done");
    } catch (e) {
      if (isAbortError(e)) {
        setPhase("idle");
        setProgress(null);
        return;
      }
      setError(mapStartError(e));
      setPhase("error");
    } finally {
      abortRef.current = null;
    }
  }

  function cancel() {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhase("idle");
    setProgress(null);
  }

  function reset() {
    setPhase("idle");
    setProgress(null);
    setError(null);
  }

  const isRunning = phase === "running";
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : null;

  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -bottom-8 -top-4 rounded-[36px] bg-[image:var(--signature-gradient-soft)] blur-3xl"
      />
      <div className="glass-strong relative overflow-hidden rounded-[28px] p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-shimmer)] to-transparent"
        />

        <div className="flex items-center gap-2">
          <Search size={14} strokeWidth={1.75} className="text-violet" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            {t.eyebrow}
          </span>
        </div>
        <h2 className="mt-3 text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold tracking-[-0.02em] text-[color:var(--color-text-primary)]">
          {t.title}
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-[1.6] text-[color:var(--color-text-muted)]">
          {t.description}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor="run-query"
              className="block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]"
            >
              {t.queryLabel}
            </label>
            <div className="relative mt-2">
              <input
                id="run-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isRunning) void run();
                }}
                placeholder={t.queryPlaceholder}
                disabled={isRunning}
                className="w-full rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-canvas)]/70 px-4 py-3 pr-10 text-[15px] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-subtle)] outline-none transition-colors focus:border-violet/50 disabled:opacity-60"
                autoComplete="off"
              />
              <Sparkles
                aria-hidden
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-subtle)]"
              />
            </div>

            <div className="mt-5 space-y-4">
              <RegionPicker
                value={region}
                onChange={setRegion}
                disabled={isRunning}
              />
              <ChipGroup
                label={t.workFormatLabel}
                options={t.workFormats}
                value={workFormat}
                onChange={setWorkFormat}
                disabled={isRunning}
              />
              <ChipGroup
                label={t.expLabel}
                options={t.experiences}
                value={exp}
                onChange={setExp}
                disabled={isRunning}
              />
              <ChipGroup
                label={t.periodLabel}
                options={t.periods.map((p) => ({
                  id: String(p.days),
                  label: p.label,
                }))}
                value={String(periodDays)}
                onChange={(v) => setPeriodDays(Number(v))}
                disabled={isRunning}
              />
            </div>

            <details className="group mt-5 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 p-4">
              <summary className="cursor-pointer select-none font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                {t.advancedLabel}
              </summary>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <NumberField
                  label={t.pagesLabel}
                  value={pages}
                  min={1}
                  max={20}
                  disabled={isRunning}
                  onChange={setPages}
                />
                <NumberField
                  label={t.perPageLabel}
                  value={perPage}
                  min={1}
                  max={100}
                  disabled={isRunning}
                  onChange={setPerPage}
                />
                <NumberField
                  label={t.kwTopNLabel}
                  value={kwTopN}
                  min={1}
                  max={200}
                  disabled={isRunning}
                  onChange={setKwTopN}
                />
                <NumberField
                  label={t.kwMaxNgramLabel}
                  value={kwMaxNgram}
                  min={1}
                  max={5}
                  disabled={isRunning}
                  onChange={setKwMaxNgram}
                />
              </div>
            </details>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {phase === "done" ? (
                <Button
                  onClick={reset}
                  size="md"
                  variant="outline"
                  leading={<RotateCcw size={13} strokeWidth={2} />}
                >
                  {t.restart}
                </Button>
              ) : (
                <Button
                  onClick={() => void run()}
                  size="md"
                  disabled={isRunning}
                  leading={
                    isRunning ? (
                      <Loader2 size={14} strokeWidth={2} className="animate-spin" />
                    ) : (
                      <Play size={13} strokeWidth={2.25} />
                    )
                  }
                >
                  {isRunning ? t.running : t.submit}
                </Button>
              )}
              {isRunning && (
                <Button
                  onClick={cancel}
                  size="md"
                  variant="ghost"
                  leading={<X size={13} strokeWidth={2} />}
                >
                  {t.cancel}
                </Button>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-coral/40 bg-[color:var(--color-coral)]/10 px-4 py-3 text-[13px] leading-[1.5] text-[color:var(--color-text-primary)]">
                {error}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/40 p-5">
            {isRunning ? (
              <div className="flex h-full min-h-[220px] flex-col justify-center gap-4">
                <div className="flex items-center justify-between text-[12px] text-[color:var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
                    </span>
                    {t.running}…
                  </span>
                  {pct !== null && (
                    <span className="font-mono tabular-nums">{pct}%</span>
                  )}
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                  {pct !== null ? (
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--signature-gradient)] shadow-[var(--glow-bar-md)] transition-[width] duration-300 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="absolute inset-y-0 -left-1/2 w-1/2 rounded-full bg-[image:var(--signature-gradient)]"
                      style={{ animation: "shimmer-x 1.4s var(--ease-premium) infinite" }}
                    />
                  )}
                </div>
                {progress && progress.total > 0 && (
                  <p className="font-mono text-[11px] text-[color:var(--color-text-subtle)]">
                    {fmt(t.progressPct, { done: progress.done, total: progress.total })}
                  </p>
                )}
                <ul className="mt-2 grid grid-cols-3 gap-2 text-[11.5px] text-[color:var(--color-text-subtle)]">
                  <li
                    className={cn(
                      "rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 px-2.5 py-2",
                      (pct ?? 0) > 5 && "border-violet/40 text-[color:var(--color-text-primary)]",
                    )}
                  >
                    {t.steps.sent}
                  </li>
                  <li
                    className={cn(
                      "rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 px-2.5 py-2",
                      (pct ?? 0) > 40 && "border-violet/40 text-[color:var(--color-text-primary)]",
                    )}
                  >
                    {t.steps.collecting}
                  </li>
                  <li
                    className={cn(
                      "rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 px-2.5 py-2",
                      (pct ?? 0) > 85 && "border-violet/40 text-[color:var(--color-text-primary)]",
                    )}
                  >
                    {t.steps.extracting}
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-violet">
                  <Play size={18} strokeWidth={1.75} />
                </span>
                <p className="max-w-xs text-[13.5px] leading-[1.5] text-[color:var(--color-text-muted)]">
                  {phase === "done"
                    ? dict.analyze.statusReady
                    : t.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
