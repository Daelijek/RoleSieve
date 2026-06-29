import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ProductGlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-6 rounded-[40px] bg-[var(--signature-gradient-soft)] blur-3xl"
      />
      <div className="glass-strong relative overflow-hidden rounded-[28px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: "var(--noise-bg)",
            backgroundSize: "200px 200px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
        {children}
      </div>
    </div>
  );
}
