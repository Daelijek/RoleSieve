"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  Activity,
  Globe2,
  Cpu,
  Target,
  Check,
  Zap,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";

/* ══════════════════════════════════════════════════════
   Constants & Metadata
   ══════════════════════════════════════════════════════ */

const STAT_CONFIGS = [
  {
    num: "01",
    tag: "VELOCITY MATRIX",
    rgb: "139, 108, 255", // Violet
    icon: Activity,
  },
  {
    num: "02",
    tag: "GEOSPATIAL HUBS",
    rgb: "255, 106, 90", // Coral
    icon: Globe2,
  },
  {
    num: "03",
    tag: "NLP KNOWLEDGE GRAPH",
    rgb: "0, 210, 211", // Aqua
    icon: Cpu,
  },
  {
    num: "04",
    tag: "CONFIDENCE GAUGE",
    rgb: "16, 185, 129", // Emerald
    icon: Target,
  },
] as const;

/** Total scroll runway height — 4 stats × 70vh each. */
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
   Scene 01: Velocity Matrix (5230+ Runs Sparkline)
   ══════════════════════════════════════════════════════ */

function VelocityScene() {
  const points = [14, 22, 28, 24, 38, 45, 42, 58, 64, 76, 84, 96];
  const W = 460;
  const H = 95;
  const padX = 10;
  const padY = 12;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = innerW / (points.length - 1);
  const pts = points.map((v, i) => ({
    x: padX + i * step,
    y: padY + innerH - ((v - min) / range) * innerH,
  }));
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  const areaD = `${lineD} L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="flex items-baseline justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            Активность запусков
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-[44px] font-bold leading-none tracking-tight text-[color:var(--color-text-primary)]">
              5 230
            </span>
            <span className="font-mono text-[22px] font-bold text-violet">
              +
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 font-mono text-[11px] text-violet">
          <TrendingUp size={12} />
          <span>+24% MoM</span>
        </div>
      </motion.div>

      {/* SVG Waveform Sparkline */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 p-3"
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
          <defs>
            <linearGradient id="vel-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(139,108,255)" />
              <stop offset="100%" stopColor="rgb(0,210,211)" />
            </linearGradient>
            <linearGradient id="vel-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(139,108,255)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(139,108,255)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.path
            d={areaD}
            fill="url(#vel-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />

          <motion.path
            d={lineD}
            fill="none"
            stroke="url(#vel-grad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {pts.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === pts.length - 1 ? 4.5 : 2.5}
              fill={i === pts.length - 1 ? "rgb(0,210,211)" : "rgb(139,108,255)"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + (i / pts.length) * 0.5 }}
              style={
                i === pts.length - 1
                  ? { filter: "drop-shadow(0 0 8px rgb(0,210,211))" }
                  : {}
              }
            />
          ))}
        </svg>
      </motion.div>

      {/* Telemetry metrics */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/70 px-3 py-1.5 font-mono text-[11px] text-[color:var(--color-text-muted)]">
          <Zap size={12} className="text-violet" /> &lt;30 сек / прогон
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-500">
          <Check size={12} /> 0 ошибок API
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/70 px-3 py-1.5 font-mono text-[11px] text-[color:var(--color-text-subtle)]">
          Экспорт .xlsx
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Scene 02: Geospatial Hubs (47 Regions Radar)
   ══════════════════════════════════════════════════════ */

function GeospatialScene() {
  const hubs = [
    { name: "Москва & МО", share: 42, rgb: "255, 106, 90" },
    { name: "Санкт-Петербург", share: 26, rgb: "139, 108, 255" },
    { name: "Удалённо / Remote", share: 19, rgb: "0, 210, 211" },
    { name: "Казахстан & СНГ", share: 13, rgb: "16, 185, 129" },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="flex items-baseline justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            География анализа
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-[44px] font-bold leading-none tracking-tight text-[color:var(--color-text-primary)]">
              47
            </span>
            <span className="font-mono text-[16px] text-[color:var(--color-text-subtle)]">регионов</span>
          </div>
        </div>
        <span className="rounded-full border border-coral/30 bg-coral/10 px-3 py-1 font-mono text-[11px] text-coral">
          РФ · СНГ · Remote
        </span>
      </motion.div>

      {/* Regional distribution spectrum */}
      <motion.div variants={fadeUp} className="space-y-2.5">
        {hubs.map((hub, i) => (
          <div key={hub.name} className="space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-[color:var(--color-text-primary)]">{hub.name}</span>
              <span style={{ color: `rgb(${hub.rgb})` }} className="font-bold">
                {hub.share}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-3)]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: `rgb(${hub.rgb})`,
                  boxShadow: `0 0 10px rgba(${hub.rgb}, 0.5)`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${hub.share * 2}%` }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 p-2.5 font-mono text-[10.5px] text-[color:var(--color-text-muted)]"
      >
        <Globe2 size={13} className="text-coral" />
        <span>Автоматическая нормализация локаций и часовых поясов</span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Scene 03: NLP Knowledge Graph (12400+ Skills)
   ══════════════════════════════════════════════════════ */

