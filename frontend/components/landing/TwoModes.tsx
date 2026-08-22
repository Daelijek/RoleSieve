"use client";

import { ClipboardList, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Spotlight } from "@/components/ui/Spotlight";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";

const cardClasses =
  "group relative overflow-hidden rounded-3xl p-5 sm:p-8 lg:p-9 bg-neutral-300/20 hover:bg-neutral-300/30 dark:bg-neutral-400/20 dark:hover:bg-neutral-400/30 backdrop-blur-[1px] border border-neutral-400/20 transition-all duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:shadow-xl";

export function TwoModes() {
  const dict = useDict();
  const m = dict.modes;
  return (
    <section
      id="modes"
      aria-labelledby="modes-title"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <div id="modes-title">
          <SectionHeader
            eyebrow={m.eyebrow}
            title={m.title}
            description={m.subtitle}
          />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Manual mode */}
          <Spotlight tint="violet" size={500} className={cardClasses}>
            {/* Top specular reflection glint */}
            <div aria-hidden className="hairline-specular" />

            {/* Fluid ambient liquid aura */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[image:var(--wash-violet)] blur-3xl transition-transform duration-700 ease-out group-hover:scale-125 group-hover:opacity-100"
            />

            <div className="relative flex items-start gap-3.5 sm:gap-4">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/90 text-violet shadow-sm sm:h-11 sm:w-11">
                <ClipboardList size={18} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  01 · {m.manual.label}
                </span>
                <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-[20px]">
                  {m.manual.tagline}
                </h3>
              </div>
            </div>
            <p className="relative mt-3.5 text-[14px] leading-[1.6] text-[color:var(--color-text-muted)] sm:mt-4 sm:text-[15px]">
              {m.manual.hint}
            </p>

            <div className="relative mt-5 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/80 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] sm:mt-6">
              <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {m.manual.mockTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {m.manual.mockLines.length}{" "}
                  <span className="text-[color:var(--color-text-subtle)]">
                    {m.manual.vacanciesLabel}
                  </span>
                </span>
              </div>
              <ul className="divide-y divide-[color:var(--color-border-subtle)] font-mono text-[12px] sm:text-[12.5px]">
                {m.manual.mockLines.map((line, i) => (
                  <li
                    key={line}
                    className="flex items-center gap-3 px-4 py-2.5 text-[color:var(--color-text-primary)]"
                  >
                    <span className="w-5 text-right text-[color:var(--color-text-subtle)]">
                      {i + 1}
                    </span>
                    <span className="truncate">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Spotlight>

          {/* Auto mode */}
          <Spotlight tint="coral" size={500} className={cardClasses}>
            {/* Top specular reflection glint */}
            <div aria-hidden className="hairline-specular" />

            {/* Fluid ambient liquid aura */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[image:var(--wash-coral)] blur-3xl transition-transform duration-700 ease-out group-hover:scale-125 group-hover:opacity-100"
            />

            <div className="relative flex items-start gap-3.5 sm:gap-4">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/90 text-coral shadow-sm sm:h-11 sm:w-11">
                <SlidersHorizontal size={18} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  02 · {m.auto.label}
                </span>
                <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-[20px]">
                  {m.auto.tagline}
                </h3>
              </div>
            </div>
            <p className="relative mt-3.5 text-[14px] leading-[1.6] text-[color:var(--color-text-muted)] sm:mt-4 sm:text-[15px]">
              {m.auto.hint}
            </p>

            <div className="relative mt-5 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/80 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] sm:mt-6">
              <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {m.auto.mockTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
                  HH search API
                </span>
              </div>
              <dl className="grid grid-cols-1 gap-px bg-[color:var(--color-border-subtle)] sm:grid-cols-2">
                {m.auto.fields.map((f) => (
                  <div
                    key={f.label}
                    className="bg-[color:var(--color-surface)]/60 p-3.5 backdrop-blur-sm transition-colors hover:bg-[color:var(--color-surface)]/85 sm:p-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-[13.5px] font-medium text-[color:var(--color-text-primary)] sm:mt-1.5 sm:text-[14px]">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Spotlight>
        </div>
      </Container>
    </section>
  );
}
