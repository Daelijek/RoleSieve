import type { ExportSummary, KpiSparkline } from "@/lib/types/export-summary";

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

export function buildSparklines(summary: ExportSummary): KpiSparkline[] {
  return [
    { key: "requested", sparkline: rampTo(summary.requested) },
    { key: "processed", sparkline: rampTo(summary.processed) },
    { key: "errors", sparkline: rampTo(summary.errors) },
    { key: "uniqueSkills", sparkline: rampTo(summary.top_skills.length) },
  ];
}
