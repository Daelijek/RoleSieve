"use client";

import type { ReactNode } from "react";
import { useDict } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function ProductAppFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shared = useDict().productPages.shared;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40 px-4 py-3 backdrop-blur">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-surface-3)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-surface-3)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-surface-3)]" />
        </div>
        <div className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/70 px-3 text-[12px] font-mono text-[color:var(--color-text-muted)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12 6 6 0 000-12z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          <span className="truncate">{shared.analyzePath}</span>
        </div>
        <span className="shrink-0 rounded-full border border-violet/30 bg-[color:var(--color-violet)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-violet">
          {shared.demoBadge}
        </span>
      </div>
      {children}
    </div>
  );
}
