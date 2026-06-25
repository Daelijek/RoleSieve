"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/lib/i18n";
import {
  DocCallout,
  DocDefList,
  DocPageHeader,
  DocPrevNext,
  DocProse,
  DocSection,
  DocSteps,
} from "./DocBlocks";

export function DocsManual() {
  const d = useDict().docs.manual;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <DocSection title={d.formatTitle}>
        <DocProse>{d.format}</DocProse>
        <div className="mt-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            {d.formatExampleTitle}
          </p>
          <pre className="mt-2 overflow-x-auto font-mono text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
            {d.formatExample}
          </pre>
        </div>
      </DocSection>

      <DocSection title={d.stepsTitle}>
        <DocSteps steps={d.steps} />
      </DocSection>

      <DocSection title={d.whenTitle}>
        <DocDefList
          items={d.when.map((w) => ({ term: w.mode, description: w.use }))}
        />
      </DocSection>

      <DocCallout title={d.limitTitle}>{d.limit}</DocCallout>

      <DocCallout title={d.statusTitle}>{d.status}</DocCallout>

      <DocSection>
        <Link
          href="/docs/modes"
          className="group/link inline-flex items-center gap-2 text-[14px] font-medium text-violet transition-colors hover:text-[color:var(--color-text-primary)]"
        >
          {d.modesLinkLabel}
          <ArrowRight
            size={15}
            strokeWidth={2}
            className="transition-transform duration-[var(--duration-base)] group-hover/link:translate-x-0.5"
          />
        </Link>
      </DocSection>

      <DocPrevNext currentSlug="manual" />
    </>
  );
}
