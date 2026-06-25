"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  MenuIcon,
  XIcon,
  Home,
  Play,
  FileSpreadsheet,
  Route,
  Sparkles,
  Users,
  Mail,
  Rocket,
  BookOpen,
  LayoutGrid,
  SlidersHorizontal,
  HelpCircle,
  Download,
  ClipboardList,
  GitCompareArrows,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  type NavItemType,
  NavGridCard,
  NavSmallItem,
  NavLargeItem,
  NavItemMobile,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/cn";
import { useDict } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

type HeaderProps = {
  variant?: "default" | "analyze" | "docs" | "contact";
};

type MenuItemDef = {
  id: string;
  href: string;
  title: string;
  description?: string;
};

const NAV_ICONS: Record<string, LucideIcon> = {
  home: Home,
  analyze: Play,
  sample: FileSpreadsheet,
  howItWorks: Route,
  features: Sparkles,
  forWho: Users,
  contact: Mail,
  quickstart: Rocket,
  report: BookOpen,
  overview: LayoutGrid,
  modes: SlidersHorizontal,
  faq: HelpCircle,
  export: Download,
  manual: ClipboardList,
  compare: GitCompareArrows,
};

function toNavItems(items: readonly MenuItemDef[]): NavItemType[] {
  return items.map((item) => ({
    title: item.title,
    href: item.href,
    description: item.description,
    icon: NAV_ICONS[item.id],
  }));
}

function useHeaderNav(dict: Dictionary) {
  return useMemo(
    () => ({
      productCards: toNavItems(dict.header.productMenu.cards),
      productLinks: toNavItems(dict.header.productMenu.links),
      docsCards: toNavItems(dict.header.docsMenu.cards),
      docsBottom: toNavItems(dict.header.docsMenu.bottom),
      docsSide: toNavItems(dict.header.docsMenu.side),
      productMobile: toNavItems([
        ...dict.header.productMenu.cards,
        ...dict.header.productMenu.links,
      ]),
      docsMobile: toNavItems([
        ...dict.header.docsMenu.cards,
        ...dict.header.docsMenu.bottom,
        ...dict.header.docsMenu.side,
      ]),
    }),
    [dict],
  );
}

export function Header({ variant = "default" }: HeaderProps) {
  const dict = useDict();
  const nav = useHeaderNav(dict);
  const sectionBadge =
    variant === "analyze"
      ? dict.analyze.badge
      : variant === "docs"
        ? dict.docs.meta.eyebrow
        : variant === "contact"
          ? dict.contact.title
          : null;
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
        "site-header relative !fixed inset-x-0 top-0 z-[100] h-[var(--header-height)] max-w-full !overflow-visible",
        scrolled && "site-header--scrolled",
      )}
    >
      <ScrollProgress />
      <Container
        as="nav"
        className="relative flex h-full min-w-0 items-center justify-between"
      >
        <div className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4">
          <Logo className="shrink-0" />
          {sectionBadge ? (
            <Badge
              variant="eyebrow"
              className="hidden min-w-0 max-w-[9rem] overflow-hidden truncate sm:max-w-[11rem] md:inline-flex lg:max-w-none"
            >
              {sectionBadge}
            </Badge>
          ) : null}
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <DesktopMenu dict={dict} nav={nav} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <LangSwitcher />
          </div>
          {variant === "analyze" ? (
            <Button
              href="/"
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              {dict.analyze.backHome}
            </Button>
          ) : (
            <Button
              href="/analyze"
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              {dict.header.cta}
            </Button>
          )}
          <MobileNav
            dict={dict}
            nav={nav}
            variant={variant}
            sectionBadge={sectionBadge}
            ctaLabel={
              variant === "analyze" ? dict.analyze.backHome : dict.header.cta
            }
            ctaHref={variant === "analyze" ? "/" : "/analyze"}
            langLabel={dict.meta.langLabel}
          />
        </div>
      </Container>
    </header>
  );
}

