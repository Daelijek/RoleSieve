"use client";

import { motion, useReducedMotion } from "framer-motion";
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

type SkillsCloudProps = {
  items: RankedItem[];
  maxItems?: number;
};

export function SkillsCloud({ items, maxItems = 10 }: SkillsCloudProps) {
  const reduce = useReducedMotion();
  const slice = items.slice(0, maxItems);
  const maxCount = Math.max(...slice.map((s) => s.count), 1);
  const minR = 22;
  const maxR = 52;

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

      <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/50">
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
            <radialGradient id="bubble-violet" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#A78BFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8B6CFF" stopOpacity="0.35" />
            </radialGradient>
            <radialGradient id="bubble-coral" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#FF8D80" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF6A5A" stopOpacity="0.35" />
            </radialGradient>
          </defs>

          {slice.map((item, i) => {
            const pos = POSITIONS[i] ?? POSITIONS[0];
            const t = item.count / maxCount;
            const radius = minR + t * (maxR - minR);
            const fill = i % 2 === 0 ? "url(#bubble-violet)" : "url(#bubble-coral)";
            const fontSize = Math.max(9, Math.min(12, radius * 0.28));

            return (
              <motion.g
                key={item.name}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                style={reduce ? undefined : { transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={fill}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1}
                  style={{
                    filter: `drop-shadow(0 0 ${8 + t * 12}px ${
                      i % 2 === 0 ? "rgba(139,108,255,0.45)" : "rgba(255,106,90,0.35)"
                    })`,
                  }}
                  animate={
                    reduce ? undefined : { cy: [pos.y, pos.y - (i % 2 === 0 ? 4 : -4), pos.y] }
                  }
                  transition={
                    reduce
                      ? undefined
                      : {
                          cy: {
                            duration: 3 + i * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                  }
                />
                <text
                  x={pos.x}
                  y={pos.y - fontSize * 0.3}
                  textAnchor="middle"
                  fill="#e8e9ee"
                  fontSize={fontSize}
                  fontWeight="600"
                  fontFamily="var(--font-sans)"
                >
                  {item.name.length > 12
                    ? `${item.name.slice(0, 10)}…`
                    : item.name}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + fontSize * 0.9}
                  textAnchor="middle"
                  fill="#9ca0ae"
                  fontSize={fontSize - 1}
                  fontFamily="var(--font-mono)"
                >
                  {item.count}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
