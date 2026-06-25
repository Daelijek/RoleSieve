"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";
import { useDict } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type ChannelId = "telegram" | "linkedin" | "github" | "email";

function BrandIcon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <BrandIcon className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </BrandIcon>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <BrandIcon className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </BrandIcon>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <BrandIcon className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </BrandIcon>
  );
}

function ChannelIcon({ id, className }: { id: ChannelId; className?: string }) {
  switch (id) {
    case "telegram":
      return <TelegramIcon className={className} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "github":
      return <GitHubIcon className={className} />;
    case "email":
      return <Mail size={18} strokeWidth={1.75} className={className} />;
  }
}

const CHANNEL_TINT: Record<ChannelId, string> = {
  telegram: "text-sky-400",
  linkedin: "text-[#0A66C2]",
  github: "text-[color:var(--color-text-primary)]",
  email: "text-violet",
};

export function ContactContent() {
  const c = useDict().contact;

  return (
    <>
      <header className="mb-10 max-w-2xl">
        <h1 className="text-[clamp(1.875rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[color:var(--color-text-primary)]">
          {c.title}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--color-text-muted)] sm:text-[16px]">
          {c.lead}
        </p>
      </header>

      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
          {c.channelsTitle}
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {c.channels.map((channel) => {
            const isExternal = channel.href.startsWith("http");
            const className = cn(
              "glass group flex h-full w-full items-start gap-4 rounded-2xl border border-[color:var(--color-border-strong)] p-5 transition-colors hover:border-violet/40 sm:p-6",
            );

            const content = (
              <>
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]",
                    CHANNEL_TINT[channel.id as ChannelId],
                  )}
                >
                  <ChannelIcon
                    id={channel.id as ChannelId}
                    className="h-[18px] w-[18px]"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[15px] font-semibold text-[color:var(--color-text-primary)]">
                    {channel.label}
                    {isExternal ? (
                      <ExternalLink
                        size={14}
                        className="text-[color:var(--color-text-subtle)] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    ) : null}
                  </span>
                  <span className="mt-1 block font-mono text-[12px] text-violet/90">
                    {channel.display}
                  </span>
                  <span className="mt-1.5 block min-h-[2.75rem] text-[14px] leading-[1.6] text-[color:var(--color-text-muted)]">
                    {channel.description}
                  </span>
                </span>
              </>
            );

            return (
              <li key={channel.id} className="flex">
                {isExternal ? (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <a href={channel.href} className={className}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-10 text-[14px] text-[color:var(--color-text-muted)]">
        {c.docsHint}{" "}
        <Link
          href="/docs"
          className="font-medium text-violet underline-offset-2 transition-colors hover:underline"
        >
          {c.docsLink}
        </Link>
        .
      </p>
    </>
  );
}
