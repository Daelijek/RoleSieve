import React from "react";
import { cn } from "@/lib/cn";
import { GridPattern } from "@/components/ui/grid-pattern";

export function GridCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative isolate z-0 flex h-full flex-col justify-between overflow-hidden rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)] px-5 py-4 transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover/grid-card:border-[color:var(--color-border-strong)] group-hover/grid-card:shadow-[var(--shadow-lift)]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0">
        <div className="absolute -inset-[25%] -skew-y-12 [mask-image:linear-gradient(225deg,black,transparent)]">
          <GridPattern
            width={30}
            height={30}
            x={0}
            y={0}
            squares={GRID_CARD_PATTERN}
            className={cn(
              "absolute inset-0 size-full fill-[color:var(--color-border-strong)]/30 stroke-[color:var(--color-border-strong)]/40",
              "translate-y-2 transition-transform duration-150 ease-out",
              "group-hover/grid-card:translate-y-0 group-hover/grid-card:fill-[color:var(--color-border-strong)]/45 group-hover/grid-card:stroke-[color:var(--color-border-strong)]/55",
            )}
          />
        </div>
        <div
          aria-hidden
          className={cn(
            "nav-card-glow pointer-events-none absolute -inset-[10%] opacity-0 blur-[50px]",
            "transition-opacity duration-150 ease-out group-hover/grid-card:opacity-10",
          )}
        />
      </div>
      {children}
    </div>
  );
}

const GRID_CARD_PATTERN: [x: number, y: number][] = [
  [7, 2],
  [9, 4],
  [8, 1],
  [10, 3],
  [7, 5],
];
