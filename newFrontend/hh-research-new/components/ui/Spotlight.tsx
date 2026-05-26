"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type SpotlightProps = React.HTMLAttributes<HTMLDivElement> & {
  /** rgba components without alpha, e.g. "139,108,255" */
  color?: string;
  /** Spotlight circle size (px) */
  size?: number;
  /** Max color alpha */
  intensity?: number;
};

/**
 * Wraps content with a mouse-tracking radial-gradient overlay.
 * The overlay only shows on hover and inherits border-radius from the wrapper.
 */
export const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(
  function Spotlight(
    {
      color = "139,108,255",
      size = 420,
      intensity = 0.09,
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
            background: `radial-gradient(${size}px circle at var(--mx) var(--my), rgba(${color},${intensity}), transparent 55%)`,
          }}
        />
        {children}
      </div>
    );
  },
);
