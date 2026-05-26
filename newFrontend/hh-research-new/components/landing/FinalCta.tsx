import { ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Halo } from "@/components/ui/Halo";
import { GradientText } from "@/components/ui/GradientText";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export function FinalCta() {
  const c = dict.finalCta;
  return (
    <section
      aria-labelledby="finalcta-title"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Big centered halo */}
      <Halo
        size={900}
        height={520}
        top="-80px"
        left="50%"
        opacity={0.4}
        className="-translate-x-1/2"
      />
      <Halo
        size={520}
        bottom="-160px"
        right="-100px"
        opacity={0.22}
        variant="coral"
      />

      <Container>
        <div className="relative mx-auto max-w-3xl text-center">
          <Badge variant="eyebrow" className="justify-center">
            {c.eyebrow}
          </Badge>
          <h2
            id="finalcta-title"
            className="mt-5 text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-[color:var(--color-text-primary)]"
          >
            <GradientText>{c.title}</GradientText>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[16px] leading-[1.6] text-[color:var(--color-text-muted)]">
            {c.description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="/analyze"
              size="lg"
              trailing={<ArrowRight size={16} strokeWidth={2.25} />}
            >
              {c.ctaPrimary}
            </Button>
            <Button
              href="/docs"
              size="lg"
              variant="outline"
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
