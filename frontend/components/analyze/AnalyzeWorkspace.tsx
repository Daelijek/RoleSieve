"use client";

import { useCallback, useRef, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getDict } from "@/lib/i18n";
import { getJob, JobFailedError, downloadJob, formatFileSize, isAbortError } from "@/lib/api/client";
import { runResultFromJob } from "@/lib/analyze/run-from-job";
import { saveStoredRun } from "@/lib/analyze/local-run-history";
import { ResultsDashboard } from "./ResultsDashboard";
import { RunHistory } from "./RunHistory";
import { RunLauncher, type RunResult } from "./RunLauncher";
import type { ExportSummary, KpiSparkline } from "@/lib/types/export-summary";

const dict = getDict();

function rampTo(target: number, points = 6): number[] {
  if (points <= 1) return [target];
  const out: number[] = [];
  for (let i = 0; i < points; i++) {
    const ratio = i / (points - 1);
    const eased = 1 - Math.pow(1 - ratio, 2);
    out.push(Math.round(target * eased));
  }
  out[out.length - 1] = target;
  return out;
}

function buildSparklines(summary: ExportSummary): KpiSparkline[] {
  return [
    { key: "requested", sparkline: rampTo(summary.requested) },
    { key: "processed", sparkline: rampTo(summary.processed) },
    { key: "errors", sparkline: rampTo(summary.errors) },
    { key: "uniqueSkills", sparkline: rampTo(summary.top_skills.length) },
  ];
}

function ResultsEmptyState() {
  return (
    <section className="relative">
      <div className="glass relative overflow-hidden rounded-[28px] border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)]/20 px-6 py-14 text-center sm:px-10 sm:py-16">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-violet">
          <BarChart3 size={20} strokeWidth={1.75} />
        </span>
        <h2 className="mt-5 text-[17px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {dict.analyze.resultsEmptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-[1.6] text-[color:var(--color-text-muted)]">
          {dict.analyze.resultsEmptyDescription}
        </p>
      </div>
    </section>
  );
}

export function AnalyzeWorkspace() {
  const [result, setResult] = useState<RunResult | null>(null);
  const [sparklines, setSparklines] = useState<KpiSparkline[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const downloadAbortRef = useRef<AbortController | null>(null);
  const loadAbortRef = useRef<AbortController | null>(null);

  const applyResult = useCallback((next: RunResult) => {
    setResult(next);
    setSparklines(buildSparklines(next.summary));
    setLoadError(null);
  }, []);

  function handleResult(next: RunResult) {
    applyResult(next);
    saveStoredRun({
      jobId: next.jobId,
      queryLabel: next.meta.queryLabel,
      region: next.meta.region,
      experience: next.meta.experience,
      period: next.meta.period,
      workFormat: next.meta.workFormat,
      completedAt: next.meta.completedAt,
      status: "succeeded",
      processed: next.summary.processed,
      topSkill: next.summary.top_skills[0]?.name ?? null,
    });
    setHistoryRefresh((n) => n + 1);
  }

  async function handleSelectHistory(jobId: string) {
    if (result?.jobId === jobId) return;

    loadAbortRef.current?.abort();
    const ac = new AbortController();
    loadAbortRef.current = ac;
    setLoadingJobId(jobId);
    setLoadError(null);

    try {
      const job = await getJob(jobId, ac.signal);
      const parsed = runResultFromJob(job);
      if (!parsed) {
        const msg =
          job.status === "failed" && job.error
            ? job.error
            : dict.analyze.history.notReady;
        throw new JobFailedError(msg);
      }
      applyResult(parsed);
    } catch (e) {
      if (isAbortError(e)) return;
      setLoadError(
        e instanceof JobFailedError
          ? e.detail
          : e instanceof Error
            ? e.message
            : dict.analyze.history.loadFailed,
      );
    } finally {
      if (!ac.signal.aborted) setLoadingJobId(null);
    }
  }

  async function handleDownload() {
    if (!result?.downloadPath || downloading) return;
    setDownloading(true);
    const ac = new AbortController();
    downloadAbortRef.current = ac;
    try {
      const { sizeBytes } = await downloadJob(result.downloadPath, ac.signal);
      setResult((prev) =>
        prev
          ? {
              ...prev,
              meta: { ...prev.meta, fileSizeLabel: formatFileSize(sizeBytes) },
            }
          : prev,
      );
    } catch (e) {
      if (!isAbortError(e)) {
        console.error("Excel download failed", e);
      }
    } finally {
      setDownloading(false);
      downloadAbortRef.current = null;
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <Reveal immediate>
        <RunLauncher onResult={handleResult} />
      </Reveal>

      <Reveal delay={0.04}>
        <RunHistory
          activeJobId={result?.jobId ?? null}
          refreshToken={historyRefresh}
          onSelect={(id) => void handleSelectHistory(id)}
        />
      </Reveal>

      <Reveal delay={0.08}>
        {loadError && (
          <p className="mb-4 rounded-xl border border-coral/40 bg-[color:var(--color-coral)]/10 px-4 py-3 text-[13px] text-[color:var(--color-text-primary)]">
            {loadError}
          </p>
        )}
        {loadingJobId && !result ? (
          <div className="glass flex min-h-[200px] items-center justify-center rounded-[28px] text-[13px] text-[color:var(--color-text-muted)]">
            {dict.analyze.history.loadingRun}
          </div>
        ) : result ? (
          <ResultsDashboard
            key={result.jobId}
            summary={result.summary}
            meta={result.meta}
            sparklines={sparklines}
            downloadPath={result.downloadPath}
            downloading={downloading}
            onDownload={handleDownload}
          />
        ) : (
          <ResultsEmptyState />
        )}
      </Reveal>
    </div>
  );
}
