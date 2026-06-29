"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDict } from "@/lib/i18n";

type ZoneInfo = {
  title: string;
  description: string;
};

type ProductZoneProps = {
  zone: string;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  accent?: string;
  info?: ZoneInfo;
  open?: boolean;
  onToggle?: (zone: string) => void;
  onClose?: () => void;
};

export function ProductZone({
  zone,
  children,
  className,
  interactive = false,
  accent = "168 85 247",
  info,
  open = false,
  onToggle,
  onClose,
}: ProductZoneProps) {
  const dict = useDict();
  const reduce = useReducedMotion();
  const shared = dict.productPages.shared;
  const enabled = interactive && Boolean(info);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!enabled) {
    return (
      <div data-product-zone={zone} className={cn("rounded-xl", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      data-product-zone={zone}
      style={{ "--zone-accent": accent } as CSSProperties}
      className={cn(
        "group/zone relative rounded-xl transition-[box-shadow] duration-[var(--duration-fast)]",
        !open && "hover:zone-hover-glow",
        className,
      )}
    >
      {children}

      <button
        type="button"
        onClick={() => onToggle?.(zone)}
        aria-label={info?.title ? `${shared.zoneInfoOpen}: ${info.title}` : shared.zoneInfoOpen}
        aria-expanded={open}
        style={{
          borderColor: `rgb(${accent} / 0.4)`,
          color: `rgb(${accent})`,
        }}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border bg-[color:var(--color-surface)]/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur transition-opacity duration-[var(--duration-fast)]",
          "opacity-0 focus-visible:opacity-100 group-hover/zone:opacity-100",
          open && "opacity-100",
        )}
      >
        <Info size={12} strokeWidth={2} />
        <span className="hidden sm:inline">{shared.zoneInfoOpen}</span>
      </button>

      <AnimatePresence>
        {open && info ? (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-[color:var(--color-canvas)]/70 p-5 backdrop-blur-sm"
            onClick={() => onClose?.()}
          >
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                borderColor: `rgb(${accent} / 0.4)`,
                boxShadow: `0 0 40px -10px rgb(${accent} / 0.4)`,
              }}
              className="relative max-w-md rounded-2xl border bg-[color:var(--color-surface)]/95 p-5 pr-10 text-left shadow-[var(--shadow-card)]"
            >
              <button
                type="button"
                onClick={() => onClose?.()}
                aria-label={shared.zoneInfoClose}
                className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-full text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-primary)]"
              >
                <X size={15} strokeWidth={2} />
              </button>
              <p
                className="text-[15px] font-semibold text-[color:var(--color-text-primary)]"
                style={{ color: `rgb(${accent})` }}
              >
                {info.title}
              </p>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--color-text-muted)]">
                {info.description}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
