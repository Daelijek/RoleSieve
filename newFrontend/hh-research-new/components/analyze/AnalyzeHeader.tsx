"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export function AnalyzeHeader() {
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
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo />
          <Badge variant="eyebrow" className="hidden sm:inline-flex">
            {dict.analyze.badge}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button href="/" variant="ghost" size="sm" className="hidden sm:inline-flex">
            {dict.analyze.backHome}
          </Button>
          <Button href="/" variant="ghost" size="sm" className="sm:hidden">
            ←
          </Button>
        </div>
      </Container>
    </header>
  );
}
