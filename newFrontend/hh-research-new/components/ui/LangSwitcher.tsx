"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type LangSwitcherProps = {
  comingSoonLabel?: string;
  className?: string;
};

export function LangSwitcher({
  comingSoonLabel = "Скоро",
  className,
}: LangSwitcherProps) {
  const [tooltip, setTooltip] = useState(false);
  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/60 p-0.5 backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Переключатель языка"
    >
      <button
        type="button"
        aria-pressed
        className="relative z-10 rounded-full bg-[color:var(--color-surface-2)] px-3 py-1 text-[12px] font-mono font-medium tracking-wider text-[color:var(--color-text-primary)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
      >
        RU
      </button>
      <button
        type="button"
        aria-pressed="false"
        aria-disabled="true"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
        className="relative z-10 cursor-not-allowed rounded-full px-3 py-1 text-[12px] font-mono font-medium tracking-wider text-[color:var(--color-text-subtle)] transition-colors hover:text-[color:var(--color-text-muted)]"
      >
        EN
      </button>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] px-2 py-1 text-[11px] font-medium text-[color:var(--color-text-primary)] shadow-lg transition-opacity duration-150",
          tooltip ? "opacity-100" : "opacity-0",
        )}
      >
        {comingSoonLabel}
      </span>
    </div>
  );
}
