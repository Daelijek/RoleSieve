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
  DocTable,
} from "./DocBlocks";

export function DocsExport() {
  const d = useDict().docs.export;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <DocSection title={d.whereTitle}>
        <DocProse>{d.where}</DocProse>
      </DocSection>

      <DocSection title={d.howTitle}>
        <DocSteps steps={d.steps} />
      </DocSection>

      <DocSection title={d.columnsTitle}>
        <DocTable
          head={d.columnsHead}
          rows={d.columns.map((c) => [c.col, c.desc])}
        />
      </DocSection>

      <DocSection title={d.filesTitle}>
        <DocList items={d.files} />
      </DocSection>

      <DocCallout title={d.tipTitle}>{d.tip}</DocCallout>

      <DocSection>
        <Link
          href="/docs/report"
          className="group/link inline-flex items-center gap-2 text-[14px] font-medium text-violet transition-colors hover:text-[color:var(--color-text-primary)]"
        >
          {d.excelLinkLabel}
          <ArrowRight
            size={15}
            strokeWidth={2}
            className="transition-transform duration-[var(--duration-base)] group-hover/link:translate-x-0.5"
          />
        </Link>
      </DocSection>

      <DocPrevNext currentSlug="export" />
    </>
  );
}
