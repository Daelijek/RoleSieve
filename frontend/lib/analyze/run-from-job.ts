import type { JobStatus } from "@/lib/api/client";
import { normalizeExportSummary } from "@/lib/analyze/normalize-summary";
import type { AnalyzeRunMeta, ExportSummary } from "@/lib/types/export-summary";
import type { RunResult } from "@/components/analyze/RunLauncher";

type RunMetaPayload = {
  queryLabel?: string;
  region?: string;
  experience?: string;
  period?: string;
};

export function metaFromJob(job: JobStatus): AnalyzeRunMeta {
  const rm = (job.run_meta ?? {}) as RunMetaPayload;
  const finishedAt =
    typeof job.finished_at === "number"
      ? new Date(job.finished_at * 1000).toISOString()
      : typeof job.created_at === "number"
        ? new Date(job.created_at * 1000).toISOString()
        : new Date().toISOString();

  let status: AnalyzeRunMeta["status"] = "running";
  if (job.status === "succeeded") status = "ready";
  else if (job.status === "failed") status = "failed";

  return {
    runId: job.job_id.slice(0, 8),
    queryLabel: rm.queryLabel ?? "—",
    region: rm.region ?? "",
    experience: rm.experience ?? "",
    period: rm.period ?? "",
    completedAt: finishedAt,
    fileSizeLabel: "—",
    status,
  };
}

export function runResultFromJob(job: JobStatus): RunResult | null {
  if (job.status !== "succeeded" || !job.summary) return null;
  const summary = normalizeExportSummary(job.summary);
  return {
    jobId: job.job_id,
    summary,
    meta: metaFromJob(job),
    downloadPath: job.download_url ?? null,
  };
}
