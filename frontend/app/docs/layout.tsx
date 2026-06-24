import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/DotGrid";
import { Halo } from "@/components/ui/Halo";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <DotGrid />
        <Halo size={720} top="-180px" right="-140px" opacity={0.18} variant="violet" />
        <Halo size={560} bottom="-220px" left="-120px" opacity={0.14} variant="coral" />
      </div>

      <Header variant="docs" />

      <main className="relative max-w-full overflow-x-clip pb-20 pt-[calc(var(--header-height)+2rem)] sm:pb-28 sm:pt-[calc(var(--header-height)+3rem)]">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14 xl:gap-20">
            <aside className="min-w-0">
              <DocsSidebar />
            </aside>
            <div className="min-w-0 max-w-3xl">{children}</div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
