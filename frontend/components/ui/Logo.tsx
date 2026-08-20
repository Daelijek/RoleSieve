import Image from "next/image";
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
      aria-label="RoleSieve — на главную"
      className={cn(
        "group inline-flex items-center gap-2.5 outline-none",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-[var(--glow-logo)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-105"
      >
        <Image
          src="/brand/logo.png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 object-cover"
          priority
        />
        <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/15" />
      </span>
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          Role<span className="text-[color:var(--color-text-muted)]">Sieve</span>
        </span>
      ) : null}
    </Link>
  );
}
