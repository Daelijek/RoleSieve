"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/lib/i18n";
import {
  DocCallout,
  DocList,
  DocPageHeader,
  DocPrevNext,
  DocProse,
  DocSection,
  DocSteps,
} from "./DocBlocks";

export function DocsCompare() {
  const d = useDict().docs.compare;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <DocSection title={d.historyTitle}>
        <DocProse>{d.history}</DocProse>
      </DocSection>

      <DocSection title={d.metaTitle}>
        <DocList items={d.meta} />
      </DocSection>

      <DocSection title={d.workflowTitle}>
        <DocSteps steps={d.steps} />
      </DocSection>

      <DocCallout title={d.tipTitle}>{d.tip}</DocCallout>

      <DocCallout title={d.statusTitle}>{d.status}</DocCallout>

      <DocSection>
        <Link
          href="/docs/export"
          className="group/link inline-flex items-center gap-2 text-[14px] font-medium text-violet transition-colors hover:text-[color:var(--color-text-primary)]"
        >
          {d.exportLinkLabel}
          <ArrowRight
            size={15}
            strokeWidth={2}
            className="transition-transform duration-[var(--duration-base)] group-hover/link:translate-x-0.5"
          />
        </Link>
      </DocSection>

      <DocPrevNext currentSlug="compare" />
    </>
  );
}
