"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render only after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          className,
        )}
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] transition-all duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-primary)]",
        className,
      )}
    >
      {isDark ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
    </button>
  );
}
