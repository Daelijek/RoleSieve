"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ResultsDashboard } from "./ResultsDashboard";
import { RunLauncher, type RunResult } from "./RunLauncher";
import {
  downloadJob,
  formatFileSize,
  isAbortError,
} from "@/lib/api/client";
import type {
  AnalyzeRunMeta,
  ExportSummary,
  KpiSparkline,
} from "@/lib/types/export-summary";

type AnalyzeWorkspaceProps = {
  initialSummary: ExportSummary;
  initialMeta: AnalyzeRunMeta;
  initialSparklines: KpiSparkline[];
};

/** Backend doesn't return KPI trends; synthesize a short ramp ending at the final value. */
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

export function AnalyzeWorkspace({
  initialSummary,
  initialMeta,
  initialSparklines,
}: AnalyzeWorkspaceProps) {
  const [summary, setSummary] = useState<ExportSummary>(initialSummary);
  const [meta, setMeta] = useState<AnalyzeRunMeta>(initialMeta);
  const [sparklines, setSparklines] = useState<KpiSparkline[]>(initialSparklines);
  const [downloadPath, setDownloadPath] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadAbortRef = useRef<AbortController | null>(null);

  function handleResult(result: RunResult) {
    setSummary(result.summary);
    setMeta(result.meta);
    setSparklines(buildSparklines(result.summary));
    setDownloadPath(result.downloadPath);
  }

  async function handleDownload() {
    if (!downloadPath || downloading) return;
    setDownloading(true);
    const ac = new AbortController();
    downloadAbortRef.current = ac;
    try {
      const { sizeBytes } = await downloadJob(downloadPath, ac.signal);
      setMeta((prev) => ({ ...prev, fileSizeLabel: formatFileSize(sizeBytes) }));
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
    <div className="flex flex-col gap-12">
      <Reveal immediate>
        <RunLauncher onResult={handleResult} />
      </Reveal>

      <Reveal delay={0.08}>
        <ResultsDashboard
          summary={summary}
          meta={meta}
          sparklines={sparklines}
          downloadPath={downloadPath}
          downloading={downloading}
          onDownload={handleDownload}
        />
      </Reveal>
    </div>
  );
}
