"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getDict } from "@/lib/i18n";

const dict = getDict();

const CYCLE_MS = 5200;

export function HeroMockCard() {
  const m = dict.heroMock;
  const cycles = m.cycles;
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % cycles.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [cycles.length, reduce]);

  const cur = cycles[idx];
  const percent = Math.round((cur.progressCurrent / cur.progressTotal) * 100);

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 rounded-[40px] bg-[var(--signature-gradient-soft)] blur-2xl"
      />

      <div className="glass-strong relative overflow-hidden rounded-[24px] p-5 sm:p-6">
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[24px] opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: "var(--noise-bg)",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Browser-like header */}
        <div className="mb-5 flex items-center gap-3 border-b border-[color:var(--color-border-subtle)] pb-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex h-7 flex-1 items-center gap-2 rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/70 px-3 text-[12px] font-mono text-[color:var(--color-text-muted)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12 6 6 0 000-12z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            hhresearch.app/analyze
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)] sm:inline">
            {m.previewLabel}
          </span>
        </div>

        {/* Status row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
            </span>
            <span className="text-[13px] font-medium text-[color:var(--color-text-primary)]">
              {m.statusLabel}
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`chip-${idx}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)]/70 px-3 py-1 font-mono text-[11px] text-[color:var(--color-text-muted)]"
            >
              <span className="h-1 w-1 rounded-full bg-aqua" />
              {cur.queryChip}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[12px] text-[color:var(--color-text-muted)]">
              {m.progressLabel}
            </span>
            <span className="font-mono text-[13px] tabular-nums text-[color:var(--color-text-primary)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`cur-${idx}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {cur.progressCurrent}
                </motion.span>
              </AnimatePresence>
              <span className="text-[color:var(--color-text-subtle)]">
                {" "}
                / {cur.progressTotal}
              </span>
            </span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--signature-gradient)] shadow-[0_0_18px_rgba(139,108,255,0.6)]"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: "shimmer-x 2.2s var(--ease-premium) infinite",
              }}
            />
          </div>
        </div>

        {/* Two columns */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Top skills */}
          <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-medium text-[color:var(--color-text-primary)]">
                {m.skillsTitle}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                top 5
              </span>
            </div>
            <ul className="space-y-2.5">
              {cur.skills.map((s) => (
                <li key={s.name} className="flex items-center gap-3">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={`${idx}-${s.name}-name`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 4 }}
                      transition={{ duration: 0.3 }}
                      className="w-24 truncate text-[12px] text-[color:var(--color-text-muted)]"
                    >
                      {s.name}
                    </motion.span>
                  </AnimatePresence>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-[var(--signature-gradient)]"
                      initial={false}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  </div>
                  <span className="w-9 text-right font-mono text-[11px] tabular-nums text-[color:var(--color-text-primary)]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={`${idx}-${s.name}-val`}
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 2 }}
                        transition={{ duration: 0.3 }}
                        className="inline-block"
                      >
                        {s.value}%
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top phrases */}
          <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-medium text-[color:var(--color-text-primary)]">
                {m.phrasesTitle}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                top 4
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={`phrases-${idx}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap gap-1.5"
              >
                {cur.phrases.map((p) => (
                  <li
                    key={p}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/80 px-2.5 py-1 text-[12px] text-[color:var(--color-text-primary)]"
                  >
                    <span aria-hidden className="h-1 w-1 rounded-full bg-coral" />
                    {p}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer mini status */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--color-border-subtle)] pt-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
              {m.liveLabel}
            </span>
            <div className="flex items-center gap-1">
              {cycles.map((_, i) => (
                <span
                  key={i}
                  className={
                    i === idx
                      ? "h-1 w-3 rounded-full bg-[var(--signature-gradient)] transition-all duration-300"
                      : "h-1 w-1 rounded-full bg-white/15 transition-all duration-300"
                  }
                />
              ))}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
            {m.apiLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
