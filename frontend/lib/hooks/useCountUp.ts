"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` once `start` becomes truthy.
 * Uses ease-out-cubic, RAF-driven. Idempotent — never restarts.
 */
export function useCountUp(
  target: number,
  duration = 1200,
  start: boolean = true,
) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    let raf = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
