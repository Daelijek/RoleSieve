import { cn } from "@/lib/cn";

type BadgeVariant = "eyebrow" | "chip" | "dot";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  dotColor?: "violet" | "coral" | "aqua" | "success";
};

const variants: Record<BadgeVariant, string> = {
  eyebrow:
    "font-mono uppercase tracking-[0.18em] text-[12px] text-violet flex items-center gap-2",
  chip: "inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] px-2.5 py-1 text-[12px] font-medium text-[color:var(--color-text-primary)]",
  dot: "inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text-muted)]",
};

const dotColors: Record<NonNullable<BadgeProps["dotColor"]>, string> = {
  violet: "bg-violet",
  coral: "bg-coral",
  aqua: "bg-aqua",
  success: "bg-success",
};

export function Badge({
  variant = "chip",
  className,
  children,
  dotColor = "violet",
  ...rest
}: BadgeProps) {
  if (variant === "eyebrow") {
    return (
      <span className={cn(variants.eyebrow, className)} {...rest}>
        <span
          aria-hidden
          className="h-1 w-1 rounded-full bg-violet shadow-[0_0_10px_2px_rgba(139,108,255,0.6)]"
        />
        {children}
      </span>
    );
  }
  if (variant === "dot") {
    return (
      <span className={cn(variants.dot, className)} {...rest}>
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 rounded-full", dotColors[dotColor])}
        />
        {children}
      </span>
    );
  }
  return (
    <span className={cn(variants.chip, className)} {...rest}>
      {children}
    </span>
  );
}
