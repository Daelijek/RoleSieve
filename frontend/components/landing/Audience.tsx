"use client";

import { Quote, User, UserCheck, LineChart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Spotlight } from "@/components/ui/Spotlight";
import { SectionHeader } from "./SectionHeader";
import { useDict } from "@/lib/i18n";

const personaIcons = [User, UserCheck, LineChart];
const personaAccents: Array<"violet" | "coral" | "aqua"> = [
  "violet",
  "coral",
  "aqua",
];

const accentClasses: Record<"violet" | "coral" | "aqua", string> = {
  violet: "text-violet",
  coral: "text-coral",
  aqua: "text-aqua",
};

export function Audience() {
  const dict = useDict();
  const a = dict.audience;
  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <div id="audience-title">
          <SectionHeader eyebrow={a.eyebrow} title={a.title} />
        </div>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {a.personas.map((p, i) => {
            const Icon = personaIcons[i] ?? User;
            const accent = personaAccents[i] ?? "violet";
            return (
              <li key={p.role}>
                <Spotlight
                  tint={accent}
                  size={420}
                  intensity={0.1}
                  className="group relative h-full overflow-hidden rounded-3xl p-5 sm:p-7 bg-neutral-300/20 hover:bg-neutral-300/30 dark:bg-neutral-400/20 dark:hover:bg-neutral-400/30 backdrop-blur-[1px] border border-neutral-400/20 transition-all duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:shadow-xl"
                >
                  <div aria-hidden className="hairline-specular" />
                  <div className="relative flex items-center gap-3">
                    <span
                      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-400/25 bg-neutral-300/25 dark:bg-neutral-400/25 sm:h-12 sm:w-12 shadow-sm ${accentClasses[accent]}`}
                    >
                      <Icon size={20} strokeWidth={1.75} />
                      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-neutral-400/20" />
                    </span>
                    <h3 className="text-[17px] font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-[18px]">
                      {p.role}
                    </h3>
                  </div>

                  <div className="relative mt-5 rounded-2xl border border-neutral-400/20 bg-neutral-300/15 dark:bg-neutral-400/15 backdrop-blur-xs p-4 sm:mt-6 sm:p-5">
                    <Quote
                      aria-hidden
                      size={18}
                      className={`absolute -top-2 left-4 rounded-md bg-[color:var(--color-surface-2)] px-1 ${accentClasses[accent]}`}
                    />
                    <p className="text-[15px] leading-[1.55] text-[color:var(--color-text-primary)]">
                      {p.quote}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {p.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-[color:var(--color-text-muted)]"
                      >
                        <span
                          aria-hidden
                          className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${accent === "violet" ? "bg-violet" : accent === "coral" ? "bg-coral" : "bg-aqua"}`}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Spotlight>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
