"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates from the current displayed value to `target` when `start` is true.
 * Re-runs when `target` changes (e.g. new job loaded into the same KPI row).
 */
export function useCountUp(
  target: number,
  duration = 1200,
  start: boolean = true,
) {
  const safeTarget = Number.isFinite(target) ? Math.max(0, Math.round(target)) : 0;
  const [value, setValue] = useState(0);
  const displayedRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!start) return;
    cancelAnimationFrame(frameRef.current);

    if (duration <= 0) {
      displayedRef.current = safeTarget;
      setValue(safeTarget);
      return;
    }

    const from = displayedRef.current;
    if (from === safeTarget) {
      setValue(safeTarget);
      return;
    }

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(from + (safeTarget - from) * eased);
      displayedRef.current = next;
      setValue(next);
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [safeTarget, duration, start]);

  return value;
}
