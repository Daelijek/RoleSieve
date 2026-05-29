"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
        "fixed inset-x-0 top-0 z-50 h-[var(--header-height)] transition-[background-color,backdrop-filter,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)]",
        scrolled
          ? "border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/80 shadow-[0_8px_32px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl"
          : "border-b border-transparent bg-[color:var(--color-canvas)]/25 backdrop-blur-md",
      )}
    >
      <Container as="nav" className="flex h-full items-center justify-between">
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
                    className="pointer-events-none absolute inset-x-0 -bottom-px h-[1.5px] origin-left scale-x-0 rounded-full bg-[image:var(--signature-gradient)] opacity-0 transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover/nav:scale-x-100 group-hover/nav:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
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
