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
      className="space-y-4"
    >
      {/* Search input */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"
      >
        <Search size={16} className="flex-shrink-0 text-[rgb(139,108,255)]" />
        <span className="font-mono text-[14px] text-white/90">
          Python Developer
        </span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-[rgb(139,108,255)]"
        >
          ▎
        </motion.span>
      </motion.div>

      {/* Param tags */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {["Москва", "От 1 до 3 лет", "За 30 дней"].map((t) => (
          <motion.span
            key={t}
            variants={fadeUp}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 font-mono text-[12px] text-white/55"
          >
            {t}
          </motion.span>
        ))}
      </motion.div>

      {/* API call */}
      <motion.div
        variants={fadeUp}
        className="rounded-xl border border-[rgba(139,108,255,0.2)] bg-[rgba(139,108,255,0.06)] p-4"
      >
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="font-bold text-[rgb(139,108,255)]">GET</span>
          <span className="truncate text-white/40">
            /vacancies?text=Python+Developer&amp;area=1&amp;experience=between1And3
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
          />
          <span className="font-mono text-[10px] text-emerald-400/80">
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
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">
          Вакансий собрано
        </p>
        <p className="mt-1 font-mono text-[46px] font-bold leading-none tracking-tight text-white/90">
          120
          <span className="ml-1 text-[18px] text-white/30">/ 120</span>
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={fadeUp}>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[rgb(139,108,255)] via-fuchsia-500 to-[rgb(0,210,211)]"
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
            cls: "border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-400/90",
          },
          {
            icon: <Check size={13} />,
            text: "0 ошибок",
            cls: "border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-400/90",
          },
          {
            icon: <Zap size={13} />,
            text: "28 сек",
            cls: "border-[rgba(0,210,211,0.25)] bg-[rgba(0,210,211,0.06)] text-[rgba(0,210,211,0.9)]",
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
        className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/25"
      >
        Топ ключевых навыков · 120 вакансий
      </motion.p>

      {SKILLS.map((skill, i) => (
        <motion.div key={skill.name} variants={fadeUp}>
          <div className="mb-1.5 flex justify-between font-mono text-[12px]">
            <span className="text-white/75">{skill.name}</span>
            <span
              className="font-bold"
              style={{ color: `rgb(${skill.rgb})` }}
            >
              {skill.pct}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
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
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] italic text-white/35"
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
        className="relative w-full max-w-sm rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.08] to-emerald-500/[0.02] p-6 sm:p-7"
        animate={{
          rotateY: [0, 1.5, 0, -1.5, 0],
          rotateX: [0, 0.8, 0, -0.8, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          boxShadow:
            "0 0 50px -10px rgba(16,185,129,0.25), 0 24px 60px -12px rgba(0,0,0,0.5)",
        }}
      >
        {/* File header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 font-mono text-[16px] font-bold text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
            XLS
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white/90">
              RoleSieve_Export.xlsx
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-white/35">
              4 листа · 120 вакансий · 847 KB
            </p>
          </div>
        </div>

        {/* Mini stats */}
        <motion.div
          variants={fadeUp}
          className="mt-5 grid grid-cols-3 gap-2.5"
        >
          {[
            { v: "42", l: "Навыков" },
            { v: "18", l: "Фраз" },
            { v: "89%", l: "Покрытие" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-xl bg-white/[0.04] p-3 text-center"
            >
              <p className="font-mono text-[20px] font-bold text-emerald-400">
                {s.v}
              </p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-white/25">
                {s.l}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Ready badge */}
        <motion.div
          variants={fadeUp}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] py-2.5"
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Check size={14} className="text-emerald-400" />
          </motion.div>
          <span className="font-mono text-[12px] font-medium text-emerald-400">
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
      v < 0.03 ? 0 : v < 0.28 ? 0 : v < 0.53 ? 1 : v < 0.78 ? 2 : 3;
    if (next !== phase) setPhase(next);
  });

  const currentStep = h.steps[phase] || h.steps[0];
  const currentColor = PHASE_COLORS[phase] || PHASE_COLORS[0];

  /* ── Scroll-driven motion values (GPU-only, zero re-renders) ── */
  const glowBg = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.45, 0.55, 0.7, 0.8, 1],
    [
      "rgba(139,108,255,0.12)",
      "rgba(139,108,255,0.12)",
      "rgba(0,210,211,0.12)",
      "rgba(0,210,211,0.12)",
      "rgba(255,106,90,0.12)",
      "rgba(255,106,90,0.12)",
      "rgba(16,185,129,0.12)",
      "rgba(16,185,129,0.12)",
    ],
  );

  const borderGlow = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.45, 0.55, 0.7, 0.8, 1],
    [
      "rgba(139,108,255,0.22)",
      "rgba(139,108,255,0.22)",
      "rgba(0,210,211,0.22)",
      "rgba(0,210,211,0.22)",
      "rgba(255,106,90,0.22)",
      "rgba(255,106,90,0.22)",
      "rgba(16,185,129,0.22)",
      "rgba(16,185,129,0.22)",
    ],
  );

  const chamberShadow = useTransform(
    borderGlow,
    (v: string) =>
      `inset 0 0 0 1px ${v}, 0 0 50px -8px ${v}, 0 40px 100px -20px rgba(0,0,0,0.7)`,
  );

  const topShimmer = useTransform(
    borderGlow,
    (v: string) => `linear-gradient(90deg, transparent, ${v}, transparent)`,
  );

  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="relative"
    >
      <div
        ref={scrollRef}
        style={{ height: `${RUNWAY_VH}vh` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
          {/* ── Background ambient glow ── */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ backgroundColor: glowBg }}
          />

          <Container className="w-full">
            <div
              id="how-title"
              className="mb-10 text-center lg:text-left"
            >
              <SectionHeader
                eyebrow={h.eyebrow}
                title={h.title}
              />
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[300px_1fr] lg:gap-14 xl:gap-18">
              {/* ── Left: phase info + step navigator ── */}
              <div className="flex flex-col gap-6">
                {/* Active Step Content */}
                <div className="relative min-h-[160px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={phase}
                      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                      transition={{
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                    >
                      <span
                        className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                        style={{ color: `rgb(${currentColor.rgb})` }}
                      >
                        {currentStep.number} — {h.stepLabel.replace("{number}", currentStep.number)}
                      </span>
                      <h3 className="mt-2 text-[22px] font-bold tracking-tight text-[color:var(--color-text-primary)] sm:text-[26px]">
                        {currentStep.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-text-muted)]">
                        {currentStep.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Step List navigation */}
                <div className="flex flex-col gap-2">
                  {h.steps.map((step, i) => {
                    const active = i === phase;
                    const past = i < phase;
                    const col = PHASE_COLORS[i];
                    return (
                      <div
                        key={step.number}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-300 ${
                          active
                            ? "border border-white/10 bg-white/[0.04] text-[color:var(--color-text-primary)] shadow-sm"
                            : past
                              ? "text-[color:var(--color-text-muted)] opacity-60"
                              : "text-[color:var(--color-text-subtle)] opacity-35"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[11px] font-bold transition-colors ${
                            active
                              ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                              : "text-white/40"
                          }`}
                          style={{
                            backgroundColor: active ? `rgb(${col.rgb})` : "rgba(255,255,255,0.06)",
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
                <motion.div
                  className="relative w-full overflow-hidden rounded-[24px] bg-[#080810]"
                  style={{ boxShadow: chamberShadow }}
                >
                  {/* Laser scan on phase change */}
                  <AnimatePresence mode="popLayout">
                    <ScanLine key={phase} rgb={currentColor.rgb} />
                  </AnimatePresence>

                  {/* Top shimmer edge */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
                    style={{ background: topShimmer }}
                  />

                  {/* Dot grid background */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.025]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />

                  {/* Phase content */}
                  <div className="relative flex min-h-[370px] items-center p-7 sm:p-8">
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
                  <div className="flex items-center justify-between border-t border-white/[0.05] px-5 py-2.5">
                    <span className="font-mono text-[10px] text-white/20">
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
                        <div className="h-2 w-2 rounded-full bg-[#ff5f57]/50" />
                        <div className="h-2 w-2 rounded-full bg-[#febc2e]/50" />
                        <div className="h-2 w-2 rounded-full bg-[#28c840]/50" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
