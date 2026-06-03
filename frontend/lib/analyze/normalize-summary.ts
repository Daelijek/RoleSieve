import type { ExportSummary, RankedItem } from "@/lib/types/export-summary";

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function asRankedList(value: unknown): RankedItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const name = (row as { name?: unknown }).name;
      const count = asNumber((row as { count?: unknown }).count);
      if (typeof name !== "string" || count === undefined) return null;
      return { name, count };
    })
    .filter((row): row is RankedItem => row !== null);
}

/** Coerce API / stored job summary into a stable shape for KPIs and charts. */
export function normalizeExportSummary(raw: unknown): ExportSummary {
  const s =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const dedup =
    s.dedup && typeof s.dedup === "object"
      ? (s.dedup as ExportSummary["dedup"])
      : undefined;
  const coverage =
    s.coverage && typeof s.coverage === "object"
      ? (s.coverage as ExportSummary["coverage"])
      : undefined;

  const requested =
    asNumber(s.requested) ??
    asNumber(dedup?.unique_count) ??
    asNumber(dedup?.input_count) ??
    0;
  const processed =
    asNumber(s.processed) ??
    asNumber(coverage?.successful) ??
    0;

  return {
    requested,
    processed,
    errors: asNumber(s.errors) ?? 0,
    top_skills: asRankedList(s.top_skills),
    top_keywords: asRankedList(s.top_keywords),
    dedup,
    coverage,
    error_breakdown: Array.isArray(s.error_breakdown)
      ? (s.error_breakdown as ExportSummary["error_breakdown"])
      : undefined,
  };
}
