import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const sizes: Record<Size, string> = {
  sm: "h-[var(--header-control-height)] px-4 text-[13px] gap-1.5",
  md: "h-11 px-5 text-[14px] gap-2",
  lg: "h-13 px-7 text-[15px] gap-2",
};

const variants: Record<Variant, string> = {
  primary:
    "relative isolate text-white shadow-[var(--glow-button)] hover:shadow-[var(--glow-button-hover)] " +
    "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] " +
    "before:bg-[image:var(--signature-gradient)] hover:before:brightness-110 " +
    "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:pointer-events-none " +
    "after:bg-[image:linear-gradient(180deg,rgba(255,255,255,0.2),transparent_45%)]",
  ghost:
    "text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-2)] border border-transparent hover:border-[color:var(--color-border-subtle)]",
  outline:
    "text-[color:var(--color-text-primary)] bg-[color:var(--color-surface)]/60 border border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)] hover:border-[color:var(--color-border-strong)] backdrop-blur",
};

const base =
  "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap select-none transition-[transform,background,box-shadow,border-color,filter] duration-[var(--duration-base)] ease-[var(--ease-premium)] active:translate-y-px disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-violet focus-visible:outline-offset-2";

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    leading,
    trailing,
    className,
    children,
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const classes = cn(base, sizes[size], variants[variant], className);
  const content = (
    <>
      {leading ? (
        <span className="flex items-center" aria-hidden>
          {leading}
        </span>
      ) : null}
      <span>{children}</span>
      {trailing ? (
        <span className="flex items-center" aria-hidden>
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (typeof (rest as { href?: string }).href === "string") {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});
