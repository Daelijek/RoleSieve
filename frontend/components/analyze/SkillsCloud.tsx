"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import type { RankedItem } from "@/lib/types/export-summary";
import { getDict } from "@/lib/i18n";

const dict = getDict();

/** Precomputed positions for up to 10 bubbles in a 400×220 viewBox */
const POSITIONS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 200, y: 110 },
  { x: 120, y: 80 },
  { x: 290, y: 75 },
  { x: 80, y: 150 },
  { x: 320, y: 140 },
  { x: 160, y: 165 },
  { x: 250, y: 170 },
  { x: 340, y: 95 },
  { x: 55, y: 95 },
  { x: 200, y: 45 },
];

/** Only the largest bubbles float — enough motion, less paint work. */
const FLOATING_BUBBLE_COUNT = 6;

type SkillsCloudProps = {
  items: RankedItem[];
  maxItems?: number;
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

export function SkillsCloud({ items, maxItems = 10 }: SkillsCloudProps) {
  const reduce = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const violetGradId = `bubble-violet-${uid}`;
  const coralGradId = `bubble-coral-${uid}`;

  const slice = items.slice(0, maxItems);
  const maxCount = Math.max(...slice.map((s) => s.count), 1);
  const minR = 22;
  const maxR = 52;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("skills-cloud-stage--paused", !entry.isIntersecting);
      },
      { rootMargin: "48px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-[color:var(--color-surface)]/40 p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={15} strokeWidth={1.75} className="text-aqua" />
          <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            {dict.analyze.cloudTitle}
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {dict.analyze.cloudHint}
        </span>
      </div>

      <div
        ref={stageRef}
        className="skills-cloud-stage relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/50"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "var(--noise-bg)",
            backgroundSize: "200px 200px",
          }}
        />
        <svg
          viewBox="0 0 400 220"
          className="h-auto w-full"
          role="img"
          aria-label={dict.analyze.cloudTitle}
        >
          <defs>
            <radialGradient id={violetGradId} cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#A78BFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#8B6CFF" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id={coralGradId} cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF8D80" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FF6A5A" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {slice.map((item, i) => {
            const pos = POSITIONS[i] ?? POSITIONS[0];
            const t = item.count / maxCount;
            const radius = minR + t * (maxR - minR);
            const fill =
              i % 2 === 0 ? `url(#${violetGradId})` : `url(#${coralGradId})`;
            const fontSize = Math.max(9, Math.min(12, radius * 0.28));
            const floatY = i % 2 === 0 ? -3 : 3;
            const floatDur = 3.2 + i * 0.25;
            const shouldFloat = !reduce && i < FLOATING_BUBBLE_COUNT;

            return (
              <g key={item.name} transform={`translate(${pos.x} ${pos.y})`}>
                <g
                  className={shouldFloat ? "skills-cloud-bubble--float" : undefined}
                  style={
                    shouldFloat
                      ? ({
                          ["--float-y" as string]: `${floatY}px`,
                          ["--float-dur" as string]: `${floatDur}s`,
                          ["--float-delay" as string]: `${i * 0.12}s`,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  <circle
                    r={radius}
                    fill={fill}
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth={1}
                  />
                  <text
                    y={-fontSize * 0.3}
                    textAnchor="middle"
                    fill="var(--color-text-primary)"
                    fontSize={fontSize}
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                  >
                    {item.name.length > 12
                      ? `${item.name.slice(0, 10)}…`
                      : item.name}
                  </text>
                  <text
                    y={fontSize * 0.9}
                    textAnchor="middle"
                    fill="var(--color-text-muted)"
                    fontSize={fontSize - 1}
                    fontFamily="var(--font-mono)"
                  >
                    {item.count}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
