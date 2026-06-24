"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDict } from "@/lib/i18n";

export function DocPageHeader({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-10">
      <h1 className="text-[clamp(1.875rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)]">
        {title}
      </h1>
      {lead ? (
        <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-[1.65] text-[color:var(--color-text-muted)] sm:text-[16px]">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

export function DocSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-12 first:mt-0", className)}>
      {title ? (
        <h2 className="mb-4 text-[20px] font-semibold tracking-[-0.015em] text-[color:var(--color-text-primary)] sm:text-[22px]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function DocProse({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14.5px] leading-[1.7] text-[color:var(--color-text-muted)] sm:text-[15px]">
      {children}
    </p>
  );
}

export function DocList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-violet/40 bg-[color:var(--color-violet)]/12 text-violet"
          >
            <Check size={12} strokeWidth={2.5} />
          </span>
          <span className="text-[14.5px] leading-[1.65] text-[color:var(--color-text-muted)] sm:text-[15px]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function DocSteps({
  steps,
}: {
  steps: readonly { title: string; description: string }[];
}) {
  return (
    <ol className="mt-2 space-y-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="flex items-start gap-4 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40 p-5 backdrop-blur"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-violet)]/15 font-mono text-[13px] font-semibold text-violet shadow-[0_0_12px_rgb(var(--rgb-violet)/0.35)]">
            {i + 1}
          </span>
          <div>
            <h3 className="text-[15px] font-medium text-[color:var(--color-text-primary)] sm:text-[16px]">
              {step.title}
            </h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[color:var(--color-text-muted)]">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DocCallout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-violet/25 bg-[color:var(--color-violet)]/8 p-5">
      {title ? (
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-violet">
          {title}
        </p>
      ) : null}
      <p
        className={cn(
          "text-[14px] leading-[1.65] text-[color:var(--color-text-muted)]",
          title && "mt-2",
        )}
      >
        {children}
      </p>
    </div>
  );
}

export function DocTable({
  head,
  rows,
}: {
  head: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
}) {
  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[color:var(--color-surface-2)]/50">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t border-[color:var(--color-border-subtle)] align-top"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "px-4 py-3 text-[14px] leading-[1.6]",
                    ci === 0
                      ? "font-mono text-[13px] text-[color:var(--color-text-primary)]"
                      : "text-[color:var(--color-text-muted)]",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocDefList({
  items,
}: {
  items: readonly { term: string; description: string }[];
}) {
  return (
    <dl className="mt-2 divide-y divide-[color:var(--color-border-subtle)] overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6"
        >
          <dt className="text-[14px] font-medium text-[color:var(--color-text-primary)]">
            {item.term}
          </dt>
          <dd className="text-[14px] leading-[1.6] text-[color:var(--color-text-muted)]">
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DocCardLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group/card flex flex-col rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface)]/40 p-5 backdrop-blur transition-[border-color,background,transform] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-violet/40 hover:bg-[color:var(--color-surface-2)]/40"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-[15px] font-medium text-[color:var(--color-text-primary)]">
          {title}
        </span>
        <ArrowRight
          size={16}
          strokeWidth={2}
          className="shrink-0 text-[color:var(--color-text-subtle)] transition-[transform,color] duration-[var(--duration-base)] group-hover/card:translate-x-0.5 group-hover/card:text-violet"
        />
      </span>
      <span className="mt-2 text-[13.5px] leading-[1.55] text-[color:var(--color-text-muted)]">
        {description}
      </span>
    </Link>
  );
}

export function DocPrevNext({ currentSlug }: { currentSlug: string }) {
  const dict = useDict();
  const items = dict.docs.nav.items;
  const idx = items.findIndex((it) => it.slug === currentSlug);
  const prev = idx > 0 ? items[idx - 1] : null;
  const next = idx >= 0 && idx < items.length - 1 ? items[idx + 1] : null;

  const hrefFor = (slug: string) => (slug ? `/docs/${slug}` : "/docs");

  return (
    <nav className="mt-16 grid gap-4 border-t border-[color:var(--color-border-subtle)] pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={hrefFor(prev.slug)}
          className="group/nav flex flex-col rounded-2xl border border-[color:var(--color-border-subtle)] p-4 transition-colors hover:border-violet/40 hover:bg-[color:var(--color-surface-2)]/30"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            <ArrowLeft size={13} strokeWidth={2} />
            {dict.docs.prevNext.prevLabel}
          </span>
          <span className="mt-1 text-[14px] font-medium text-[color:var(--color-text-primary)]">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={hrefFor(next.slug)}
          className="group/nav flex flex-col items-end rounded-2xl border border-[color:var(--color-border-subtle)] p-4 text-right transition-colors hover:border-violet/40 hover:bg-[color:var(--color-surface-2)]/30 sm:col-start-2"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
            {dict.docs.prevNext.nextLabel}
            <ArrowRight size={13} strokeWidth={2} />
          </span>
          <span className="mt-1 text-[14px] font-medium text-[color:var(--color-text-primary)]">
            {next.label}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
