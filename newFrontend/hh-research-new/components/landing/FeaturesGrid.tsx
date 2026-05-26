import {
  Sparkles,
  MessageSquare,
  FileSpreadsheet,
  ShieldCheck,
  Layers,
  History,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Spotlight } from "@/components/ui/Spotlight";
import { SectionHeader } from "./SectionHeader";
import { getDict } from "@/lib/i18n";

const dict = getDict();

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  MessageSquare,
  FileSpreadsheet,
  ShieldCheck,
  Layers,
  History,
};

export function FeaturesGrid() {
  const f = dict.features;
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative py-20 sm:py-28"
    >
      <Container>
        <div id="features-title">
          <SectionHeader eyebrow={f.eyebrow} title={f.title} />
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {f.items.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            const violet = i % 2 === 0;
            return (
              <li key={item.title}>
                <Spotlight
                  color={violet ? "139,108,255" : "255,106,90"}
                  size={360}
                  intensity={0.1}
                  className="group glass relative h-full overflow-hidden rounded-2xl p-6 transition-[transform,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
                >
                  <div className="relative flex items-start gap-4">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-xl bg-[var(--signature-gradient-soft)] opacity-60"
                      />
                      <Icon
                        size={18}
                        strokeWidth={1.75}
                        className={
                          violet ? "relative text-violet" : "relative text-coral"
                        }
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-[1.55] text-[color:var(--color-text-muted)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Spotlight>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
