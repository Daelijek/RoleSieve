"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Inbox, DownloadCloud, Sparkles, FileSpreadsheet, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";
import { usePinnedScrollSteps } from "@/lib/hooks/usePinnedScrollSteps";

const stepIcons = [Inbox, DownloadCloud, Sparkles, FileSpreadsheet];

/** Scroll space allocated to each step, in vh. Lower = faster cycling. */
const PER_STEP_VH = 38;
/** Extra trailing vh so the last step gets time to settle before unpin. */
const TRAILING_VH = 25;

export function HowItWorks() {
  const dict = useDict();
  const h = dict.how;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeIdx, runwayHeightVh } = usePinnedScrollSteps(scrollRef, {
    count: h.steps.length,
    perStepVh: PER_STEP_VH,
    trailingVh: TRAILING_VH,
  });

  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="relative py-20 sm:py-28"
    >
      {/* Outer div = scroll runway. Inner sticky element keeps the
          stepper visible during the runway, but its height is content-driven
          (not h-screen), so the user can see surrounding sections too. */}
      <div
        ref={scrollRef}
        style={{ height: `${runwayHeightVh}vh` }}
        className="relative"
      >
        <div className="sticky top-[12vh] sm:top-[15vh]">
          <Container className="w-full">
            <div id="how-title" className="mb-8 lg:mb-10">
              <SectionHeader eyebrow={h.eyebrow} title={h.title} />
            </div>

            <div className="grid items-center gap-6 lg:grid-cols-[260px_1fr] lg:gap-14 xl:gap-20">
              {/* ── Left: step list ── */}
              <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {h.steps.map((step, i) => {
                  const active = i === activeIdx;
                  const past = i < activeIdx;
                  return (
                    <li key={step.number} className="flex-shrink-0 lg:flex-shrink">
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-500",
                          active
                            ? "bg-[color:var(--color-surface-2)] shadow-[0_0_0_1px_rgb(var(--rgb-violet)/0.22)]"
                            : past
                              ? "opacity-40"
                              : "opacity-25",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold transition-all duration-500",
                            active
                              ? "bg-[color:var(--color-violet)]/20 text-violet shadow-[0_0_12px_rgb(var(--rgb-violet)/0.5)]"
                              : past
                                ? "bg-[color:var(--color-violet)]/10 text-violet/60"
                                : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-subtle)]",
                          )}
                        >
                          {past ? <Check size={11} strokeWidth={2.5} /> : step.number}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors duration-500",
                            active
                              ? "text-[color:var(--color-text-primary)]"
                              : "text-[color:var(--color-text-muted)]",
                          )}
                        >
                          {step.title}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* ── Right: animated step card ── */}
              <div className="relative h-[240px] sm:h-[230px] lg:h-[260px]">
                {h.steps.map((step, i) => {
                  const Icon = stepIcons[i];
                  const active = i === activeIdx;
                  const past = i < activeIdx;
                  return (
                    <motion.div
                      key={step.number}
                      className="glass absolute inset-0 rounded-3xl p-6 sm:p-7 lg:p-9"
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                        y: active ? 0 : past ? -18 : 18,
                        scale: active ? 1 : 0.97,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      style={{ pointerEvents: active ? "auto" : "none" }}
                    >
                      <div className="flex items-start gap-5">
                        <motion.div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-violet/30 bg-[color:var(--color-violet)]/12 text-violet"
                          animate={
                            active
                              ? {
                                  boxShadow: [
                                    "0 0 0px rgb(var(--rgb-violet) / 0)",
                                    "0 0 22px rgb(var(--rgb-violet) / 0.5)",
                                    "0 0 12px rgb(var(--rgb-violet) / 0.35)",
                                  ],
                                }
                              : { boxShadow: "0 0 0px rgb(var(--rgb-violet) / 0)" }
                          }
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <Icon size={22} strokeWidth={1.5} />
                        </motion.div>

                        <div>
                          <p className="text-gradient font-mono text-[12px] font-semibold tracking-widest uppercase">
                            {h.stepLabel.replace("{number}", step.number)}
                          </p>
                          <h3 className="mt-1 text-[19px] font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-[22px]">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-5 text-[14px] leading-[1.7] text-[color:var(--color-text-muted)] sm:text-[15px]">
                        {step.description}
                      </p>

                      <div className="mt-6 flex items-center gap-1.5">
                        {h.steps.map((_, j) => (
                          <motion.div
                            key={j}
                            className="h-1 rounded-full bg-violet"
                            animate={{
                              width: j === activeIdx ? 24 : 6,
                              opacity: j <= activeIdx ? 1 : 0.2,
                            }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
