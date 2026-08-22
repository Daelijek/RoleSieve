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
          "flex h-[var(--header-control-height)] w-[var(--header-control-height)] items-center justify-center rounded-lg",
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
        "flex h-[var(--header-control-height)] w-[var(--header-control-height)] items-center justify-center rounded-lg border border-neutral-400/25 bg-neutral-300/20 hover:bg-neutral-300/35 dark:bg-neutral-400/20 dark:hover:bg-neutral-400/35 text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] backdrop-blur-[1px] transition-all duration-[var(--duration-base)] ease-[var(--ease-premium)] active:scale-95",
        className,
      )}
    >
      {isDark ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
    </button>
  );
}
