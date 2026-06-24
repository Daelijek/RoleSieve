export type RankedItem = {
  name: string;
  count: number;
};

export type ExportSummary = {
  requested: number;
  processed: number;
  errors: number;
  top_skills: RankedItem[];
  top_keywords: RankedItem[];
  dedup?: {
    input_count: number;
    unique_count: number;
    duplicates_removed: number;
  };
  coverage?: {
    successful: number;
    with_key_skills: number;
    without_key_skills: number;
    without_description: number;
    key_skills_rate: number;
  };
  error_breakdown?: Array<{ reason: string; count: number }>;
};

export type AnalyzeRunMeta = {
  runId: string;
  queryLabel: string;
  region: string;
  experience: string;
  period: string;
  workFormat: string;
  completedAt: string;
  fileSizeLabel: string;
  status: "ready" | "running" | "failed";
};

export type KpiSparkline = {
  key: "requested" | "processed" | "errors" | "uniqueSkills";
  sparkline: readonly number[];
};
