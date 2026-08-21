"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Halo } from "@/components/ui/Halo";
import { GradientText } from "@/components/ui/GradientText";
import { useDict } from "@/lib/i18n";

export function FinalCta() {
  const dict = useDict();
  const c = dict.finalCta;
  return (
    <section
      aria-labelledby="finalcta-title"
      className="relative py-24 sm:py-32"
    >
      <Halo
        size={700}
        height={450}
        top="10%"
        left="50%"
        opacity={0.35}
        variant="signature"
        className="-translate-x-1/2"
      />
      <Halo
        size={460}
        bottom="10px"
        right="-20px"
        opacity={0.25}
        variant="coral"
      />

      <Container>
        <div className="relative mx-auto max-w-3xl text-center">
          <Badge variant="eyebrow" className="justify-center">
            {c.eyebrow}
          </Badge>
          <h2
            id="finalcta-title"
            className="mt-4 text-balance text-[clamp(1.85rem,5vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)] sm:mt-5"
          >
            <GradientText>{c.title}</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-[1.6] text-[color:var(--color-text-muted)] sm:mt-5 sm:text-[16px]">
            {c.description}
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center">
            <Button
              href="/analyze"
              size="lg"
              className="w-full sm:w-auto"
              trailing={<ArrowRight size={16} strokeWidth={2.25} />}
            >
              {c.ctaPrimary}
            </Button>
            <Button
              href="/docs"
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              leading={<BookOpen size={15} strokeWidth={1.75} />}
            >
              {c.ctaGhost}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
