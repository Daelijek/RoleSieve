"use client";

import { useDict } from "@/lib/i18n";
import {
  DocCardLink,
  DocList,
  DocPageHeader,
  DocPrevNext,
  DocProse,
  DocSection,
} from "./DocBlocks";

function hrefFor(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

export function DocsOverview() {
  const d = useDict().docs.overview;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <DocSection title={d.whatTitle}>
        <DocProse>{d.what}</DocProse>
      </DocSection>

      <DocSection title={d.outputTitle}>
        <DocList items={d.output} />
      </DocSection>

      <DocSection title={d.audienceTitle}>
        <DocProse>{d.audience}</DocProse>
      </DocSection>

      <DocSection title={d.cardsTitle}>
        <div className="grid gap-4 sm:grid-cols-2">
          {d.cards.map((card) => (
            <DocCardLink
              key={card.slug}
              href={hrefFor(card.slug)}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </DocSection>

      <DocPrevNext currentSlug="" />
    </>
  );
}
