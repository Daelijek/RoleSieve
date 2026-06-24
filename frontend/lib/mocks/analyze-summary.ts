import type {
  AnalyzeRunMeta,
  ExportSummary,
  KpiSparkline,
} from "@/lib/types/export-summary";

const PROCESSED = 247;

function pctToCount(pct: number, total = PROCESSED): number {
  return Math.round((pct / 100) * total);
}

/** Mock aligned with landing `preview` section — Python Developer · Москва · 1–3 года */
export const mockAnalyzeRunMeta: AnalyzeRunMeta = {
  runId: "1247",
  queryLabel: "Python Developer",
  region: "Москва",
  experience: "1–3 года",
  period: "За 30 дней",
  workFormat: "Удалённо",
  completedAt: "2026-05-28T14:32:00+03:00",
  fileSizeLabel: "28 KB",
  status: "ready",
};

export const mockExportSummary: ExportSummary = {
  requested: 247,
  processed: PROCESSED,
  errors: 5,
  dedup: {
    input_count: 312,
    unique_count: 247,
    duplicates_removed: 65,
  },
  coverage: {
    successful: 247,
    with_key_skills: 215,
    without_key_skills: 32,
    without_description: 10,
    key_skills_rate: 0.87,
  },
  top_skills: [
    { name: "Python", count: pctToCount(84) },
    { name: "SQL", count: pctToCount(71) },
    { name: "Docker", count: pctToCount(58) },
    { name: "Django", count: pctToCount(52) },
    { name: "PostgreSQL", count: pctToCount(47) },
    { name: "Git", count: pctToCount(41) },
    { name: "Linux", count: pctToCount(36) },
    { name: "FastAPI", count: pctToCount(29) },
    { name: "Kubernetes", count: pctToCount(24) },
    { name: "Redis", count: pctToCount(22) },
  ],
  top_keywords: [
    { name: "опыт работы в команде", count: pctToCount(78) },
    { name: "знание SQL обязательно", count: pctToCount(64) },
    { name: "английский — Intermediate", count: pctToCount(51) },
    { name: "опыт с Docker / Kubernetes", count: pctToCount(44) },
    { name: "работа в Agile / Scrum", count: pctToCount(39) },
    { name: "понимание REST API", count: pctToCount(34) },
    { name: "опыт с микросервисами", count: pctToCount(28) },
    { name: "знание принципов SOLID", count: pctToCount(21) },
    { name: "коммерческий опыт от 2 лет", count: pctToCount(19) },
    { name: "опыт code review", count: pctToCount(16) },
  ],
  error_breakdown: [
    { reason: "HTTP 404 — вакансия снята", count: 3 },
    { reason: "Timeout при повторном запросе", count: 2 },
  ],
};

export const mockKpiSparklines: KpiSparkline[] = [
  { key: "requested", sparkline: [180, 195, 210, 225, 238, 247] },
  { key: "processed", sparkline: [120, 158, 189, 210, 232, 247] },
  { key: "errors", sparkline: [0, 1, 2, 3, 4, 5] },
  {
    key: "uniqueSkills",
    sparkline: [6, 7, 8, 9, 10, 10],
  },
];
