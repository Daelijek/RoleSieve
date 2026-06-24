"use client";

import { useDict } from "@/lib/i18n";
import {
  DocDefList,
  DocList,
  DocPageHeader,
  DocPrevNext,
  DocProse,
  DocSection,
  DocTable,
} from "./DocBlocks";

export function DocsReport() {
  const d = useDict().docs.report;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <DocSection title={d.excelTitle}>
        <DocProse>{d.excelIntro}</DocProse>
        <div className="mt-4">
          <DocTable
            head={d.columnsHead}
            rows={d.columns.map((c) => [c.col, c.desc])}
          />
        </div>
      </DocSection>

      <DocSection title={d.dashboardTitle}>
        <DocDefList
          items={d.dashboard.map((item) => ({
            term: item.title,
            description: item.description,
          }))}
        />
      </DocSection>

      <DocSection title={d.resumeTitle}>
        <DocList items={d.resume} />
      </DocSection>

      <DocPrevNext currentSlug="report" />
    </>
  );
}
