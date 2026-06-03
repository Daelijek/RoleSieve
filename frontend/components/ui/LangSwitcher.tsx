"use client";

import { cn } from "@/lib/cn";
import { useLocale, type Locale } from "@/lib/i18n";

type LangSwitcherProps = {
  className?: string;
};

export function LangSwitcher({ className }: LangSwitcherProps) {
  const { locale, setLocale, dict } = useLocale();

  const btn =
    "relative z-10 rounded-full px-3 py-1 text-[12px] font-mono font-medium tracking-wider transition-colors";

  function select(next: Locale) {
    if (next !== locale) setLocale(next);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/60 p-0.5 backdrop-blur",
        className,
      )}
      role="group"
      aria-label={dict.meta.langLabel}
    >
      <button
        type="button"
        aria-pressed={locale === "ru"}
        onClick={() => select("ru")}
        className={cn(
          btn,
          locale === "ru"
            ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-primary)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
            : "text-[color:var(--color-text-subtle)] hover:text-[color:var(--color-text-muted)]",
        )}
      >
        RU
      </button>
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => select("en")}
        className={cn(
          btn,
          locale === "en"
            ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-primary)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
            : "text-[color:var(--color-text-subtle)] hover:text-[color:var(--color-text-muted)]",
        )}
      >
        EN
      </button>
    </div>
  );
}
