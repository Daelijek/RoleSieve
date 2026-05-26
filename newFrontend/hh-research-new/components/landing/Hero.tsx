import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GradientText } from "@/components/ui/GradientText";
import { Halo } from "@/components/ui/Halo";
import { DotGrid } from "@/components/ui/DotGrid";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroMockCard } from "./HeroMockCard";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export function Hero() {
  const h = dict.hero;
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-16 sm:pt-24"
    >
      <DotGrid fade="center" />
      <Halo size={760} top="-220px" left="-180px" opacity={0.28} />
      <Halo
        size={520}
        top="-80px"
        right="-140px"
        opacity={0.22}
        variant="violet"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(139,108,255,0.18),transparent_70%)]"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal immediate delay={0.05}>
            <Badge variant="eyebrow" className="justify-center">
              {h.eyebrow}
            </Badge>
          </Reveal>

          <Reveal immediate delay={0.15}>
            <h1
              id="hero-title"
              className="mt-6 text-balance text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[color:var(--color-text-primary)]"
            >
              {h.titleStart} <GradientText>{h.titleHighlight}</GradientText>{" "}
              {h.titleEnd}
            </h1>
          </Reveal>

          <Reveal immediate delay={0.28}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-[17px] leading-[1.6] text-[color:var(--color-text-muted)]">
              {h.subtitle}
            </p>
          </Reveal>

          <Reveal
            immediate
            delay={0.4}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <MagneticButton>
              <Button
                href="/analyze"
                size="lg"
                trailing={<ArrowRight size={16} strokeWidth={2.25} />}
              >
                {h.ctaPrimary}
              </Button>
            </MagneticButton>
            <Button href="#preview" size="lg" variant="outline">
              {h.ctaGhost}
            </Button>
          </Reveal>

          <Reveal immediate delay={0.55}>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[color:var(--color-text-muted)]">
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
          </Reveal>
        </div>

        <Reveal
          immediate
          delay={0.7}
          offset={16}
          className="relative mx-auto mt-16 max-w-5xl sm:mt-20"
        >
          <HeroMockCard />
        </Reveal>
      </Container>
    </section>
  );
}