function DesktopMenu({
  dict,
  nav,
}: {
  dict: Dictionary;
  nav: ReturnType<typeof useHeaderNav>;
}) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {dict.header.nav.product}
          </NavigationMenuTrigger>
          <NavigationMenuContent align="header-center">
            <div className="grid w-full md:w-4xl md:grid-cols-[1fr_.30fr]">
              <ul className="m-0 grid grow list-none gap-4 p-4 md:grid-cols-3 md:border-r md:border-[color:var(--color-border-subtle)]">
                {nav.productCards.map((link) => (
                  <li key={link.href}>
                    <NavGridCard link={link} />
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 p-4">
                {nav.productLinks.map((link) => (
                  <li key={link.href}>
                    <NavSmallItem
                      item={link}
                      href={link.href}
                      className="gap-x-1"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{dict.header.nav.docs}</NavigationMenuTrigger>
          <NavigationMenuContent align="header-center">
            <div className="grid w-full md:w-4xl md:grid-cols-[1fr_.40fr]">
              <ul className="m-0 grid grow list-none grid-cols-2 gap-4 p-4 md:border-r md:border-[color:var(--color-border-subtle)]">
                {nav.docsCards.map((link) => (
                  <li key={link.href} className="min-w-0">
                    <NavGridCard link={link} className="min-h-36" />
                  </li>
                ))}
                <li className="col-span-2 min-w-0 list-none">
                  <div className="grid grid-cols-3 gap-4 [&>*]:min-w-0 [&>*]:w-full">
                    {nav.docsBottom.map((link) => (
                      <NavLargeItem key={link.href} link={link} />
                    ))}
                  </div>
                </li>
              </ul>
              <ul className="space-y-2 p-4">
                {nav.docsSide.map((link) => (
                  <li key={link.href}>
                    <NavLargeItem key={link.href} link={link} />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/contact"
              className="nav-menu-trigger cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium transition-[background,color] duration-[var(--duration-fast)] ease-[var(--ease-premium)] hover:nav-menu-trigger-hover"
            >
              {dict.header.nav.contact}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav({
  dict,
  nav,
  variant,
  sectionBadge,
  ctaLabel,
  ctaHref,
  langLabel,
}: {
  dict: Dictionary;
  nav: ReturnType<typeof useHeaderNav>;
  variant: HeaderProps["variant"];
  sectionBadge: string | null;
  ctaLabel: string;
  ctaHref: string;
  langLabel: string;
}) {
  const sections = [
    {
      id: "product",
      label: dict.header.nav.product,
      list: nav.productMobile,
    },
    {
      id: "documentation",
      label: dict.header.nav.docs,
      list: nav.docsMobile,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-full text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-violet focus-visible:outline-offset-2 lg:hidden"
      >
        <MenuIcon className="size-5" />
        <span className="sr-only">{dict.header.menuOpen}</span>
      </SheetTrigger>
      <SheetContent
        className="nav-menu-panel w-full gap-0 border-[color:var(--color-border-subtle)]"
        showClose={false}
      >
        <div className="flex h-14 items-center justify-end border-b border-[color:var(--color-border-subtle)] px-4">
          <SheetClose
            className="inline-flex size-10 items-center justify-center rounded-full text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-violet focus-visible:outline-offset-2"
          >
            <XIcon className="size-5" />
            <span className="sr-only">{dict.header.menuClose}</span>
          </SheetClose>
        </div>
        <div className="grid gap-y-2 overflow-y-auto px-4 pt-5 pb-12">
          {sectionBadge ? (
            <Badge variant="eyebrow" className="mb-2 w-fit">
              {sectionBadge}
            </Badge>
          ) : null}
          <Accordion type="single" collapsible>
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-[color:var(--color-text-primary)] hover:no-underline">
                  {section.label}
                </AccordionTrigger>
                <AccordionContent className="space-y-1">
                  <ul className="grid gap-1">
                    {section.list.map((link) => (
                      <li key={link.href}>
                        <SheetClose asChild>
                          <NavItemMobile item={link} href={link.href} />
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-4 flex items-center justify-between gap-4 border-t pt-5">
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {langLabel}
            </span>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LangSwitcher />
            </div>
          </div>
          <Button
            href={ctaHref}
            className="mt-4 w-full"
            variant={variant === "analyze" ? "outline" : "primary"}
          >
            {ctaLabel}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
