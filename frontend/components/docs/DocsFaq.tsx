"use client";

import { Plus } from "lucide-react";
import { useDict } from "@/lib/i18n";
import { DocPageHeader, DocPrevNext } from "./DocBlocks";

export function DocsFaq() {
  const d = useDict().docs.faq;
  return (
    <>
      <DocPageHeader title={d.title} lead={d.lead} />

      <ul className="divide-y divide-[color:var(--color-border-subtle)] overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40 backdrop-blur">
        {d.items.map((item) => (
          <li key={item.q}>
            <details className="group/faq [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-[color:var(--color-surface-2)]/30 sm:px-6">
                <span className="text-[15px] font-medium text-[color:var(--color-text-primary)] sm:text-[16px]">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)] transition-[transform,color,background] duration-[var(--duration-base)] group-open/faq:rotate-45 group-open/faq:border-violet/60 group-open/faq:bg-[color:var(--color-violet)]/15 group-open/faq:text-violet"
                >
                  <Plus size={14} strokeWidth={2} />
                </span>
              </summary>
              <div className="px-5 pb-6 pr-10 text-[14.5px] leading-[1.65] text-[color:var(--color-text-muted)] sm:px-6 sm:pr-14">
                {item.a}
              </div>
            </details>
          </li>
        ))}
      </ul>

      <DocPrevNext currentSlug="faq" />
    </>
  );
}
