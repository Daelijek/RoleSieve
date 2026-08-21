"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Search, Check, Zap, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/* ══════════════════════════════════════════════════════
   Constants & Data
   ══════════════════════════════════════════════════════ */

const PHASE_COLORS = [
  { rgb: "139, 108, 255", label: "01" }, // Violet
  { rgb: "0, 210, 211", label: "02" },   // Aqua
  { rgb: "255, 106, 90", label: "03" },  // Coral
  { rgb: "16, 185, 129", label: "04" },  // Emerald
] as const;

const SKILLS = [
  { name: "Python", pct: 84, rgb: "139, 108, 255" },
  { name: "FastAPI / Django", pct: 68, rgb: "255, 106, 90" },
  { name: "Docker", pct: 58, rgb: "0, 210, 211" },
  { name: "PostgreSQL", pct: 47, rgb: "168, 139, 250" },
];

/** Total scroll runway height — 4 phases × 70vh each. */
const RUNWAY_VH = 280;

/* ══════════════════════════════════════════════════════
   Animation Variants
   ══════════════════════════════════════════════════════ */

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 as const } },
};

const fadeUp = {
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(3px)",
    transition: { duration: 0.2 },
  },
};

/** Query exits — elements scatter outward */
const queryWrap = {
  ...stagger,
  exit: {
    scale: 1.08,
    opacity: 0,
    filter: "blur(10px)",
    transition: { duration: 0.35 },
  },
};

/** Collect enters from implosion, exits by squeezing down */
const collectWrap = {
  initial: { scale: 0.8, opacity: 0, filter: "blur(10px)" },
  animate: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
  exit: {
    scaleY: 0.6,
    opacity: 0,
    filter: "blur(8px)",
    transition: { duration: 0.3 },
  },
};

