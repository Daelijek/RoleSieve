"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGlassPanel } from "@/components/product/ProductGlassPanel";
import { ProductZone } from "@/components/product/ProductZone";
import type { AnalyzeRunMeta, ExportSummary, KpiSparkline } from "@/lib/types/export-summary";
import type { ProductInsightZone } from "@/lib/product-demo/types";
import { useDict } from "@/lib/i18n";
import { RunMetaBar } from "./RunMetaBar";
import { KpiStrip } from "./KpiStrip";
import { SkillsRankChart } from "./SkillsRankChart";
import { PhrasesRankChart } from "./PhrasesRankChart";
import { CoverageRing } from "./CoverageRing";
import { DedupFlow } from "./DedupFlow";
import { SkillsCloud } from "./SkillsCloud";
import { ErrorBreakdown } from "./ErrorBreakdown";
import { RankedTable } from "./RankedTable";

type ZoneInfo = { title: string; description: string };

type ResultsDashboardProps = {
  summary: ExportSummary;
  meta: AnalyzeRunMeta;
  sparklines: KpiSparkline[];
  downloadPath?: string | null;
  downloading?: boolean;
  onDownload?: () => void;
  variant?: "default" | "demo";
  interactive?: boolean;
  accent?: string;
  zoneInfo?: Partial<Record<ProductInsightZone, ZoneInfo>>;
};

export function ResultsDashboard({
  summary,
  meta,
  sparklines,
  downloadPath,
  downloading,
  onDownload,
  variant = "default",
  interactive = false,
  accent,
  zoneInfo,
}: ResultsDashboardProps) {
  const dict = useDict();
  const successful = summary.coverage?.successful ?? summary.processed;
  const isDemo = variant === "demo";
  const showDownload = !isDemo && downloadPath && onDownload;
  const [openZone, setOpenZone] = useState<string | null>(null);

  const zoneProps = (zone: ProductInsightZone) => ({
    zone,
    interactive,
    accent,
    info: zoneInfo?.[zone],
    open: openZone === zone,
    onToggle: (z: string) => setOpenZone((cur) => (cur === z ? null : z)),
    onClose: () => setOpenZone(null),
  });

  return (
    <ProductGlassPanel>
      <RunMetaBar
        meta={meta}
        downloadPath={showDownload ? downloadPath : null}
        downloading={downloading}
        onDownload={showDownload ? onDownload : undefined}
      />

      <ProductZone {...zoneProps("kpi")}>
        <KpiStrip summary={summary} sparklines={sparklines} />
      </ProductZone>

      <div className="grid auto-rows-fr gap-px bg-[color:var(--color-border-subtle)] lg:grid-cols-2">
        <Reveal delay={0.05} className="h-full">
          <ProductZone {...zoneProps("skills")} className="h-full">
            <SkillsRankChart items={summary.top_skills} successful={successful} />
          </ProductZone>
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <ProductZone {...zoneProps("phrases")} className="h-full">
            <PhrasesRankChart items={summary.top_keywords} successful={successful} />
          </ProductZone>
        </Reveal>
      </div>

      {(summary.coverage || summary.dedup) && (
        <div className="grid auto-rows-fr gap-px border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-border-subtle)] lg:grid-cols-2">
          {summary.coverage && (
            <Reveal delay={0.15} className="h-full">
              <ProductZone {...zoneProps("coverage")} className="h-full">
                <CoverageRing coverage={summary.coverage} errors={summary.errors} />
              </ProductZone>
            </Reveal>
          )}
          {summary.dedup && (
            <Reveal delay={0.2} className="h-full">
              <ProductZone {...zoneProps("dedup")} className="h-full">
                <DedupFlow dedup={summary.dedup} />
              </ProductZone>
            </Reveal>
          )}
        </div>
      )}

      <div className="border-t border-[color:var(--color-border-subtle)]">
        <Reveal delay={0.1}>
          <ProductZone {...zoneProps("cloud")}>
            <SkillsCloud items={summary.top_skills} />
          </ProductZone>
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
        <ProductZone {...zoneProps("tables")}>
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
        </ProductZone>
      )}
    </ProductGlassPanel>
  );
}
