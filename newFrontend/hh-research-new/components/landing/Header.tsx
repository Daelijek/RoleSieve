"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { cn } from "@/lib/cn";
import { getDict } from "@/lib/i18n";

const dict = getDict();

const navItems = [
  { label: dict.header.nav.features, href: "#features" },
  { label: dict.header.nav.how, href: "#how" },
  { label: dict.header.nav.audience, href: "#audience" },
  { label: dict.header.nav.faq, href: "#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)]",
        scrolled
          ? "border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container as="nav" className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <ul className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group/nav relative inline-flex h-8 items-center text-[14px] font-medium text-[color:var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[color:var(--color-text-primary)]"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -bottom-px h-[1.5px] origin-left scale-x-0 rounded-full bg-[var(--signature-gradient)] opacity-0 transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover/nav:scale-x-100 group-hover/nav:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher comingSoonLabel={dict.meta.comingSoon} />
          <a
            href="/signin"
            className="hidden text-[14px] font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-primary)] sm:inline-flex"
          >
            {dict.header.signIn}
          </a>
          <Button href="/analyze" size="sm">
            {dict.header.cta}
          </Button>
        </div>
      </Container>
    </header>
  );
}