/** Signals enters by vertical stretch, exits by compressing */
const signalsWrap = {
  initial: { scaleY: 0.4, opacity: 0, filter: "blur(8px)" },
  animate: {
    scaleY: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
  exit: {
    scale: 0.75,
    opacity: 0,
    filter: "blur(10px)",
    transition: { duration: 0.3 },
  },
};

/** Result enters by rising from below with 3D tilt */
const resultWrap = {
  initial: { y: 50, opacity: 0, rotateX: -12, filter: "blur(10px)" },
  animate: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.18,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/* ══════════════════════════════════════════════════════
   Laser Scan Line
   ══════════════════════════════════════════════════════ */

function ScanLine({ rgb }: { rgb: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-30 h-[2px]"
      style={{
        background: `linear-gradient(90deg, transparent 0%, rgba(${rgb},0.85) 25%, rgba(${rgb},1) 50%, rgba(${rgb},0.85) 75%, transparent 100%)`,
        boxShadow: `0 0 24px 4px rgba(${rgb},0.5), 0 0 80px 8px rgba(${rgb},0.15)`,
      }}
      initial={{ top: "-2%", opacity: 0 }}
      animate={{ top: "102%", opacity: [0, 1, 1, 0.6, 0] }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   Phase 0 — Query Formation
   ══════════════════════════════════════════════════════ */

function QueryPhase() {
  return (
    <motion.div
      variants={queryWrap}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-2.5 sm:space-y-3.5"
    >
      {/* Search input */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2.5 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/70 px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
      >
        <Search size={15} className="flex-shrink-0 text-violet" />
        <span className="font-mono text-[13px] text-[color:var(--color-text-primary)] sm:text-[14px]">
          Python Developer
        </span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-violet"
        >
          ▎
        </motion.span>
      </motion.div>

      {/* Param tags */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5 sm:gap-2">
        {["Москва", "От 1 до 3 лет", "За 30 дней"].map((t) => (
          <motion.span
            key={t}
            variants={fadeUp}
            className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 px-2.5 py-1 font-mono text-[11px] text-[color:var(--color-text-muted)] sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-[12px]"
          >
            {t}
          </motion.span>
        ))}
      </motion.div>

      {/* API call */}
      <motion.div
        variants={fadeUp}
        className="rounded-xl border border-violet/30 bg-violet/10 p-2.5 sm:p-3.5"
      >
        <div className="flex items-center gap-2 font-mono text-[10.5px] sm:text-[11px]">
          <span className="font-bold text-violet">GET</span>
          <span className="truncate text-[color:var(--color-text-muted)]">
            /vacancies?text=Python+Developer&amp;area=1&amp;experience=between1And3
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 sm:mt-2">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
          />
          <span className="font-mono text-[9.5px] text-emerald-500 sm:text-[10px]">
            HH API Connected · Ready
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Phase 1 — Data Collection
   ══════════════════════════════════════════════════════ */

function CollectPhase() {
  return (
    <motion.div
      variants={collectWrap}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-5"
    >
      {/* Counter */}
      <motion.div variants={fadeUp} className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          Вакансий собрано
        </p>
        <p className="mt-1 font-mono text-[46px] font-bold leading-none tracking-tight text-[color:var(--color-text-primary)]">
          120
          <span className="ml-1 text-[18px] text-[color:var(--color-text-subtle)]">/ 120</span>
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={fadeUp}>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet via-fuchsia-500 to-aqua"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.6,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            style={{
              boxShadow:
                "0 0 20px rgba(0,210,211,0.5), 0 0 50px rgba(0,210,211,0.15)",
            }}
          />
        </div>
      </motion.div>

      {/* Status badges */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center gap-2.5"
      >
        {[
          {
            icon: <ShieldCheck size={13} />,
            text: "Лимиты HH соблюдены",
            cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-500",
          },
          {
            icon: <Check size={13} />,
            text: "0 ошибок",
            cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-500",
          },
          {
            icon: <Zap size={13} />,
            text: "28 сек",
            cls: "border-aqua/25 bg-aqua/10 text-aqua",
          },
        ].map((b) => (
          <motion.div
            key={b.text}
            variants={fadeUp}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[11px] ${b.cls}`}
          >
            {b.icon}
            {b.text}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Phase 2 — Signal Extraction
   ══════════════════════════════════════════════════════ */

function SignalsPhase() {
  return (
    <motion.div
      variants={signalsWrap}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-3.5"
    >
      <motion.p
        variants={fadeUp}
        className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]"
      >
        Топ ключевых навыков · 120 вакансий
      </motion.p>

      {SKILLS.map((skill, i) => (
        <motion.div key={skill.name} variants={fadeUp}>
          <div className="mb-1.5 flex justify-between font-mono text-[12px]">
            <span className="text-[color:var(--color-text-primary)]">{skill.name}</span>
            <span
              className="font-bold"
              style={{ color: `rgb(${skill.rgb})` }}
            >
              {skill.pct}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: `rgb(${skill.rgb})`,
                boxShadow: `0 0 16px rgba(${skill.rgb}, 0.5)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${skill.pct}%` }}
              transition={{
                duration: 1,
                delay: 0.3 + i * 0.12,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Frequency phrases */}
      <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
        {["опыт работы в команде", "знание SQL", "Docker / K8s"].map(
          (phrase) => (
            <span
              key={phrase}
              className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 px-3 py-1.5 font-mono text-[11px] italic text-[color:var(--color-text-muted)]"
            >
              &ldquo;{phrase}&rdquo;
            </span>
          ),
        )}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Phase 3 — Export Ready
   ══════════════════════════════════════════════════════ */

function ResultPhase() {
  return (
    <motion.div
      variants={resultWrap}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center [perspective:800px]"
    >
      {/* Floating 3D document */}
      <motion.div
        variants={fadeUp}
        className="relative w-full max-w-sm rounded-2xl border border-emerald-500/30 bg-[color:var(--color-surface)] p-4 sm:p-6 shadow-[var(--shadow-lift)]"
        animate={{
          rotateY: [0, 1.5, 0, -1.5, 0],
          rotateX: [0, 0.8, 0, -0.8, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* File header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 font-mono text-[13px] font-bold text-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.2)] sm:h-13 sm:w-13 sm:rounded-2xl sm:text-[15px]">
            XLS
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[color:var(--color-text-primary)] sm:text-[15px]">
              RoleSieve_Export.xlsx
            </p>
            <p className="mt-0.5 font-mono text-[10.5px] text-[color:var(--color-text-muted)] sm:text-[11px]">
              4 листа · 120 вакансий · 847 KB
            </p>
          </div>
        </div>

        {/* Mini stats */}
        <motion.div
          variants={fadeUp}
          className="mt-3.5 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2.5"
        >
          {[
            { v: "42", l: "Навыков" },
            { v: "18", l: "Фраз" },
            { v: "89%", l: "Покрытие" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 p-2 text-center sm:p-2.5"
            >
              <p className="font-mono text-[16px] font-bold text-emerald-500 sm:text-[19px]">
                {s.v}
              </p>
              <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-wider text-[color:var(--color-text-subtle)] sm:text-[9px]">
                {s.l}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Ready badge */}
        <motion.div
          variants={fadeUp}
          className="mt-3.5 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 sm:mt-4 sm:py-2.5"
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Check size={13} className="text-emerald-500" />
          </motion.div>
          <span className="font-mono text-[11px] font-medium text-emerald-500 sm:text-[12px]">
            Готово к адаптации резюме
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Main Component — HowItWorks
   ══════════════════════════════════════════════════════ */

export function HowItWorks() {
  const dict = useDict();
  const h = dict.how;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const [phase, setPhase] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next =
      v < 0.05 ? 0 : v < 0.28 ? 0 : v < 0.53 ? 1 : v < 0.78 ? 2 : 3;
    if (next !== phase) setPhase(next);
  });

  const currentStep = h.steps[phase] || h.steps[0];
  const currentColor = PHASE_COLORS[phase] || PHASE_COLORS[0];

  const glowBg = `rgba(${currentColor.rgb}, 0.12)`;
  const borderGlow = `rgba(${currentColor.rgb}, 0.25)`;
  const chamberShadow = `inset 0 0 0 1px ${borderGlow}, 0 0 40px -8px ${borderGlow}, 0 24px 60px -20px rgba(0,0,0,0.35)`;
  const topShimmer = `linear-gradient(90deg, transparent, ${borderGlow}, transparent)`;

  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="relative"
    >
      <div
        ref={scrollRef}
        className="relative h-[240vh] sm:h-[280vh]"
      >
        <div className="sticky top-12 flex h-[calc(100dvh-3rem)] w-full flex-col justify-center overflow-hidden sm:top-0 sm:h-screen">
          {/* ── Background ambient glow ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] transition-colors duration-500 sm:h-[500px] sm:w-[700px] sm:blur-[120px]"
            style={{ backgroundColor: glowBg }}
          />

          <Container className="w-full">
            <div
              id="how-title"
              className="mb-2 text-center sm:mb-8 lg:mb-10 lg:text-left"
            >
              <SectionHeader
                eyebrow={h.eyebrow}
                title={h.title}
              />
            </div>

            <div className="grid items-start gap-3 sm:gap-8 lg:grid-cols-[300px_1fr] lg:gap-14 xl:gap-18">
              {/* ── Left / Top on mobile: phase info + step navigator ── */}
              <div className="flex flex-col gap-2 sm:gap-6">
                {/* Mobile 4-step Segmented Stepper */}
                <div className="grid grid-cols-4 gap-1 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 p-1 lg:hidden">
                  {h.steps.map((step, i) => {
                    const active = i === phase;
                    const col = PHASE_COLORS[i];
                    return (
                      <button
                        type="button"
                        key={step.number}
                        onClick={() => setPhase(i)}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg py-1 px-0.5 text-center transition-all duration-200 active:scale-95",
                          active
                            ? "border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] shadow-sm"
                            : "opacity-60 hover:opacity-100",
                        )}
                      >
                        <span
                          className="font-mono text-[10px] font-bold leading-none"
                          style={{
                            color: active ? `rgb(${col.rgb})` : "var(--color-text-muted)",
                          }}
                        >
                          {step.number}
                        </span>
                        <span className="mt-0.5 truncate text-[10.5px] font-medium text-[color:var(--color-text-primary)]">
                          {step.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Content */}
                <div className="relative min-h-[50px] sm:min-h-[100px] lg:min-h-[160px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={phase}
                      initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                      transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                    >
                      <span
                        className="font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.25em]"
                        style={{ color: `rgb(${currentColor.rgb})` }}
                      >
                        {currentStep.number} — {h.stepLabel.replace("{number}", currentStep.number)}
                      </span>
                      <h3 className="mt-0.5 text-[15px] font-bold tracking-tight text-[color:var(--color-text-primary)] sm:mt-2 sm:text-[22px] lg:text-[26px]">
                        {currentStep.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] leading-snug text-[color:var(--color-text-muted)] sm:mt-2 sm:text-[14px]">
                        {currentStep.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Desktop Step List navigation */}
                <div className="hidden flex-col gap-2 lg:flex">
                  {h.steps.map((step, i) => {
                    const active = i === phase;
                    const past = i < phase;
                    const col = PHASE_COLORS[i];
                    return (
                      <div
                        key={step.number}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-300 ${
                          active
                            ? "border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)] shadow-sm"
                            : past
                              ? "text-[color:var(--color-text-muted)] opacity-70"
                              : "text-[color:var(--color-text-subtle)] opacity-40"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[11px] font-bold transition-colors ${
                            active
                              ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                              : "bg-[color:var(--color-surface-3)] text-[color:var(--color-text-muted)]"
                          }`}
                          style={{
                            backgroundColor: active ? `rgb(${col.rgb})` : undefined,
                          }}
                        >
                          {past ? <Check size={12} strokeWidth={2.5} /> : step.number}
                        </span>
                        <span className="text-[13px] font-medium">{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Right: the morphing pipeline chamber ── */}
              <div className="relative flex items-center justify-center">
                <div
                  className="glass-strong relative w-full overflow-hidden rounded-[18px] bg-[color:var(--color-surface)]/90 transition-all duration-500 sm:rounded-[24px]"
                  style={{ boxShadow: chamberShadow }}
                >
                  {/* Laser scan on phase change */}
                  <AnimatePresence mode="popLayout">
                    <ScanLine key={phase} rgb={currentColor.rgb} />
                  </AnimatePresence>

                  {/* Top shimmer edge */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px transition-all duration-500"
                    style={{ background: topShimmer }}
                  />

                  {/* Dot grid background */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />

                  {/* Phase content */}
                  <div className="relative flex min-h-[200px] items-center p-3 sm:min-h-[350px] sm:p-7">
                    <div className="w-full">
                      <AnimatePresence mode="wait">
                        {phase === 0 && <QueryPhase key="q" />}
                        {phase === 1 && <CollectPhase key="c" />}
                        {phase === 2 && <SignalsPhase key="s" />}
                        {phase === 3 && <ResultPhase key="r" />}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Bottom status bar */}
                  <div className="flex items-center justify-between border-t border-[color:var(--color-border-subtle)] px-5 py-2.5">
                    <span className="font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                      RoleSieve Pipeline Engine
                    </span>
                    <div className="flex items-center gap-3">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentStep.number}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.25 }}
                          className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: `rgb(${currentColor.rgb})` }}
                        >
                          STEP {currentStep.number} / 04
                        </motion.span>
                      </AnimatePresence>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
                        <div className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
                        <div className="h-2 w-2 rounded-full bg-[#28c840]/70" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
