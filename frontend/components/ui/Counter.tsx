"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCountUp } from "@/lib/hooks/useCountUp";

type CounterProps = {
  target: number;
  duration?: number;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** When true, starts immediately on mount instead of waiting for viewport entry. */
  immediate?: boolean;
};

const defaultFormat = (n: number) =>
  n.toLocaleString("ru-RU").replace(/\u00a0/g, " ");

export function Counter({
  target,
  duration = 1400,
  format = defaultFormat,
  prefix = "",
  suffix = "",
  className,
  immediate = false,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const start = immediate || inView;
  const value = useCountUp(target, duration, start);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(value)}
      {suffix}
    </span>
  );
}
