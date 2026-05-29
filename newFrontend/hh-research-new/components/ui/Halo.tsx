import { cn } from "@/lib/cn";

type HaloProps = {
  /** Width in px (height defaults to width unless `height` is set). */
  size?: number;
  height?: number;
  /** CSS positioning offsets — strings like "-10%" or "200px". */
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Override opacity for stronger/softer halos. Will be multiplied
   *  by `--halo-multiplier` so light theme can soften the blobs. */
  opacity?: number;
  /** Variant tweaks the color stops. */
  variant?: "signature" | "violet" | "coral" | "aqua";
  /** Whether to pulse slowly. */
  animated?: boolean;
  className?: string;
};

const variants: Record<NonNullable<HaloProps["variant"]>, string> = {
  signature: "bg-[image:var(--signature-gradient)]",
  violet:
    "bg-[image:radial-gradient(circle_at_center,_var(--color-violet)_0%,_transparent_70%)]",
  coral:
    "bg-[image:radial-gradient(circle_at_center,_var(--color-coral)_0%,_transparent_70%)]",
  aqua: "bg-[image:radial-gradient(circle_at_center,_var(--color-aqua)_0%,_transparent_70%)]",
};

export function Halo({
  size = 640,
  height,
  top,
  left,
  right,
  bottom,
  opacity = 0.35,
  variant = "signature",
  animated = true,
  className,
}: HaloProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "halo-blob",
        variants[variant],
        animated && "animate-halo-pulse",
        className,
      )}
      style={{
        width: size,
        height: height ?? size,
        top,
        left,
        right,
        bottom,
        opacity: `calc(${opacity} * var(--halo-multiplier, 1))`,
      }}
    />
  );
}
