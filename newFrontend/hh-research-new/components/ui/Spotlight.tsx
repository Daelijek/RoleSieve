"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type SpotlightTint = "violet" | "coral" | "aqua";

type SpotlightProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Named accent — maps to the theme-aware RGB channel variable. */
  tint?: SpotlightTint;
  /** Spotlight circle size (px) */
  size?: number;
  /** Max color alpha at the spotlight center (0..1) */
  intensity?: number;
};

const tintChannelMap: Record<SpotlightTint, string> = {
  violet: "var(--rgb-violet)",
  coral: "var(--rgb-coral)",
  aqua: "var(--rgb-aqua)",
};

/**
 * Wraps content with a mouse-tracking radial-gradient overlay.
 * The overlay only shows on hover and inherits border-radius from the wrapper.
 * Uses theme-aware channel vars so the same component looks right in both themes.
 */
export const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(
  function Spotlight(
    {
      tint = "violet",
      size = 420,
      intensity = 0.1,
      className,
      children,
      onMouseMove,
      ...rest
    },
    ref,
  ) {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current!, []);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }
      onMouseMove?.(e);
    };

    const channel = tintChannelMap[tint];

    return (
      <div
        ref={innerRef}
        onMouseMove={handleMove}
        className={cn("group/spot relative", className)}
        style={
          {
            "--mx": "50%",
            "--my": "0%",
          } as React.CSSProperties
        }
        {...rest}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[var(--duration-base)] group-hover/spot:opacity-100"
          style={{
            borderRadius: "inherit",
            background: `radial-gradient(${size}px circle at var(--mx) var(--my), rgb(${channel} / ${intensity}), transparent 55%)`,
          }}
        />
        {children}
      </div>
    );
  },
);
