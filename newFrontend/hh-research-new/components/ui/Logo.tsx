import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  href?: string;
  showWordmark?: boolean;
};

export function Logo({ className, href = "/", showWordmark = true }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="hhResearch — на главную"
      className={cn(
        "group inline-flex items-center gap-2.5 outline-none",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--signature-gradient)] shadow-[var(--glow-logo)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-105"
      >
        <span className="font-mono text-[14px] font-bold leading-none text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
          hh
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/15" />
      </span>
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          hh<span className="text-[color:var(--color-text-muted)]">Research</span>
        </span>
      ) : null}
    </Link>
  );
}
