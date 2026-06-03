import type { ExportSummary } from "@/lib/types/export-summary";

export type RunClientMeta = {
  queryLabel: string;
  region: string;
  experience: string;
  period: string;
};

export type AutoExportBody = {
  queries: string[];
  pages: number;
  per_page: number;
  kw_top_n: number;
  kw_max_ngram: number;
  sleep_s?: number;
  search_sleep_s?: number;
  area?: string;
  experience?: string;
  period?: number;
  token?: string;
  client_meta?: RunClientMeta;
};

export type RunHistoryItem = {
  job_id: string;
  status: string;
  kind?: string | null;
  created_at?: number | null;
  finished_at?: number | null;
  query_label?: string;
  processed?: number | null;
  errors?: number | null;
  top_skill?: string | null;
  run_meta?: RunClientMeta & { queries?: string[] };
};

export type JobStatus = {
  job_id: string;
  status: "queued" | "running" | "succeeded" | "failed" | string;
  kind?: string | null;
  created_at?: number | null;
  finished_at?: number | null;
  run_meta?: RunClientMeta | null;
  progress_done?: number | null;
  progress_total?: number | null;
  warnings_count?: number | null;
  summary?: ExportSummary | null;
  download_url?: string | null;
  error?: string | null;
};

/** Thrown when async job status is `failed` (includes backend `error` text). */
export class JobFailedError extends Error {
  constructor(public readonly detail: string) {
    super(detail);
    this.name = "JobFailedError";
  }
}

export type ParsedApiError = {
  code?: string;
  message?: string;
  vars?: Record<string, unknown>;
};

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
}

function getApiKey(): string {
  return process.env.NEXT_PUBLIC_API_KEY?.trim() ?? "";
}

function authHeaders(json = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  const key = getApiKey();
  if (key) headers["X-API-Key"] = key;
  return headers;
}

/** Parse FastAPI error payloads of shape `{ detail: { error, message, ... } }`. */
export function parseApiErrorText(text: string): ParsedApiError {
  try {
    const json = JSON.parse(text);
    const detail = json?.detail;
    if (detail && typeof detail === "object") {
      const d = detail as Record<string, unknown>;
      const code = typeof d.error === "string" ? d.error : undefined;
      const message = typeof d.message === "string" ? d.message : undefined;
      return { code, message, vars: d };
    }
    if (typeof detail === "string") return { message: detail };
    return { message: text };
  } catch {
    return { message: text };
  }
}

export class ApiError extends Error {
  code?: string;
  vars?: Record<string, unknown>;
  status: number;

  constructor(status: number, parsed: ParsedApiError) {
    super(parsed.message || `HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = parsed.code;
    this.vars = parsed.vars;
  }
}

export function isAbortError(e: unknown): boolean {
  return (
    (e instanceof DOMException && e.name === "AbortError") ||
    (e instanceof Error && e.name === "AbortError")
  );
}

/** POST /api/v1/export/auto/async → { job_id } */
export async function startAutoExport(
  body: AutoExportBody,
  signal?: AbortSignal,
): Promise<string> {
  const base = getApiBaseUrl();
  if (!base) throw new Error("NO_API_URL");

  const resp = await fetch(`${base}/api/v1/export/auto/async`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(body),
    signal,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new ApiError(resp.status, parseApiErrorText(text));
  }

  const json = (await resp.json()) as { job_id?: unknown };
  const jobId = typeof json?.job_id === "string" ? json.job_id : "";
  if (!jobId) throw new Error("BAD_JOB");
  return jobId;
}

/** GET /api/v1/jobs — recent analyze/export runs. */
export async function listRunHistory(
  opts: { limit?: number; signal?: AbortSignal } = {},
): Promise<RunHistoryItem[]> {
  const base = getApiBaseUrl();
  if (!base) throw new Error("NO_API_URL");

  const limit = opts.limit ?? 30;
  const resp = await fetch(`${base}/api/v1/jobs?limit=${limit}`, {
    method: "GET",
    headers: authHeaders(),
    signal: opts.signal,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new ApiError(resp.status, parseApiErrorText(text));
  }
  const json = (await resp.json()) as { jobs?: unknown };
  if (!Array.isArray(json.jobs)) return [];
  return json.jobs as RunHistoryItem[];
}

/** GET /api/v1/jobs/{id} (single fetch). */
export async function getJob(jobId: string, signal?: AbortSignal): Promise<JobStatus> {
  const base = getApiBaseUrl();
  if (!base) throw new Error("NO_API_URL");

  const resp = await fetch(`${base}/api/v1/jobs/${jobId}`, {
    method: "GET",
    headers: authHeaders(),
    signal,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new ApiError(resp.status, parseApiErrorText(text));
  }
  return (await resp.json()) as JobStatus;
}

export type PollOptions = {
  signal?: AbortSignal;
  intervalMs?: number;
  onProgress?: (done: number, total: number) => void;
};

/** Poll a job until it reaches a terminal status. */
export async function pollJob(jobId: string, opts: PollOptions = {}): Promise<JobStatus> {
  const { signal, intervalMs = 800, onProgress } = opts;

  for (let attempt = 0; attempt < 10_000; attempt++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const st = await getJob(jobId, signal);

    const done = typeof st.progress_done === "number" ? st.progress_done : 0;
    const total = typeof st.progress_total === "number" ? st.progress_total : 0;
    if (total > 0) onProgress?.(done, total);

    if (st.status === "succeeded") return st;
    if (st.status === "failed") {
      const detail =
        typeof st.error === "string" && st.error.trim() ? st.error.trim() : "JOB_FAILED";
      throw new JobFailedError(detail);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error("JOB_TIMEOUT");
}

function filenameFromContentDisposition(header: string | null): string {
  if (!header) return "hh_export.xlsx";
  const quoted = header.match(/filename="([^"]+)"/i);
  if (quoted?.[1]) return quoted[1];
  const plain = header.match(/filename=([^;\s]+)/i);
  if (plain?.[1]) return plain[1].replace(/"/g, "");
  return "hh_export.xlsx";
}

export type DownloadResult = { fileName: string; sizeBytes: number };

/** GET a completed job's `.xlsx` and trigger a browser download. */
export async function downloadJob(
  downloadPath: string,
  signal?: AbortSignal,
): Promise<DownloadResult> {
  const base = getApiBaseUrl();
  if (!base) throw new Error("NO_API_URL");

  const resp = await fetch(`${base}${downloadPath}`, {
    method: "GET",
    headers: authHeaders(),
    signal,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new ApiError(resp.status, parseApiErrorText(text));
  }

  const blob = await resp.blob();
  const fileName = filenameFromContentDisposition(resp.headers.get("Content-Disposition"));
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);

  return { fileName, sizeBytes: blob.size };
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
