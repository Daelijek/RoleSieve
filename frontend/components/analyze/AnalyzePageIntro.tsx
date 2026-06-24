"use client";

import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { useDict } from "@/lib/i18n";

export function AnalyzePageIntro() {
  const dict = useDict();

  return (
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
          {dict.analyze.pageHint}
        </p>
      </header>
    </Reveal>
  );
}
