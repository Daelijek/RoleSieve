import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DotGrid } from "@/components/ui/DotGrid";
import { Halo } from "@/components/ui/Halo";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { GradientText } from "@/components/ui/GradientText";

export default function NotFound() {
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

      <Header variant="contact" />

      <main className="relative flex min-h-[calc(100vh-var(--header-height)-140px)] flex-col items-center justify-center pb-20 pt-[calc(var(--header-height)+2rem)] text-center">
        <Container className="flex flex-col items-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-accent-teal)]">
            Ошибка 404
          </span>
          <h1 className="mt-4 text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none tracking-tight text-[color:var(--color-text-primary)]">
            Страница <GradientText>не найдена</GradientText>
          </h1>
          <p className="mt-5 max-w-md text-pretty text-[16px] leading-relaxed text-[color:var(--color-text-muted)]">
            Кажется, этой страницы не существует или она была перемещена по другому адресу.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/" size="lg" leading={<Home size={16} />}>
              На главную
            </Button>
            <Button href="/analyze" size="lg" variant="outline">
              К анализу вакансий
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
