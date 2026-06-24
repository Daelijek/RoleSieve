"use client";

import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import type { ExportSummary } from "@/lib/types/export-summary";
import { useDict } from "@/lib/i18n";
import { rankChartCardClass, resultsPanelBodyClass } from "./rank-chart-shared";

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

type CoverageRingProps = {
  coverage: NonNullable<ExportSummary["coverage"]>;
  errors: number;
};

export function CoverageRing({ coverage, errors }: CoverageRingProps) {
  const dict = useDict();
  const slices = useMemo(() => {
    const legend = dict.analyze.coverageLegend;
    return [
      {
        key: "withKeySkills",
        label: legend.withKeySkills,
        value: coverage.with_key_skills,
        color: "#8B6CFF",
      },
      {
        key: "noKeySkills",
        label: legend.noKeySkills,
        value: coverage.without_key_skills,
        color: "rgba(156,160,174,0.55)",
      },
      {
        key: "emptyDescription",
        label: legend.emptyDescription,
        value: coverage.without_description,
        color: "#6CE7FF",
      },
      {
        key: "errors",
        label: legend.errors,
        value: errors,
        color: "#FF6A5A",
      },
    ].filter((s) => s.value > 0);
  }, [coverage, errors, dict]);

  const total = Math.max(0, coverage.successful) + Math.max(0, errors);

  const arcs = useMemo(() => {
    if (total <= 0 || slices.length === 0) return [];
    let angle = 0;
    return slices.map((s) => {
      const portion = s.value / total;
      const sweep = portion * 360;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      return { ...s, startAngle: start, endAngle: end };
    });
  }, [slices, total]);

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const stroke = 16;
  const ratePct = Math.round(coverage.key_skills_rate * 100);

  return (
    <div className={rankChartCardClass}>
      <div className="mb-5 flex shrink-0 items-center gap-2">
        <ShieldCheck size={15} strokeWidth={1.75} className="text-violet" />
        <h3 className="text-[14px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {dict.analyze.coverageTitle}
        </h3>
      </div>

      {total <= 0 ? (
        <p className="text-[13px] text-[color:var(--color-text-muted)]">—</p>
      ) : (
        <div className={`${resultsPanelBodyClass} grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center`}>
          <div className="flex items-center justify-center rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/40 p-4">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label={dict.analyze.coverageTitle}
            >
              <defs>
                <linearGradient id="cov-grad-violet" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8B6CFF" />
                  <stop offset="100%" stopColor="#A78BFF" />
                </linearGradient>
              </defs>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={stroke}
              />
              {arcs.map((a) => (
                <path
                  key={a.key}
                  d={arcPath(cx, cy, r, a.startAngle, a.endAngle)}
                  fill="none"
                  stroke={
                    a.key === "withKeySkills"
                      ? "url(#cov-grad-violet)"
                      : a.color
                  }
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  style={
                    a.key === "withKeySkills"
                      ? { filter: "drop-shadow(0 0 8px rgba(139,108,255,0.5))" }
                      : undefined
                  }
                />
              ))}
              <text
                x={cx}
                y={cy - 6}
                textAnchor="middle"
                fontSize="26"
                fontWeight="600"
                fill="#e8e9ee"
                fontFamily="var(--font-mono)"
              >
                {ratePct}%
              </text>
              <text
                x={cx}
                y={cy + 14}
                textAnchor="middle"
                fontSize="9"
                fill="#5f6273"
                fontFamily="var(--font-mono)"
                letterSpacing="0.08em"
              >
                {dict.analyze.coverageCenter}
              </text>
            </svg>
          </div>

          <ul className="space-y-2.5">
            {slices.map((s) => {
              const pct = total ? (s.value / total) * 100 : 0;
              return (
                <li
                  key={s.key}
                  className="flex items-center justify-between gap-3 text-[13px]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="truncate text-[color:var(--color-text-muted)]">
                      {s.label}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono tabular-nums text-[color:var(--color-text-primary)]">
                    {s.value}{" "}
                    <span className="text-[color:var(--color-text-subtle)]">
                      ({pct.toFixed(1)}%)
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
