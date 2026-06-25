import * as React from "react";
import Link from "next/link";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { GridCard } from "@/components/ui/grid-card";

type NavItemType = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navTriggerClass =
  "nav-menu-trigger group/trigger inline-flex w-max items-center justify-center rounded-lg px-4 py-1.5 text-sm font-medium outline-none transition-[background,color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-premium)] hover:nav-menu-trigger-hover focus-visible:nav-menu-trigger-hover data-[state=open]:nav-menu-trigger-open focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-canvas)] disabled:pointer-events-none disabled:opacity-50";

const navLinkClass =
  "nav-menu-item flex outline-none transition-[background,color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-premium)] hover:nav-menu-item-hover focus-visible:nav-menu-item-hover focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-canvas)] [&_svg:not([class*='text-'])]:text-[color:var(--color-text-muted)]";

const navPanelClass =
  "nav-menu-panel text-[color:var(--color-text-primary)]";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative z-50 flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navTriggerClass, className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 text-[color:var(--color-text-subtle)] transition duration-300 group-data-[state=open]/trigger:rotate-180 group-data-[state=open]/trigger:text-[color:var(--color-text-muted)]"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  align = "trigger",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content> & {
  align?: "trigger" | "header-center";
}) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      data-align={align}
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-xl group-data-[viewport=false]/navigation-menu:duration-300 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        align === "header-center" && [
          navPanelClass,
          "!fixed !left-1/2 !top-[var(--header-height)] z-[99] !mt-2 w-[min(calc(100vw-2.5rem),56rem)] max-w-7xl -translate-x-1/2 overflow-hidden rounded-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        ],
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 isolate z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          navPanelClass,
          "origin-top-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        navLinkClass,
        "flex-col justify-center gap-1 rounded-lg px-4 py-1.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[color:var(--color-border-strong)] shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

function NavGridCard({
  link,
  ...props
}: React.ComponentProps<"div"> & {
  link: NavItemType;
}) {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <Link
        href={link.href}
        className="group/grid-card block h-full outline-none"
      >
        <GridCard {...props}>
          {link.icon && (
            <link.icon className="relative size-5 text-violet" />
          )}
          <div className="relative">
            <span className="text-sm font-medium text-[color:var(--color-text-primary)]">
              {link.title}
            </span>
            {link.description && (
              <p className="mt-2 text-xs text-[color:var(--color-text-muted)]">
                {link.description}
              </p>
            )}
          </div>
        </GridCard>
      </Link>
    </NavigationMenuPrimitive.Link>
  );
}

function NavSmallItem({
  item,
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & {
  item: Omit<NavItemType, "description">;
}) {
  return (
    <NavigationMenuLink
      className={cn(
        "group/nav-item relative h-max flex-row items-center gap-x-3 rounded-lg px-2 py-2",
        className,
      )}
      {...props}
    >
      {item.icon && <item.icon className="size-4 text-[color:var(--color-text-muted)]" />}
      <p className="text-sm text-[color:var(--color-text-primary)]">{item.title}</p>
      <div className="relative ml-auto flex h-full w-4 items-center">
        <ArrowRightIcon className="size-4 -translate-x-2 text-violet opacity-0 transition-all duration-[var(--duration-fast)] ease-[var(--ease-premium)] group-hover/nav-item:translate-x-0 group-hover/nav-item:opacity-100" />
      </div>
    </NavigationMenuLink>
  );
}

function NavLargeItem({
  link,
  className,
  ...props
}: Omit<React.ComponentProps<typeof NavigationMenuLink>, "children"> & {
  link: NavItemType;
}) {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <Link
        href={link.href}
        className={cn(
          navLinkClass,
          "group relative flex h-full w-full min-w-0 flex-col justify-center rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)] p-0 hover:border-[color:var(--color-border-strong)]",
          className,
        )}
        {...(props as Omit<React.ComponentProps<typeof Link>, "href" | "className">)}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0 flex-1 space-y-1">
            <span className="text-sm leading-none font-medium text-[color:var(--color-text-primary)]">
              {link.title}
            </span>
            {link.description && (
              <p className="line-clamp-1 text-xs text-[color:var(--color-text-muted)]">
                {link.description}
              </p>
            )}
          </div>
          {link.icon && (
            <link.icon className="size-6 shrink-0 text-[color:var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] group-hover:text-violet" />
          )}
        </div>
      </Link>
    </NavigationMenuPrimitive.Link>
  );
}

function NavItemMobile({
  item,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  item: NavItemType;
}) {
  return (
    <a
      className={cn(
        navLinkClass,
        "group relative flex gap-x-2 rounded-lg p-2 text-sm [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-2)]">
        {item.icon && (
          <item.icon className="text-[color:var(--color-text-muted)] group-hover:text-violet" />
        )}
      </div>
      <div className="flex h-10 min-w-0 flex-col justify-center">
        <p className="text-sm text-[color:var(--color-text-primary)]">{item.title}</p>
        {item.description ? (
          <span className="line-clamp-1 text-xs leading-snug text-[color:var(--color-text-muted)]">
            {item.description}
          </span>
        ) : null}
      </div>
    </a>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavGridCard,
  NavSmallItem,
  NavLargeItem,
  NavItemMobile,
  type NavItemType,
};
