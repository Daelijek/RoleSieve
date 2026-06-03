"use client";

import { Reveal } from "@/components/ui/Reveal";
import type { AnalyzeRunMeta, ExportSummary, KpiSparkline } from "@/lib/types/export-summary";
import { getDict } from "@/lib/i18n";
import { RunMetaBar } from "./RunMetaBar";
import { KpiStrip } from "./KpiStrip";
import { SkillsRankChart } from "./SkillsRankChart";
import { PhrasesRankChart } from "./PhrasesRankChart";
import { CoverageRing } from "./CoverageRing";
import { DedupFlow } from "./DedupFlow";
import { SkillsCloud } from "./SkillsCloud";
import { ErrorBreakdown } from "./ErrorBreakdown";
import { RankedTable } from "./RankedTable";

const dict = getDict();

type ResultsDashboardProps = {
  summary: ExportSummary;
  meta: AnalyzeRunMeta;
  sparklines: KpiSparkline[];
  downloadPath?: string | null;
  downloading?: boolean;
  onDownload?: () => void;
};

export function ResultsDashboard({
  summary,
  meta,
  sparklines,
  downloadPath,
  downloading,
  onDownload,
}: ResultsDashboardProps) {
  const successful = summary.coverage?.successful ?? summary.processed;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-6 rounded-[40px] bg-[var(--signature-gradient-soft)] blur-3xl"
      />

      <div className="glass-strong relative overflow-hidden rounded-[28px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: "var(--noise-bg)",
            backgroundSize: "200px 200px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        <RunMetaBar
          meta={meta}
          downloadPath={downloadPath}
          downloading={downloading}
          onDownload={onDownload}
        />

        <KpiStrip summary={summary} sparklines={sparklines} />

        <div className="grid auto-rows-fr gap-px bg-[color:var(--color-border-subtle)] lg:grid-cols-2">
          <Reveal delay={0.05} className="h-full">
            <SkillsRankChart items={summary.top_skills} successful={successful} />
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <PhrasesRankChart items={summary.top_keywords} successful={successful} />
          </Reveal>
        </div>

        {(summary.coverage || summary.dedup) && (
          <div className="grid auto-rows-fr gap-px border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-border-subtle)] lg:grid-cols-2">
            {summary.coverage && (
              <Reveal delay={0.15} className="h-full">
                <CoverageRing coverage={summary.coverage} errors={summary.errors} />
              </Reveal>
            )}
            {summary.dedup && (
              <Reveal delay={0.2} className="h-full">
                <DedupFlow dedup={summary.dedup} />
              </Reveal>
            )}
          </div>
        )}

        <div className="border-t border-[color:var(--color-border-subtle)]">
          <Reveal delay={0.1}>
            <SkillsCloud items={summary.top_skills} />
          </Reveal>
        </div>

        {summary.error_breakdown && summary.error_breakdown.length > 0 && (
          <div className="border-t border-[color:var(--color-border-subtle)]">
            <Reveal delay={0.15}>
              <ErrorBreakdown items={summary.error_breakdown} />
            </Reveal>
          </div>
        )}

        {summary.coverage && (
          <div className="grid gap-px border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-border-subtle)] lg:grid-cols-2">
            <Reveal delay={0.1} className="bg-[color:var(--color-surface)]/40 p-4 sm:p-5">
              <RankedTable
                title={dict.analyze.table.skillsTitle}
                items={summary.top_skills}
                successful={successful}
                filenameStem="skills_top20"
              />
            </Reveal>
            <Reveal delay={0.15} className="bg-[color:var(--color-surface)]/40 p-4 sm:p-5">
              <RankedTable
                title={dict.analyze.table.keywordsTitle}
                items={summary.top_keywords}
                successful={successful}
                filenameStem="phrases_top20"
              />
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
