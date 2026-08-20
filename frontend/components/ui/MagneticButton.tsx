"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type MagneticButtonProps = {
  children: React.ReactNode;
  /** 0..1 — how strongly the element follows the cursor */
  strength?: number;
  className?: string;
};

export function MagneticButton({
  children,
  strength = 0.28,
  className,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    setOffset({ x: dx, y: dy });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: isHovered
          ? "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)"
          : "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)",
        willChange: "transform",
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </div>
  );
}