function NlpGraphScene() {
  const bars = [40, 75, 95, 60, 85, 100, 70, 90, 55, 80, 65, 88, 72, 94, 68];
  const tags = ["Python", "FastAPI", "PostgreSQL", "Docker", "K8s", "Redis", "Kafka"];

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="flex items-baseline justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            База распознавания
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-[44px] font-bold leading-none tracking-tight text-[color:var(--color-text-primary)]">
              12 400
            </span>
            <span className="font-mono text-[22px] font-bold text-aqua">
              +
            </span>
          </div>
        </div>
        <span className="rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 font-mono text-[11px] text-aqua">
          NLP N-gram Engine
        </span>
      </motion.div>

      {/* Cyber Equalizer Waveform */}
      <motion.div
        variants={fadeUp}
        className="flex h-16 items-end justify-between gap-1 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 p-3"
      >
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="w-full rounded-t-sm bg-gradient-to-t from-[rgba(0,210,211,0.2)] to-aqua"
            initial={{ height: 4 }}
            animate={{
              height: `${h}%`,
              opacity: [0.6, 1, 0.7],
            }}
            transition={{
              duration: 1,
              delay: 0.1 + i * 0.04,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              boxShadow: "0 0 8px rgba(0,210,211,0.3)",
            }}
          />
        ))}
      </motion.div>

      {/* Extracted Skill Chips */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/70 px-2.5 py-1 font-mono text-[11px] text-[color:var(--color-text-muted)]"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Scene 04: Confidence Gauge (89% Median Coverage)
   ══════════════════════════════════════════════════════ */

function ConfidenceScene() {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      <motion.div variants={fadeUp} className="flex items-baseline justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            Медианное покрытие
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-[44px] font-bold leading-none tracking-tight text-[color:var(--color-text-primary)]">
              89%
            </span>
            <span className="font-mono text-[16px] text-emerald-500">key_skills</span>
          </div>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-500">
          Точность 99.8%
        </span>
      </motion.div>

      {/* Circular Gauge / Target Visualizer */}
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]/60 p-4"
      >
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36"
              cy="36"
              r="30"
              className="stroke-[color:var(--color-surface-3)]"
              strokeWidth="6"
              fill="none"
            />
            <motion.circle
              cx="36"
              cy="36"
              r="30"
              className="stroke-emerald-500"
              strokeWidth="6"
              strokeDasharray={188.5}
              initial={{ strokeDashoffset: 188.5 }}
              animate={{ strokeDashoffset: 188.5 * (1 - 0.89) }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              fill="none"
              style={{ filter: "drop-shadow(0 0 8px rgba(16,185,129,0.5))" }}
            />
          </svg>
          <span className="absolute font-mono text-[14px] font-bold text-emerald-500">
            89%
          </span>
        </div>

        <div className="space-y-2 text-right">
          <div className="flex items-center justify-end gap-1.5 font-mono text-[11.5px] text-emerald-500">
            <ShieldCheck size={14} />
            <span>Дедупликация 99.8%</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 font-mono text-[11.5px] text-[color:var(--color-text-muted)]">
            <Check size={14} className="text-emerald-500" />
            <span>0% ложных срабатываний</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 py-2 font-mono text-[11px] text-emerald-500"
      >
        <Check size={13} />
        <span>Высокая точность извлечения требований</span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   Main Component — StatsBand
   ══════════════════════════════════════════════════════ */

export function StatsBand() {
  const dict = useDict();
  const s = dict.stats;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const [activeIdx, setActiveIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next =
      v < 0.03 ? 0 : v < 0.28 ? 0 : v < 0.53 ? 1 : v < 0.78 ? 2 : 3;
    if (next !== activeIdx) setActiveIdx(next);
  });

  const currentConfig = STAT_CONFIGS[activeIdx] || STAT_CONFIGS[0];
  const currentItem = s.items[activeIdx] || s.items[0];

  /* ── Dynamic Ambient Background Glow ── */
  const glowBg = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.45, 0.55, 0.7, 0.8, 1],
    [
      "rgba(139,108,255,0.12)",
      "rgba(139,108,255,0.12)",
      "rgba(255,106,90,0.12)",
      "rgba(255,106,90,0.12)",
      "rgba(0,210,211,0.12)",
      "rgba(0,210,211,0.12)",
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
      "rgba(255,106,90,0.22)",
      "rgba(255,106,90,0.22)",
      "rgba(0,210,211,0.22)",
      "rgba(0,210,211,0.22)",
      "rgba(16,185,129,0.22)",
      "rgba(16,185,129,0.22)",
    ],
  );

  const chamberShadow = useTransform(
    borderGlow,
    (v: string) =>
      `inset 0 0 0 1px ${v}, 0 0 40px -8px ${v}, 0 24px 60px -20px rgba(0,0,0,0.35)`,
  );

  const topShimmer = useTransform(
    borderGlow,
    (v: string) => `linear-gradient(90deg, transparent, ${v}, transparent)`,
  );

  return (
    <section
      id="stats"
      aria-labelledby="stats-title"
      className="relative"
    >
      <div
        ref={scrollRef}
        style={{ height: `${RUNWAY_VH}vh` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
          {/* Ambient Glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ backgroundColor: glowBg }}
          />

          <Container className="w-full">
            <div
              id="stats-title"
              className="mb-10 text-center lg:text-left"
            >
              <SectionHeader
                eyebrow={s.eyebrow}
                title={s.title}
                description={s.description}
              />
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[300px_1fr] lg:gap-14 xl:gap-18">
              {/* ── Left: metric selector & description ── */}
              <div className="flex flex-col gap-6">
                {/* Active metric title */}
                <div className="relative min-h-[160px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIdx}
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
                        style={{ color: `rgb(${currentConfig.rgb})` }}
                      >
                        {currentConfig.num} — {currentConfig.tag}
                      </span>
                      <h3 className="mt-2 text-[22px] font-bold tracking-tight text-[color:var(--color-text-primary)] sm:text-[26px]">
                        {currentItem.label}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-text-muted)]">
                        {activeIdx === 0 &&
                          "Каждый прогон обогащает агрегированную выборку новыми трендами рынка."}
                        {activeIdx === 1 &&
                          "Сбор вакансий по крупнейшим IT-хабам РФ, СНГ и международным удалённым вакансиям."}
                        {activeIdx === 2 &&
                          "Собственный NLP-парсер извлекает редкие фреймворки, библиотеки и стек технологий."}
                        {activeIdx === 3 &&
                          "Высокая точность сопоставления требований с дедупликацией похожих формулировок."}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Metric Navigation Items */}
                <div className="flex flex-col gap-2">
                  {s.items.map((item, i) => {
                    const active = i === activeIdx;
                    const past = i < activeIdx;
                    const cfg = STAT_CONFIGS[i];
                    return (
                      <div
                        key={item.label}
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
                            backgroundColor: active ? `rgb(${cfg.rgb})` : undefined,
                          }}
                        >
                          {past ? <Check size={12} strokeWidth={2.5} /> : cfg.num}
                        </span>
                        <span className="line-clamp-1 text-[13px] font-medium">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Right: the morphing telemetry chamber ── */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="glass-strong relative w-full overflow-hidden rounded-[24px] bg-[color:var(--color-surface)]/90"
                  style={{ boxShadow: chamberShadow }}
                >
                  {/* Laser scan on metric change */}
                  <AnimatePresence mode="popLayout">
                    <ScanLine key={activeIdx} rgb={currentConfig.rgb} />
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
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />

                  {/* Scene content */}
                  <div className="relative flex min-h-[370px] items-center p-7 sm:p-8">
                    <div className="w-full">
                      <AnimatePresence mode="wait">
                        {activeIdx === 0 && <VelocityScene key="v" />}
                        {activeIdx === 1 && <GeospatialScene key="g" />}
                        {activeIdx === 2 && <NlpGraphScene key="n" />}
                        {activeIdx === 3 && <ConfidenceScene key="c" />}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Bottom status bar */}
                  <div className="flex items-center justify-between border-t border-[color:var(--color-border-subtle)] px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      <span className="font-mono text-[10px] text-[color:var(--color-text-subtle)]">
                        LIVE MARKET MATRIX
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentConfig.num}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.25 }}
                          className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: `rgb(${currentConfig.rgb})` }}
                        >
                          METRIC {currentConfig.num} / 04
                        </motion.span>
                      </AnimatePresence>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
                        <div className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
                        <div className="h-2 w-2 rounded-full bg-[#28c840]/70" />
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
