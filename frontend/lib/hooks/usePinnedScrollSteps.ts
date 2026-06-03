"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  /** Number of discrete steps (cards) to cycle through. */
  count: number;
  /** Viewport-height units of scroll per step (only this span drives index changes). */
  perStepVh: number;
  /** Extra vh after the last step — holds the final card before unpin. */
  trailingVh?: number;
  /** Sticky `top` offset in vh — must match `top-[12vh]` / `sm:top-[15vh]`. */
  stickyTopVh?: number;
  stickyTopVhSm?: number;
};

function stickyTopPx(stickyTopVh: number, stickyTopVhSm: number) {
  const vh = window.innerHeight;
  const useSm =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(min-width: 640px)").matches;
  return ((useSm ? stickyTopVhSm : stickyTopVh) / 100) * vh;
}

/**
 * Maps scroll position → active step index for a sticky “scroll runway” section.
 *
 * Index advances only over `count * perStepVh` of scroll while the runway is
 * pinned (top of runway at sticky offset). `trailingVh` adds hold time on the
 * last step without compressing earlier steps.
 */
export function usePinnedScrollSteps(
  runwayRef: RefObject<HTMLElement | null>,
  {
    count,
    perStepVh,
    trailingVh = 0,
    stickyTopVh = 12,
    stickyTopVhSm = 15,
  }: Options,
) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = runwayRef.current;
    if (!el || count < 1) return;

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const stickyPx = stickyTopPx(stickyTopVh, stickyTopVhSm);
      const vhPx = window.innerHeight;
      const indexRunwayPx = (perStepVh / 100) * vhPx * count;

      if (indexRunwayPx <= 0) {
        setActiveIdx(0);
        return;
      }

      /* Pin starts when runway top reaches the sticky offset. */
      const scrolledInPin = stickyPx - rect.top;

      if (scrolledInPin <= 0) {
        setActiveIdx(0);
        return;
      }

      if (scrolledInPin >= indexRunwayPx) {
        setActiveIdx(count - 1);
        return;
      }

      /* Equal segment per step: [0,1/N), [1/N,2/N), … */
      const progress = scrolledInPin / indexRunwayPx;
      const idx = Math.min(count - 1, Math.floor(progress * count));
      setActiveIdx(idx);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [
    runwayRef,
    count,
    perStepVh,
    trailingVh,
    stickyTopVh,
    stickyTopVhSm,
  ]);

  const runwayHeightVh = count * perStepVh + trailingVh;

  return { activeIdx, runwayHeightVh };
}
