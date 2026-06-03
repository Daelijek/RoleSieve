"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import { getDict } from "@/lib/i18n";

const dict = getDict();

const navItems = [
  { label: dict.header.nav.home, href: "/" },
  { label: dict.header.nav.analyze, href: "/analyze" },
] as const;

type HeaderProps = {
  /** `analyze` — badge + «На главную» вместо входа и CTA */
  variant?: "default" | "analyze";
};

export function Header({ variant = "default" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn("site-header", scrolled && "site-header--scrolled")}
    >
      <Container as="nav" className="flex h-full items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-10">
          <Logo />
          {variant === "analyze" ? (
            <Badge variant="eyebrow" className="hidden sm:inline-flex">
              {dict.analyze.badge}
            </Badge>
          ) : null}
          <ul className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    variant === "analyze" && item.href === "/analyze"
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "group/nav relative inline-flex h-8 items-center text-[14px] font-medium transition-colors duration-[var(--duration-fast)]",
                    variant === "analyze" && item.href === "/analyze"
                      ? "text-[color:var(--color-text-primary)]"
                      : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -bottom-px h-[1.5px] origin-left scale-x-0 rounded-full bg-[image:var(--signature-gradient)] opacity-0 transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover/nav:scale-x-100 group-hover/nav:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LangSwitcher comingSoonLabel={dict.meta.comingSoon} />
          {variant === "analyze" ? (
            <>
              <Button
                href="/"
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                {dict.analyze.backHome}
              </Button>
              <Button href="/" variant="ghost" size="sm" className="sm:hidden">
                ←
              </Button>
            </>
          ) : (
            <>
              <a
                href="/signin"
                className="hidden text-[14px] font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-primary)] sm:inline-flex"
              >
                {dict.header.signIn}
              </a>
              <Button href="/analyze" size="sm">
                {dict.header.cta}
              </Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
