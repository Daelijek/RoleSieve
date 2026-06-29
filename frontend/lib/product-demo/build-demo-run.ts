import type { Dictionary } from "@/lib/i18n";
import type { ExportSummary, RankedItem } from "@/lib/types/export-summary";
import { buildSparklines } from "./build-sparklines";
import type { ProductDemoRun, ProductPresetId } from "./types";

const PHRASE_SHARES = [0.78, 0.64, 0.51, 0.44, 0.39, 0.34, 0.28, 0.21];

function pctToCount(pct: number, total: number): number {
  return Math.max(1, Math.round((pct / 100) * total));
}

function buildKeywords(phrases: readonly string[], processed: number): RankedItem[] {
  return phrases.map((name, index) => ({
    name,
    count: Math.max(
      1,
      Math.round(processed * (PHRASE_SHARES[index] ?? 0.15)),
    ),
  }));
}

function buildSummary(
  preset: Dictionary["tryIt"]["presets"][ProductPresetId],
  dict: Dictionary,
): ExportSummary {
  const processed = preset.sample;
  const inputCount = Math.round(processed * 1.26);
  const duplicatesRemoved = inputCount - processed;
  const withKeySkills = Math.round(processed * 0.87);
  const errors = Math.max(2, Math.round(processed * 0.02));

  const top_skills: RankedItem[] = preset.skills.map((skill) => ({
    name: skill.name,
    count: pctToCount(skill.value, processed),
  }));

  return {
    requested: processed,
    processed,
    errors,
    dedup: {
      input_count: inputCount,
      unique_count: processed,
      duplicates_removed: duplicatesRemoved,
    },
    coverage: {
      successful: processed,
      with_key_skills: withKeySkills,
      without_key_skills: processed - withKeySkills,
      without_description: Math.max(1, Math.round(processed * 0.04)),
      key_skills_rate: withKeySkills / processed,
    },
    top_skills,
    top_keywords: buildKeywords(preset.phrases, processed),
    error_breakdown:
      errors > 0
        ? [
            {
              reason: dict.productPages.sample.errorReasons.notFound,
              count: Math.max(1, Math.round(errors * 0.6)),
            },
            {
              reason: dict.productPages.sample.errorReasons.timeout,
              count: Math.max(1, errors - Math.round(errors * 0.6)),
            },
          ]
        : [],
  };
}

export function buildDemoRun(
  presetId: ProductPresetId,
  dict: Dictionary,
): ProductDemoRun {
  const preset = dict.tryIt.presets[presetId];
  const metaConfig = dict.productPages.sample.presets[presetId];
  const summary = buildSummary(preset, dict);

  return {
    summary,
    meta: {
      runId: metaConfig.runId,
      queryLabel: preset.title,
      region: metaConfig.region,
      experience: metaConfig.experience,
      period: metaConfig.period,
      workFormat: metaConfig.workFormat,
      completedAt: "2026-05-28T14:32:00+03:00",
      fileSizeLabel: metaConfig.fileSizeLabel,
      status: "ready",
    },
    sparklines: buildSparklines(summary),
  };
}
