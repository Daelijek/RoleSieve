import { cn } from "@/lib/cn";

type DotGridProps = {
  className?: string;
  /** Spacing between dots, px */
  size?: number;
  /** Dot color (any CSS color); defaults to theme-aware --dot-grid-color */
  color?: string;
  /** Fade-out mask preset */
  fade?: "center" | "top" | "bottom" | "none";
};

export function DotGrid({
  className,
  size = 32,
  color = "var(--dot-grid-color)",
  fade = "center",
}: DotGridProps) {
  const mask =
    fade === "center"
      ? "radial-gradient(ellipse 75% 65% at 50% 50%, black 15%, transparent 85%)"
      : fade === "top"
        ? "linear-gradient(180deg, black 0%, transparent 80%)"
        : fade === "bottom"
          ? "linear-gradient(0deg, black 0%, transparent 80%)"
          : "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
