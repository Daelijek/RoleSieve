"use client";

import { Download, BarChart3, Quote, ShieldCheck, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { Halo } from "@/components/ui/Halo";
import { useDict } from "@/lib/i18n";

export function LivePreview() {
  const dict = useDict();
  const p = dict.preview;
  const maxSkill = Math.max(...p.skills.map((s) => s.value));
  const maxPhrase = Math.max(...p.phrases.map((s) => s.value));

  return (
    <section
      id="preview"
      aria-labelledby="preview-title"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <Halo
        size={680}
        top="-160px"
        right="-120px"
        opacity={0.18}
        variant="violet"
      />
      <Halo
        size={520}
        bottom="-200px"
        left="-100px"
        opacity={0.16}
        variant="coral"
      />

      <Container>
        <div id="preview-title">
          <SectionHeader
            eyebrow={p.eyebrow}
            title={p.title}
            description={p.description}
          />
        </div>

        <div className="relative mt-14">
          {/* Soft glow under card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-6 rounded-[40px] bg-[image:var(--signature-gradient-soft)] blur-3xl"
          />

          <div className="glass-strong relative overflow-hidden rounded-[28px]">
            <div aria-hidden className="grain-overlay" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-shimmer)] to-transparent"
            />

            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-border-subtle)] px-5 py-4 sm:px-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {p.mockRunBadge}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] px-3 py-1 font-mono text-[11px] text-[color:var(--color-text-primary)]">
                  <span className="h-1 w-1 rounded-full bg-aqua" />
                  {p.mockQueryChip}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[var(--glow-success-dot)]" />
                  {p.statusReady}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/70 px-3 py-1.5 text-[12px] text-[color:var(--color-text-primary)]">
                <Download size={13} strokeWidth={2} />
                <span className="font-medium">Excel</span>
                <span className="font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                  · 28 KB
                </span>
              </div>
            </div>

            {/* Main grid */}
            <div className="grid gap-px bg-[color:var(--color-border-subtle)] sm:grid-cols-5">
              {/* Skills bar chart */}
              <div className="bg-[color:var(--color-surface)]/40 p-5 sm:col-span-3 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3
                      size={15}
                      strokeWidth={1.75}
                      className="text-violet"
                    />
                    <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                      {p.chartTitle}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                    {p.chartHint}
                  </span>
                </div>
                <ul className="space-y-3">
                  {p.skills.map((s, i) => {
                    const w = (s.value / maxSkill) * 100;
                    return (
                      <li key={s.name} className="flex items-center gap-3">
                        <span className="w-6 text-right font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="w-24 truncate text-[13px] text-[color:var(--color-text-primary)]">
                          {s.name}
                        </span>
                        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--signature-gradient)] shadow-[var(--glow-bar-sm)]"
                            style={{ width: `${w}%` }}
                          />
                        </div>
                        <span className="w-11 text-right font-mono text-[12px] tabular-nums text-[color:var(--color-text-primary)]">
                          {s.value}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Phrases list */}
              <div className="bg-[color:var(--color-surface)]/40 p-5 sm:col-span-2 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Quote
                      size={15}
                      strokeWidth={1.75}
                      className="text-coral"
                    />
                    <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                      {p.phrasesTitle}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                    %
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {p.phrases.map((phrase, i) => {
                    const w = (phrase.value / maxPhrase) * 100;
                    return (
                      <li
                        key={phrase.text}
                        className="flex items-center justify-between gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-[color:var(--color-border-subtle)] hover:bg-[color:var(--color-surface-2)]/40"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          <span className="font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                          <div className="relative min-w-0 flex-1">
                            <span
                              aria-hidden
                              className="absolute -inset-y-1 left-0 -z-10 rounded-md bg-[image:var(--signature-gradient-soft)]"
                              style={{ width: `${w}%` }}
                            />
                            <span className="relative truncate text-[13px] text-[color:var(--color-text-primary)]">
                              «{phrase.text}»
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-[12px] tabular-nums text-[color:var(--color-text-muted)]">
                          {phrase.value}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Bottom strip: quality + dedup */}
            <div className="grid gap-px border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-border-subtle)] sm:grid-cols-2">
              <div className="bg-[color:var(--color-surface)]/40 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck
                    size={14}
                    strokeWidth={1.75}
                    className="text-violet"
                  />
                  <h3 className="text-[13px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                    {p.qualityTitle}
                  </h3>
                </div>
                <ul className="grid grid-cols-3 gap-3">
                  {p.qualityMetrics.map((q) => (
                    <li
                      key={q.label}
                      className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/40 p-3"
                    >
                      <span className="font-mono text-[16px] font-semibold leading-none text-[color:var(--color-text-primary)]">
                        {q.value}
                      </span>
                      <span className="mt-1.5 block text-[11px] text-[color:var(--color-text-muted)]">
                        {q.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[color:var(--color-surface)]/40 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Layers
                    size={14}
                    strokeWidth={1.75}
                    className="text-coral"
                  />
                  <h3 className="text-[13px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                    {p.dedupTitle}
                  </h3>
                </div>
                <div className="flex h-[calc(100%-2rem)] items-center">
                  <span className="font-mono text-[14px] tracking-tight text-[color:var(--color-text-primary)]">
                    {p.dedupLine.split(" → ").map((part, i, arr) => (
                      <span key={part}>
                        <span className="text-[color:var(--color-text-primary)]">
                          {part}
                        </span>
                        {i < arr.length - 1 ? (
                          <span className="mx-2 text-coral">→</span>
                        ) : null}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
