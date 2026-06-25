"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { cn } from "@/lib/cn";
import { useDict } from "@/lib/i18n";

type HeaderProps = {
  /** `analyze` / `docs` / `contact` — badge у логотипа + подсветка раздела в навигации */
  variant?: "default" | "analyze" | "docs" | "contact";
};

const navLinkClass = (active: boolean) =>
  cn(
    "group/nav relative inline-flex min-h-11 items-center text-[16px] font-medium transition-colors duration-[var(--duration-fast)] md:h-8 md:text-[14px]",
    active
      ? "text-[color:var(--color-text-primary)]"
      : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]",
  );

const easePremium = [0.2, 0.8, 0.2, 1] as const;

const menuBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuPanel = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easePremium },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.28, ease: easePremium },
  },
};

const menuContent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const menuItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: easePremium },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.2, ease: easePremium },
  },
};

const navList = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

export function Header({ variant = "default" }: HeaderProps) {
  const dict = useDict();
  const sectionBadge =
    variant === "analyze"
      ? dict.analyze.badge
      : variant === "docs"
        ? dict.docs.meta.eyebrow
        : variant === "contact"
          ? dict.contact.title
          : null;
  const activeHref =
    variant === "analyze" ? "/analyze" : variant === "docs" ? "/docs" : null;
  const navItems = useMemo(
    () =>
      [
        { label: dict.header.nav.home, href: "/" },
        { label: dict.header.nav.analyze, href: "/analyze" },
        { label: dict.header.nav.docs, href: "/docs" },
      ] as const,
    [dict],
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "site-header relative !fixed inset-x-0 top-0 z-[100] max-w-full overflow-x-clip h-[var(--header-height)]",
        scrolled && "site-header--scrolled",
      )}
    >
      <ScrollProgress />
      <Container
        as="nav"
        className="flex h-full min-w-0 items-center justify-between gap-3"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6 md:gap-10">
          <Logo className="shrink-0" />
          {sectionBadge ? (
            <Badge
              variant="eyebrow"
              className="hidden min-w-0 max-w-[9rem] overflow-hidden truncate sm:max-w-[11rem] md:inline-flex lg:max-w-none"
            >
              {sectionBadge}
            </Badge>
          ) : null}
          <ul className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    activeHref && item.href === activeHref ? "page" : undefined
                  }
                  className={navLinkClass(
                    Boolean(activeHref && item.href === activeHref),
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -bottom-px hidden h-[1.5px] origin-left scale-x-0 rounded-full bg-[image:var(--signature-gradient)] opacity-0 transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover/nav:scale-x-100 group-hover/nav:opacity-100 md:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <ThemeToggle />
          <LangSwitcher />
          {variant === "analyze" ? (
            <Button href="/" variant="ghost" size="sm">
              {dict.analyze.backHome}
            </Button>
          ) : (
            <Button href="/analyze" size="sm">
              {dict.header.cta}
            </Button>
          )}
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-primary)] transition-[border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          aria-label={menuOpen ? dict.header.menuClose : dict.header.menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="close"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, rotate: -90, scale: 0.85 }
                }
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={
                  reducedMotion
                    ? undefined
                    : { opacity: 0, rotate: 90, scale: 0.85 }
                }
                transition={{ duration: 0.22, ease: easePremium }}
                className="flex items-center justify-center"
                aria-hidden
              >
                <X size={18} strokeWidth={1.75} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, rotate: 90, scale: 0.85 }
                }
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={
                  reducedMotion
                    ? undefined
                    : { opacity: 0, rotate: -90, scale: 0.85 }
                }
                transition={{ duration: 0.22, ease: easePremium }}
                className="flex items-center justify-center"
                aria-hidden
              >
                <Menu size={18} strokeWidth={1.75} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              key="menu-backdrop"
              type="button"
              aria-label={dict.header.menuClose}
              className="fixed inset-0 top-[var(--header-height)] z-[90] bg-[color:var(--color-canvas)]/60 backdrop-blur-sm md:hidden"
              variants={menuBackdrop}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.32, ease: easePremium }}
              onClick={closeMenu}
            />
            <motion.div
              key="menu-panel"
              id="site-mobile-menu"
              className="glass-strong fixed inset-x-0 top-[var(--header-height)] z-[95] max-h-[calc(100dvh-var(--header-height))] max-w-full overflow-x-clip overflow-y-auto border-b border-[color:var(--color-border-subtle)] shadow-[0_16px_48px_-24px_rgb(0_0_0/0.45)] md:hidden"
              variants={reducedMotion ? menuBackdrop : menuPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Container className="py-6">
                <motion.div
                  className="flex flex-col gap-6"
                  variants={reducedMotion ? undefined : menuContent}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {sectionBadge ? (
                    <motion.div variants={reducedMotion ? undefined : menuItem}>
                      <Badge variant="eyebrow" className="w-fit sm:hidden">
                        {sectionBadge}
                      </Badge>
                    </motion.div>
                  ) : null}

                  <motion.div variants={reducedMotion ? undefined : menuItem}>
                    <motion.ul
                      className="flex flex-col gap-1"
                      variants={reducedMotion ? undefined : navList}
                    >
                      {navItems.map((item) => (
                        <motion.li
                          key={item.href}
                          variants={reducedMotion ? undefined : menuItem}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            aria-current={
                              activeHref && item.href === activeHref
                                ? "page"
                                : undefined
                            }
                            className={navLinkClass(
                              Boolean(activeHref && item.href === activeHref),
                            )}
                          >
                            {item.label}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>

                  <motion.div
                    variants={reducedMotion ? undefined : menuItem}
                    className="flex min-w-0 items-center justify-between gap-4 border-t border-[color:var(--color-border-subtle)] pt-5"
                  >
                    <span className="shrink-0 text-[12px] font-medium text-[color:var(--color-text-subtle)]">
                      {dict.meta.langLabel}
                    </span>
                    <div className="flex min-w-0 shrink-0 items-center gap-3">
                      <ThemeToggle />
                      <LangSwitcher />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={reducedMotion ? undefined : menuItem}
                    className="flex flex-col gap-3"
                  >
                    {variant === "analyze" ? (
                      <Button
                        href="/"
                        variant="outline"
                        size="md"
                        className="w-full"
                        onClick={closeMenu}
                      >
                        {dict.analyze.backHome}
                      </Button>
                    ) : (
                      <Button
                        href="/analyze"
                        size="md"
                        className="w-full"
                        onClick={closeMenu}
                      >
                        {dict.header.cta}
                      </Button>
                    )}
                  </motion.div>
                </motion.div>
              </Container>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
