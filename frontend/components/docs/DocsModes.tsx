"use client";

import { useDict } from "@/lib/i18n";
import {
  DocCallout,
  DocDefList,
  DocList,
  DocPageHeader,
  DocPrevNext,
  DocProse,
  DocSection,
} from "./DocBlocks";

export function DocsModes() {
  const d = useDict().docs.modes;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <DocSection title={d.manualTitle}>
        <DocProse>{d.manual}</DocProse>
        <DocList items={d.manualPoints} />
      </DocSection>

      <DocSection title={d.autoTitle}>
        <DocProse>{d.auto}</DocProse>
        <DocList items={d.autoPoints} />
      </DocSection>

      <DocSection title={d.whenTitle}>
        <DocDefList
          items={d.when.map((w) => ({ term: w.mode, description: w.use }))}
        />
      </DocSection>

      <DocSection title={d.paramsTitle}>
        <DocDefList
          items={d.params.map((p) => ({
            term: p.name,
            description: p.description,
          }))}
        />
      </DocSection>

      <DocCallout title={d.limitTitle}>{d.limit}</DocCallout>

      <DocPrevNext currentSlug="modes" />
    </>
  );
}
