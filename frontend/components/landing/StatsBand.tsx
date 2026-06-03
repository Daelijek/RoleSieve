"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";
import { usePinnedScrollSteps } from "@/lib/hooks/usePinnedScrollSteps";

/** Scroll space per stat, in vh. Lower = quicker cycling. */
const PER_STAT_VH = 40;
const TRAILING_VH = 30;

/* Theme-aware palette — CSS vars are resolved by the browser when SVG renders,
   so the colors automatically shift when html.light flips. */
const PALETTE = [
  { from: "rgb(var(--rgb-violet))", to: "rgb(var(--rgb-coral))" },
  { from: "rgb(var(--rgb-coral))", to: "rgb(var(--rgb-aqua))" },
  { from: "rgb(var(--rgb-aqua))", to: "rgb(var(--rgb-violet))" },
  { from: "rgb(var(--rgb-violet))", to: "rgb(var(--rgb-coral))" },
] as const;

/* ── Large animated sparkline drawn stroke-by-stroke ── */
function AnimatedSparkline({
  values,
  uid,
  strokeFrom,
  strokeTo,
}: {
  values: readonly number[];
  uid: string;
  strokeFrom: string;
  strokeTo: string;
}) {
  const W = 520;
  const H = 110;
  const padX = 6;
  const padY = 10;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = innerW / (values.length - 1);
  const pts = values.map((v, i) => ({
    x: padX + i * step,
    y: padY + innerH - ((v - min) / range) * innerH,
  }));
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  const areaD = `${lineD} L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;
  const gid = `sg-${uid}`;
  const fid = `sf-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={strokeFrom} />
          <stop offset="100%" stopColor={strokeTo} />
        </linearGradient>
        <linearGradient id={fid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeFrom} stopOpacity="0.22" />
          <stop offset="100%" stopColor={strokeFrom} stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={areaD}
        fill={`url(#${fid})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />

      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={W - padX}
          y1={padY + innerH * t}
          y2={padY + innerH * t}
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth={1}
        />
      ))}

      <motion.path
        d={lineD}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {pts.map((p, i) => {
        const isLast = i === pts.length - 1;
        return (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={isLast ? 4.5 : 3}
            fill={isLast ? strokeTo : strokeFrom}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.55 + (i / (pts.length - 1)) * 0.6,
              ease: "backOut",
            }}
            style={
              isLast
                ? { filter: `drop-shadow(0 0 7px ${strokeTo})` }
                : { opacity: 0.55 }
            }
          />
        );
      })}

      {[pts[0], pts[pts.length - 1]].map((p, idx) => (
        <motion.text
          key={idx}
          x={p.x + (idx === 0 ? 6 : -6)}
          y={p.y - 8}
          textAnchor={idx === 0 ? "start" : "end"}
          fill={idx === 0 ? strokeFrom : strokeTo}
          fontSize={10}
          fontFamily="monospace"
          initial={{ opacity: 0, y: p.y - 2 }}
          animate={{ opacity: 0.7, y: p.y - 8 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          {values[idx === 0 ? 0 : values.length - 1]}
        </motion.text>
      ))}
    </svg>
  );
}

export function StatsBand() {
  const dict = useDict();
  const s = dict.stats;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeIdx, runwayHeightVh } = usePinnedScrollSteps(scrollRef, {
    count: s.items.length,
    perStepVh: PER_STAT_VH,
    trailingVh: TRAILING_VH,
  });

  const activeStat = s.items[activeIdx];
  const activeColors = PALETTE[activeIdx];

  return (
    <section
      id="stats"
      aria-labelledby="stats-title"
      className="relative py-20 sm:py-28"
    >
      <div
        ref={scrollRef}
        className="relative"
        style={{ height: `${runwayHeightVh}vh` }}
      >
        <div className="sticky top-[12vh] sm:top-[15vh]">
          <Container className="w-full">
            <div id="stats-title" className="mb-8 lg:mb-10">
              <SectionHeader
                eyebrow={s.eyebrow}
                title={s.title}
                description={s.description}
              />
            </div>

            <div className="grid items-center gap-6 lg:grid-cols-[220px_1fr] lg:gap-14 xl:gap-20">
              {/* ── Left: stat navigation ── */}
              <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {s.items.map((item, i) => {
                  const active = i === activeIdx;
                  const past = i < activeIdx;
                  return (
                    <li key={item.label} className="flex-shrink-0 lg:flex-shrink">
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-500",
                          active
                            ? "bg-[color:var(--color-surface-2)] shadow-[var(--glow-stat-ring)]"
                            : past
                              ? "opacity-40"
                              : "opacity-25",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold transition-all duration-500",
                            active
                              ? "bg-[color:var(--color-violet)]/20 text-violet shadow-[var(--glow-stat-num)]"
                              : past
                                ? "bg-[color:var(--color-violet)]/10 text-violet/60"
                                : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-subtle)]",
                          )}
                        >
                          {past ? (
                            <Check size={11} strokeWidth={2.5} />
                          ) : (
                            (i + 1).toString().padStart(2, "0")
                          )}
                        </span>
                        <span
                          className={cn(
                            "line-clamp-2 text-[13px] font-medium transition-colors duration-500",
                            active
                              ? "text-[color:var(--color-text-primary)]"
                              : "text-[color:var(--color-text-muted)]",
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* ── Right: active stat card ── */}
              <div className="relative h-[290px] sm:h-[300px] lg:h-[320px]">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={activeIdx}
                    className="glass absolute inset-0 rounded-3xl p-6 sm:p-7 lg:p-9"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                      {activeStat.label}
                    </p>

                    <Counter
                      target={activeStat.target}
                      suffix={activeStat.suffix}
                      immediate
                      duration={1200}
                      className="mt-1.5 block font-mono text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-none tracking-tight tabular-nums text-[color:var(--color-text-primary)]"
                    />

                    <div className="mt-5">
                      <AnimatedSparkline
                        values={activeStat.sparkline}
                        uid={`${activeIdx}`}
                        strokeFrom={activeColors.from}
                        strokeTo={activeColors.to}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-1.5">
                      {s.items.map((_, j) => (
                        <motion.div
                          key={j}
                          className="h-1 rounded-full bg-violet"
                          animate={{
                            width: j === activeIdx ? 24 : 6,
                            opacity: j <= activeIdx ? 1 : 0.2,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
