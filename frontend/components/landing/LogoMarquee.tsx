"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import { Container } from "@/components/ui/Container";
import { useDict } from "@/lib/i18n";

/** Pixels per second — keeps scroll speed stable as content width grows. */
const MARQUEE_SPEED_PX_PER_SEC = 72;

type LoopItem = { key: string; name: string };

function MarqueeTrack({
  items,
  hidden,
  trackRef,
}: {
  items: LoopItem[];
  hidden?: boolean;
  trackRef?: Ref<HTMLUListElement>;
}) {
  return (
    <ul
      ref={trackRef}
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
      aria-hidden={hidden || undefined}
    >
      {items.map(({ key, name }) => (
        <li
          key={hidden ? `dup-${key}` : key}
          className="select-none text-[clamp(1.25rem,2vw,1.625rem)] font-semibold tracking-tight text-[color:var(--color-text-muted)]/80 transition-colors duration-300 hover:text-[color:var(--color-text-primary)]"
          style={{ fontVariationSettings: "'opsz' 32" }}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export function LogoMarquee() {
  const dict = useDict();
  const l = dict.logos;
  const items = l.items;

  const [repeat, setRepeat] = useState(2);
  const [shiftPx, setShiftPx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const loopedItems = useMemo(
    () =>
      Array.from({ length: repeat }, (_, r) =>
        items.map((name) => ({ key: `${r}-${name}`, name }))
      ).flat(),
    [items, repeat]
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const sync = () => {
      const containerWidth = container.clientWidth;
      const trackWidth = track.getBoundingClientRect().width;

      if (trackWidth < containerWidth && repeat < 24) {
        setShiftPx(0);
        setRepeat((r) => r + 1);
        return;
      }

      setShiftPx(trackWidth);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(container);
    observer.observe(track);
    return () => observer.disconnect();
  }, [repeat, items]);

  const duration =
    shiftPx > 0 ? shiftPx / MARQUEE_SPEED_PX_PER_SEC : 36;

  return (
    <section
      aria-label={l.title}
      className="relative border-y border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40 py-10 backdrop-blur"
    >
      <Container className="mb-6">
        <p className="text-center font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {l.title}
        </p>
      </Container>

      <div ref={containerRef} className="group relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[color:var(--color-canvas)] to-transparent sm:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[color:var(--color-canvas)] to-transparent sm:w-40"
        />
        <div
          className="flex w-max group-hover:[animation-play-state:paused]"
          style={
            shiftPx > 0
              ? {
                  ["--marquee-distance" as string]: `${shiftPx}px`,
                  animation: `marquee-x ${duration}s linear infinite`,
                }
              : undefined
          }
          aria-hidden
        >
          <MarqueeTrack trackRef={trackRef} items={loopedItems} />
          <MarqueeTrack items={loopedItems} hidden />
        </div>
      </div>
    </section>
  );
}
