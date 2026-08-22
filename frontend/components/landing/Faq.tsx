"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function Faq() {
  const dict = useDict();
  const f = dict.faq;
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();

  const toggle = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <div id="faq-title">
          <SectionHeader eyebrow={f.eyebrow} title={f.title} />
        </div>

        <ul className="mx-auto mt-12 max-w-3xl divide-y divide-neutral-400/20 rounded-2xl border border-neutral-400/20 bg-neutral-300/20 dark:bg-neutral-400/15 backdrop-blur-[1px] shadow-lg overflow-hidden">
          {f.items.map((item, idx) => {
            const isOpen = openIndices.has(idx);
            return (
              <li key={item.q} className="group/faq-item transition-colors duration-200">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left transition-all duration-200 sm:px-7 sm:py-6",
                    isOpen && "pb-3 sm:pb-3.5"
                  )}
                >
                  <span className="text-[15px] font-medium text-[color:var(--color-text-primary)] transition-colors duration-200 group-hover/faq-item:text-violet sm:text-[16px]">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)] transition-all duration-300 ease-out group-hover/faq-item:scale-105 group-hover/faq-item:border-violet/40 group-hover/faq-item:text-[color:var(--color-text-primary)]",
                      isOpen &&
                        "rotate-45 border-violet/60 bg-[color:var(--color-violet)]/15 text-violet shadow-[0_0_12px_rgba(139,108,255,0.25)] group-hover/faq-item:border-violet/80"
                    )}
                  >
                    <Plus size={14} strokeWidth={2} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      animate={
                        reduce
                          ? { opacity: 1 }
                          : { height: "auto", opacity: 1 }
                      }
                      exit={
                        reduce
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={{
                        height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0 text-[14.5px] leading-[1.65] text-[color:var(--color-text-muted)] sm:px-7 sm:pb-6">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
