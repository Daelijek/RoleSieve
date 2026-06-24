import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/DotGrid";
import { Halo } from "@/components/ui/Halo";
import { Header } from "@/components/landing/Header";
import { AnalyzePageIntro } from "@/components/analyze/AnalyzePageIntro";
import { AnalyzeWorkspace } from "@/components/analyze/AnalyzeWorkspace";

export default function AnalyzePage() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <DotGrid />
        <Halo size={720} top="-180px" right="-140px" opacity={0.2} variant="violet" />
        <Halo size={560} bottom="-220px" left="-120px" opacity={0.16} variant="coral" />
      </div>

      <Header variant="analyze" />

      <main className="relative max-w-full overflow-x-clip pb-20 pt-[calc(var(--header-height)+2rem)] sm:pb-28 sm:pt-[calc(var(--header-height)+3rem)]">
        <Container>
          <AnalyzePageIntro />
          <AnalyzeWorkspace />
        </Container>
      </main>
    </>
  );
}
