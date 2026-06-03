import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { getDict } from "@/lib/i18n";

const dict = getDict();

export function Footer() {
  const f = dict.footer;
  return (
    <footer className="relative mt-10 border-t border-[color:var(--color-border-subtle)] pt-16 pb-10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[14px] leading-[1.6] text-[color:var(--color-text-muted)]">
              {f.tagline}
            </p>
            <div className="mt-6 inline-flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                {dict.meta.langLabel}
              </span>
              <LangSwitcher comingSoonLabel={dict.meta.comingSoon} />
            </div>
          </div>

          {f.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-primary)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--color-border-subtle)] pt-6 text-[12px] text-[color:var(--color-text-subtle)] sm:flex-row sm:items-center">
          <span>{f.copyright}</span>
          <span className="inline-flex items-center gap-2 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
            v0.1 · status: ok
          </span>
        </div>
      </Container>
    </footer>
  );
}
