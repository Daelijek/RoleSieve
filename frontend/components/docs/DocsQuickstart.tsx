"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDict } from "@/lib/i18n";
import {
  DocCallout,
  DocPageHeader,
  DocPrevNext,
  DocSection,
  DocSteps,
} from "./DocBlocks";

export function DocsQuickstart() {
  const d = useDict().docs.quickstart;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <DocSection title={d.stepsTitle}>
        <DocSteps steps={d.steps} />
      </DocSection>

      <DocSection>
        <Button
          href="/analyze"
          size="lg"
          trailing={<ArrowRight size={16} strokeWidth={2.25} />}
        >
          {d.cta}
        </Button>
      </DocSection>

      <DocCallout title={d.tipTitle}>{d.tip}</DocCallout>

      <DocPrevNext currentSlug="quickstart" />
    </>
  );
}
