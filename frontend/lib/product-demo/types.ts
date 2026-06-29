import type {
  AnalyzeRunMeta,
  ExportSummary,
  KpiSparkline,
} from "@/lib/types/export-summary";

export type ProductPresetId = "python" | "frontend" | "product" | "devops";

export type ProductDemoRun = {
  summary: ExportSummary;
  meta: AnalyzeRunMeta;
  sparklines: KpiSparkline[];
};

export type ProductInsightZone =
  | "kpi"
  | "skills"
  | "phrases"
  | "coverage"
  | "dedup"
  | "cloud"
  | "tables";
