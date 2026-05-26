import { ClipboardList, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Spotlight } from "@/components/ui/Spotlight";
import { SectionHeader } from "./SectionHeader";
import { getDict } from "@/lib/i18n";

const dict = getDict();

const cardClasses =
  "group glass relative overflow-hidden rounded-3xl p-7 transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] sm:p-9";

export function TwoModes() {
  const m = dict.modes;
  return (
    <section
      id="modes"
      aria-labelledby="modes-title"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <div id="modes-title">
          <SectionHeader
            eyebrow={m.eyebrow}
            title={m.title}
            description={m.subtitle}
          />
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {/* Manual mode */}
          <Spotlight color="139,108,255" size={480} className={cardClasses}>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(139,108,255,0.25),_transparent_70%)] blur-2xl"
            />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-violet">
                  <ClipboardList size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                    01 · {m.manual.label}
                  </span>
                  <h3 className="mt-1 text-[20px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                    {m.manual.tagline}
                  </h3>
                </div>
              </div>
            </div>
            <p className="relative mt-4 text-[15px] leading-[1.6] text-[color:var(--color-text-muted)]">
              {m.manual.hint}
            </p>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/60">
              <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {m.manual.mockTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {m.manual.mockLines.length}{" "}
                  <span className="text-[color:var(--color-text-subtle)]">
                    вакансии
                  </span>
                </span>
              </div>
              <ul className="divide-y divide-[color:var(--color-border-subtle)] font-mono text-[12.5px]">
                {m.manual.mockLines.map((line, i) => (
                  <li
                    key={line}
                    className="flex items-center gap-3 px-4 py-2.5 text-[color:var(--color-text-primary)]"
                  >
                    <span className="w-5 text-right text-[color:var(--color-text-subtle)]">
                      {i + 1}
                    </span>
                    <span className="truncate">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Spotlight>

          {/* Auto mode */}
          <Spotlight color="255,106,90" size={480} className={cardClasses}>
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,106,90,0.22),_transparent_70%)] blur-2xl"
            />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] text-coral">
                  <SlidersHorizontal size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                    02 · {m.auto.label}
                  </span>
                  <h3 className="mt-1 text-[20px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                    {m.auto.tagline}
                  </h3>
                </div>
              </div>
            </div>
            <p className="relative mt-4 text-[15px] leading-[1.6] text-[color:var(--color-text-muted)]">
              {m.auto.hint}
            </p>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-canvas)]/60">
              <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                  {m.auto.mockTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
                  HH search API
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-px bg-[color:var(--color-border-subtle)]">
                {m.auto.fields.map((f) => (
                  <div
                    key={f.label}
                    className="bg-[color:var(--color-canvas)]/60 p-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
                      {f.label}
                    </dt>
                    <dd className="mt-1.5 text-[14px] font-medium text-[color:var(--color-text-primary)]">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Spotlight>
        </div>
      </Container>
    </section>
  );
}
