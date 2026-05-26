"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";
import { Inbox, DownloadCloud, Sparkles, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { getDict } from "@/lib/i18n";

const dict = getDict();

const stepIcons = [Inbox, DownloadCloud, Sparkles, FileSpreadsheet];

export function HowItWorks() {
  const h = dict.how;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const horizontalLineScale = useTransform(smooth, [0, 1], [0, 1]);
  const verticalLineScale = useTransform(smooth, [0, 1], [0, 1]);

  const [activeIdx, setActiveIdx] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => {
    const i = Math.min(h.steps.length - 1, Math.floor(v * h.steps.length));
    setActiveIdx(i);
  });

  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <div id="how-title">
          <SectionHeader eyebrow={h.eyebrow} title={h.title} />
        </div>

        <div ref={ref} className="relative mt-14">
          {/* Connector — desktop: horizontal */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[44px] hidden h-px bg-[color:var(--color-border-subtle)] lg:block"
          >
            <motion.div
              className="absolute inset-y-0 left-0 origin-left bg-[var(--signature-gradient)] shadow-[0_0_10px_rgba(139,108,255,0.55)]"
              style={{ scaleX: horizontalLineScale, width: "100%" }}
            />
          </div>

          {/* Connector — mobile: vertical (left rail) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[28px] top-0 bottom-0 block w-px bg-[color:var(--color-border-subtle)] lg:hidden"
          >
            <motion.div
              className="absolute inset-x-0 top-0 origin-top bg-[var(--signature-gradient)] shadow-[0_0_10px_rgba(139,108,255,0.55)]"
              style={{ scaleY: verticalLineScale, height: "100%" }}
            />
          </div>

          <ol className="grid gap-5 lg:grid-cols-4">
            {h.steps.map((step, i) => {
              const Icon = stepIcons[i];
              const active = i <= activeIdx;
              return (
                <li
                  key={step.number}
                  className={cn(
                    "group relative glass rounded-2xl p-6 transition-[transform,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5",
                    active
                      ? "border-[color:var(--color-border-strong)] shadow-[0_0_0_1px_rgba(139,108,255,0.12),0_20px_50px_-20px_rgba(139,108,255,0.35)]"
                      : "hover:border-[color:var(--color-border-strong)]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-mono text-[28px] font-semibold leading-none tracking-tight transition-colors duration-[var(--duration-base)]",
                        active
                          ? "text-gradient"
                          : "text-[color:var(--color-text-subtle)]",
                      )}
                    >
                      {step.number}
                    </span>
                    <motion.span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-[var(--duration-base)]",
                        active
                          ? "border-violet/40 bg-[color:var(--color-violet)]/15 text-violet shadow-[0_0_18px_rgba(139,108,255,0.35)]"
                          : "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]",
                      )}
                      animate={
                        active && i === activeIdx
                          ? { scale: [1, 1.08, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Icon size={16} strokeWidth={1.75} />
                    </motion.span>
                  </div>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.55] text-[color:var(--color-text-muted)]">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
