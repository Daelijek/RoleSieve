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
  size = 28,
  color = "var(--dot-grid-color)",
  fade = "center",
}: DotGridProps) {
  const mask =
    fade === "center"
      ? "radial-gradient(ellipse 60% 60% at center, black 20%, transparent 80%)"
      : fade === "top"
        ? "linear-gradient(180deg, black 0%, transparent 80%)"
        : fade === "bottom"
          ? "linear-gradient(0deg, black 0%, transparent 80%)"
          : undefined;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
