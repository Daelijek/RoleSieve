"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Halo } from "@/components/ui/Halo";
import { cn } from "@/lib/cn";
import { getDict } from "@/lib/i18n";

const dict = getDict();

type Preset = (typeof dict.tryIt.presets)[keyof typeof dict.tryIt.presets];

type Phase = "idle" | "running" | "result";

const RUN_MS = 2200;
const PROGRESS_TICK_MS = 60;

function pickPreset(query: string): Preset {
  const q = query.toLowerCase();
  const presets = dict.tryIt.presets;
  if (q.includes("front") || q.includes("react") || q.includes("js")) {
    return presets.frontend;
  }
  if (q.includes("product") || q.includes("пм") || q.includes("продакт")) {
    return presets.product;
  }
  if (
    q.includes("devops") ||
    q.includes("sre") ||
    q.includes("инфра") ||
    q.includes("kubernetes")
  ) {
    return presets.devops;
  }
  if (q.includes("data") || q.includes("анал") || q.includes("аналит")) {
    return presets.analyst;
  }
  return presets.python;
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
        {label}
      </span>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] transition-colors duration-[var(--duration-fast)]",
                active
                  ? "border-violet/50 bg-[color:var(--color-violet)]/15 text-[color:var(--color-text-primary)]"
                  : "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/60 text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text-primary)]",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TryItNow() {
  const t = dict.tryIt;
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>(t.regions[0]);
  const [exp, setExp] = useState<string>(t.experiences[2]);
  const [period, setPeriod] = useState<string>(t.periods[1]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [preset, setPreset] = useState<Preset | null>(null);
  const reduce = useReducedMotion();
  const tickRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    },
    [],
  );

  const ease = (x: number) => 1 - Math.pow(1 - x, 3);

  const run = () => {
    const chosen = pickPreset(query || "python");
    setPreset(chosen);
    setProgress(0);

    if (reduce) {
      setPhase("result");
      setProgress(100);
      return;
    }

    setPhase("running");
    const start = performance.now();
    tickRef.current = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / RUN_MS, 1);
      setProgress(Math.round(ease(p) * 100));
      if (p >= 1) {
        if (tickRef.current) window.clearInterval(tickRef.current);
        tickRef.current = null;
        window.setTimeout(() => setPhase("result"), 220);
      }
    }, PROGRESS_TICK_MS);
  };

  const reset = () => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = null;
    setPhase("idle");
    setProgress(0);
    setPreset(null);
  };

  const showProgress = phase === "running";
  const showResult = phase === "result" && preset;

  const chipQuery = useMemo(
    () =>
      [
        (query || preset?.title || "Python Developer").trim(),
        region,
        exp,
        period,
      ].join(" · "),
    [query, region, exp, period, preset],
  );

  return (
    <section
      id="try"
      aria-labelledby="try-title"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <Halo
        size={720}
        top="-160px"
        right="-100px"
        opacity={0.22}
        variant="violet"
      />
      <Halo
        size={520}
        bottom="-180px"
        left="-120px"
        opacity={0.18}
        variant="coral"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="eyebrow" className="justify-center">
            {t.eyebrow}
          </Badge>
          <h2
            id="try-title"
            className="mt-4 text-balance text-[clamp(1.875rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)]"
          >
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[16px] leading-[1.6] text-[color:var(--color-text-muted)]">
            {t.description}
          </p>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -bottom-6 -top-3 rounded-[36px] bg-[image:var(--signature-gradient-soft)] blur-3xl"
          />

          <div className="glass-strong relative overflow-hidden rounded-[28px]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-shimmer)] to-transparent"
            />

            <div className="grid gap-px bg-[color:var(--color-border-subtle)] lg:grid-cols-5">
              {/* Form column */}
              <div className="bg-[color:var(--color-surface)]/50 p-6 sm:p-8 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <Search size={14} strokeWidth={1.75} className="text-violet" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                    параметры запроса
                  </span>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="try-query"
                    className="block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]"
                  >
                    запрос
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="try-query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.placeholder}
                      disabled={phase === "running"}
                      className="w-full rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-canvas)]/70 px-4 py-3 pr-10 text-[15px] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-subtle)] outline-none transition-colors focus:border-violet/50 focus:bg-[color:var(--color-canvas)]/90 disabled:opacity-60"
                      autoComplete="off"
                    />
                    <Sparkles
                      aria-hidden
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-subtle)]"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <ChipGroup
                    label={t.regionLabel}
                    options={t.regions}
                    value={region}
                    onChange={setRegion}
                  />
                  <ChipGroup
                    label={t.expLabel}
                    options={t.experiences}
                    value={exp}
                    onChange={setExp}
                  />
                  <ChipGroup
                    label={t.periodLabel}
                    options={t.periods}
                    value={period}
                    onChange={setPeriod}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {phase !== "result" ? (
                    <Button
                      onClick={run}
                      size="md"
                      leading={
                        phase === "running" ? (
                          <Loader2
                            size={14}
                            strokeWidth={2}
                            className="animate-spin"
                          />
                        ) : (
                          <Play size={13} strokeWidth={2.25} />
                        )
                      }
                      disabled={phase === "running"}
                    >
                      {phase === "running" ? t.runningLabel : t.submit}
                    </Button>
                  ) : (
                    <Button
                      onClick={reset}
                      size="md"
                      variant="outline"
                      leading={<RotateCcw size={13} strokeWidth={2} />}
                    >
                      {t.restart}
                    </Button>
                  )}
                  <a
                    href="/analyze"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-primary)]"
                  >
                    {t.fullLink}
                    <ExternalLink size={12} strokeWidth={2} />
                  </a>
                </div>
                <p className="mt-4 text-[12px] leading-[1.5] text-[color:var(--color-text-subtle)]">
                  {t.note}
                </p>
              </div>

              {/* Result column */}
              <div className="bg-[color:var(--color-surface)]/30 p-6 sm:p-8 lg:col-span-3">
                {/* Header */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                      {t.resultLabel}
                    </span>
                    {phase !== "idle" ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] px-3 py-1 font-mono text-[11px] text-[color:var(--color-text-primary)]">
                        <span className="h-1 w-1 rounded-full bg-aqua" />
                        {chipQuery}
                      </span>
                    ) : null}
                  </div>
                  {phase === "result" && preset ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[var(--glow-success-dot)]" />
                      выборка · {preset.sample} вакансий
                    </span>
                  ) : null}
                </div>

                <div className="relative min-h-[280px] rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/40 p-5">
                  <AnimatePresence mode="wait">
                    {phase === "idle" ? (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-center"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-violet">
                          <Play size={18} strokeWidth={1.75} />
                        </span>
                        <p className="max-w-xs text-[13.5px] leading-[1.5] text-[color:var(--color-text-muted)]">
                          {t.emptyHint}
                        </p>
                      </motion.div>
                    ) : null}

                    {showProgress ? (
                      <motion.div
                        key="running"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full min-h-[240px] flex-col items-stretch justify-center gap-4"
                      >
                        <div className="flex items-center justify-between text-[12px] text-[color:var(--color-text-muted)]">
                          <span className="inline-flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
                            </span>
                            {t.runningLabel}…
                          </span>
                          <span className="font-mono tabular-nums">
                            {progress}%
                          </span>
                        </div>
                        <div className="relative h-1.5 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--signature-gradient)] shadow-[var(--glow-bar-md)] transition-[width] duration-[120ms] ease-out"
                            style={{ width: `${progress}%` }}
                          />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[color:var(--color-shimmer)] to-transparent"
                            style={{
                              animation:
                                "shimmer-x 1.6s var(--ease-premium) infinite",
                            }}
                          />
                        </div>
                        <ul className="mt-4 grid grid-cols-3 gap-3 text-[12px] text-[color:var(--color-text-subtle)]">
                          <li
                            className={cn(
                              "rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 px-3 py-2 transition-colors",
                              progress > 20
                                ? "border-violet/40 text-[color:var(--color-text-primary)]"
                                : "",
                            )}
                          >
                            запрос отправлен
                          </li>
                          <li
                            className={cn(
                              "rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 px-3 py-2 transition-colors",
                              progress > 55
                                ? "border-violet/40 text-[color:var(--color-text-primary)]"
                                : "",
                            )}
                          >
                            сбор вакансий
                          </li>
                          <li
                            className={cn(
                              "rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/40 px-3 py-2 transition-colors",
                              progress > 85
                                ? "border-violet/40 text-[color:var(--color-text-primary)]"
                                : "",
                            )}
                          >
                            извлечение сигналов
                          </li>
                        </ul>
                      </motion.div>
                    ) : null}

                    {showResult && preset ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid gap-5 sm:grid-cols-5"
                      >
                        <div className="sm:col-span-3">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-[12.5px] font-medium text-[color:var(--color-text-primary)]">
                              Топ навыков
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                              % упоминаний
                            </span>
                          </div>
                          <ul className="space-y-2.5">
                            {preset.skills.map((s, i) => (
                              <motion.li
                                key={s.name}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.07, duration: 0.4 }}
                                className="flex items-center gap-3"
                              >
                                <span className="w-24 truncate text-[12.5px] text-[color:var(--color-text-muted)]">
                                  {s.name}
                                </span>
                                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
                                  <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--signature-gradient)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${s.value}%` }}
                                    transition={{
                                      delay: i * 0.07 + 0.1,
                                      duration: 0.7,
                                      ease: [0.2, 0.8, 0.2, 1],
                                    }}
                                  />
                                </div>
                                <span className="w-9 text-right font-mono text-[11px] tabular-nums text-[color:var(--color-text-primary)]">
                                  {s.value}%
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-[12.5px] font-medium text-[color:var(--color-text-primary)]">
                              Топ фраз
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                              top 4
                            </span>
                          </div>
                          <ul className="flex flex-wrap gap-1.5">
                            {preset.phrases.map((p, i) => (
                              <motion.li
                                key={p}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: 0.3 + i * 0.06,
                                  duration: 0.4,
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/80 px-2.5 py-1 text-[12px] text-[color:var(--color-text-primary)]"
                              >
                                <span className="h-1 w-1 rounded-full bg-coral" />
                                {p}
                              </motion.li>
                            ))}
                          </ul>
                          <a
                            href="/analyze"
                            className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-violet transition-colors hover:text-violet-soft"
                          >
                            Запустить полный прогон
                            <ArrowRight size={12} strokeWidth={2} />
                          </a>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
