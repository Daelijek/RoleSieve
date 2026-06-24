"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useDict } from "@/lib/i18n";

function hrefFor(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

export function DocsSidebar() {
  const dict = useDict();
  const pathname = usePathname();
  const { label, items } = dict.docs.nav;

  const isActive = (slug: string) => pathname === hrefFor(slug);

  return (
    <nav aria-label={label} className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
      {/* Mobile: horizontal scroller */}
      <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:hidden">
        {items.map((item) => {
          const active = isActive(item.slug);
          return (
            <li key={item.slug} className="shrink-0">
              <Link
                href={hrefFor(item.slug)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors",
                  active
                    ? "border-violet/50 bg-[color:var(--color-violet)]/12 text-[color:var(--color-text-primary)]"
                    : "border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text-primary)]",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop: vertical list */}
      <div className="hidden lg:block">
        <p className="mb-3 px-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {label}
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active = isActive(item.slug);
            return (
              <li key={item.slug}>
                <Link
                  href={hrefFor(item.slug)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center rounded-lg px-3 py-2 text-[14px] transition-colors",
                    active
                      ? "bg-[color:var(--color-surface-2)] font-medium text-[color:var(--color-text-primary)]"
                      : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]/50 hover:text-[color:var(--color-text-primary)]",
                  )}
                >
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[image:var(--signature-gradient)]"
                    />
                  ) : null}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
