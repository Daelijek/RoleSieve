"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type SparklineProps = {
  values: readonly number[];
  width?: number;
  height?: number;
  /** Any valid SVG color value. Defaults are theme-aware channel vars. */
  strokeFrom?: string;
  strokeTo?: string;
  /** Whether to fill area under line with a soft gradient. */
  fill?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function Sparkline({
  values,
  width = 120,
  height = 36,
  strokeFrom = "rgb(var(--rgb-violet))",
  strokeTo = "rgb(var(--rgb-coral))",
  fill = true,
  className,
  ariaLabel,
}: SparklineProps) {
  const reactId = useId();
  const gid = `${reactId}-grad`;
  const fid = `${reactId}-fill`;

  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padX = 2;
  const padY = 4;
  const w = width - padX * 2;
  const h = height - padY * 2;
  const step = w / (values.length - 1);
  const points = values.map((v, i) => {
    const x = padX + i * step;
    const y = padY + h - ((v - min) / range) * h;
    return [x, y] as const;
  });
  const pathD = points
    .map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
    .join(" ");
  const areaD = `${pathD} L ${points[points.length - 1][0]},${height} L ${points[0][0]},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      className={cn("overflow-visible", className)}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={strokeFrom} />
          <stop offset="100%" stopColor={strokeTo} />
        </linearGradient>
        <linearGradient id={fid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeFrom} stopOpacity="0.32" />
          <stop offset="100%" stopColor={strokeFrom} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill ? <path d={areaD} fill={`url(#${fid})`} /> : null}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r={2.5}
        fill={strokeTo}
      />
    </svg>
  );
}
