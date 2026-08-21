"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GradientText } from "@/components/ui/GradientText";
import { Halo } from "@/components/ui/Halo";
import { DotGrid } from "@/components/ui/DotGrid";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useDict } from "@/lib/i18n";

export function Hero() {
  const dict = useDict();
  const h = dict.hero;
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate pt-[calc(var(--header-height)+var(--section-py))] pb-[var(--section-py)] sm:pt-[calc(var(--header-height)+var(--section-py-lg))] sm:pb-[var(--section-py-lg)]"
    >
      <DotGrid fade="center" />
      <Halo size={700} top="20px" left="-60px" opacity={0.3} variant="signature" />
      <Halo
        size={500}
        top="40px"
        right="-40px"
        opacity={0.24}
        variant="violet"
      />

      <Container className="relative flex flex-col gap-14 sm:gap-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center sm:gap-10">
          <Badge variant="eyebrow" className="justify-center">
            {h.eyebrow}
          </Badge>

          <h1
            id="hero-title"
            className="text-balance text-[clamp(2.15rem,6.5vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[color:var(--color-text-primary)]"
          >
            {h.titleStart} <GradientText>{h.titleHighlight}</GradientText>{" "}
            {h.titleEnd}
          </h1>

          <p className="max-w-2xl text-pretty text-[15.5px] leading-[1.6] text-[color:var(--color-text-muted)] sm:text-[17px]">
            {h.subtitle}
          </p>

          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <MagneticButton className="w-full sm:w-auto">
              <Button
                href="/analyze"
                size="lg"
                className="w-full sm:w-auto"
                trailing={<ArrowRight size={16} strokeWidth={2.25} />}
              >
                {h.ctaPrimary}
              </Button>
            </MagneticButton>
            <Button
              href="/sample"
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              {h.ctaGhost}
            </Button>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[color:var(--color-text-muted)]">
            {h.reassurance.map((line) => (
              <li key={line} className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-[color:var(--color-text-subtle)]"
                />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
