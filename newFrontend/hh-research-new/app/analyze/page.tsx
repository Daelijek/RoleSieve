import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/DotGrid";
import { Halo } from "@/components/ui/Halo";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { AnalyzeHeader } from "@/components/analyze/AnalyzeHeader";
import { ResultsDashboard } from "@/components/analyze/ResultsDashboard";
import {
  mockAnalyzeRunMeta,
  mockExportSummary,
  mockKpiSparklines,
} from "@/lib/mocks/analyze-summary";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export default function AnalyzePage() {
  return (
    <>
      <DotGrid />
      <Halo size={720} top="-180px" right="-140px" opacity={0.2} variant="violet" />
      <Halo size={560} bottom="-220px" left="-120px" opacity={0.16} variant="coral" />

      <AnalyzeHeader />

      <main className="relative pb-20 pt-8 sm:pb-28 sm:pt-12">
        <Container>
          <Reveal immediate>
            <header className="mb-10 max-w-2xl">
              <Badge variant="eyebrow">{dict.analyze.badge}</Badge>
              <h1 className="mt-4 text-[clamp(1.875rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)]">
                {dict.analyze.pageTitle}
              </h1>
              <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--color-text-muted)] sm:text-[16px]">
                {dict.analyze.pageDescription}
              </p>
              <p className="mt-2 font-mono text-[11px] text-[color:var(--color-text-subtle)]">
                {dict.analyze.mockNote}
              </p>
            </header>
          </Reveal>

          <Reveal delay={0.08}>
            <ResultsDashboard
              summary={mockExportSummary}
              meta={mockAnalyzeRunMeta}
              sparklines={mockKpiSparklines}
            />
          </Reveal>
        </Container>
      </main>
    </>
  );
}
