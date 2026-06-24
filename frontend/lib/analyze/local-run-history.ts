import type { RunHistoryItem } from "@/lib/api/client";

const STORAGE_KEY = "rolesieve:analyze-runs";
const MAX_STORED = 40;

export type StoredRun = {
  jobId: string;
  queryLabel: string;
  region: string;
  experience: string;
  period: string;
  workFormat?: string;
  completedAt: string;
  status: "succeeded" | "failed";
  processed?: number | null;
  topSkill?: string | null;
};

function readAll(): StoredRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is StoredRun =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as StoredRun).jobId === "string" &&
        typeof (row as StoredRun).queryLabel === "string",
    );
  } catch {
    return [];
  }
}

function writeAll(rows: StoredRun[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, MAX_STORED)));
  } catch {
    /* quota / private mode */
  }
}

export function saveStoredRun(run: StoredRun): void {
  const rest = readAll().filter((r) => r.jobId !== run.jobId);
  writeAll([run, ...rest]);
}

export function loadStoredRuns(): StoredRun[] {
  return readAll();
}

export function storedRunToHistoryItem(run: StoredRun): RunHistoryItem {
  const ts = Date.parse(run.completedAt);
  const unix = Number.isFinite(ts) ? ts / 1000 : undefined;
  return {
    job_id: run.jobId,
    status: run.status,
    kind: "auto",
    created_at: unix,
    finished_at: unix,
    query_label: run.queryLabel,
    processed: run.processed ?? null,
    top_skill: run.topSkill ?? null,
    run_meta: {
      queryLabel: run.queryLabel,
      region: run.region,
      experience: run.experience,
      period: run.period,
      workFormat: run.workFormat ?? "",
    },
  };
}

export function mergeHistoryItems(
  apiRows: RunHistoryItem[],
  localRows: StoredRun[],
): RunHistoryItem[] {
  const byId = new Map<string, RunHistoryItem>();
  for (const row of apiRows) byId.set(row.job_id, row);
  for (const stored of localRows) {
    if (!byId.has(stored.jobId)) {
      byId.set(stored.jobId, storedRunToHistoryItem(stored));
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) =>
      (b.finished_at ?? b.created_at ?? 0) - (a.finished_at ?? a.created_at ?? 0),
  );
}
