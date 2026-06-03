import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <Badge
        variant="eyebrow"
        className={cn(align === "center" && "justify-center")}
      >
        {eyebrow}
      </Badge>
      <h2 className="mt-4 text-balance text-[clamp(1.875rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-pretty text-[16px] leading-[1.6] text-[color:var(--color-text-muted)]",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
