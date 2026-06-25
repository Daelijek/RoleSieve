"use client";

import Link from "next/link";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useDict } from "@/lib/i18n";

export function ContactContent() {
  const c = useDict().contact;

  return (
    <>
      <header className="mb-10 max-w-2xl">
        <h1 className="text-[clamp(1.875rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)]">
          {c.title}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--color-text-muted)] sm:text-[16px]">
          {c.lead}
        </p>
      </header>

      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {c.channelsTitle}
        </h2>
        <a
          href={c.githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="glass mt-4 flex items-start gap-4 rounded-2xl border border-[color:var(--color-border-strong)] p-5 transition-colors hover:border-violet/40 sm:p-6"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-violet">
            <MessageCircle size={18} strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 text-[15px] font-semibold text-[color:var(--color-text-primary)]">
              {c.githubLabel}
              <ExternalLink size={14} className="text-[color:var(--color-text-subtle)]" />
            </span>
            <span className="mt-1 block text-[14px] leading-[1.6] text-[color:var(--color-text-muted)]">
              {c.githubDescription}
            </span>
          </span>
        </a>
      </section>

      <p className="mt-10 text-[14px] text-[color:var(--color-text-muted)]">
        {c.docsHint}{" "}
        <Link
          href="/docs"
          className="font-medium text-violet underline-offset-2 transition-colors hover:underline"
        >
          {c.docsLink}
        </Link>
        .
      </p>
    </>
  );
}
