"use client";

import { cn } from "@/lib/cn";
import type { ProductPresetId } from "@/lib/product-demo/types";
import { PRODUCT_PRESET_IDS } from "@/lib/product-demo/preset-ids";
import { presetAccent } from "@/lib/product-demo/preset-theme";
import { PRESET_ICON } from "@/components/product/preset-icons";
import { useDict } from "@/lib/i18n";

type ProductPresetPickerProps = {
  label: string;
  value: ProductPresetId;
  onChange: (id: ProductPresetId) => void;
};

export function ProductPresetPicker({
  label,
  value,
  onChange,
}: ProductPresetPickerProps) {
  const dict = useDict();

  return (
    <div className="mb-10 text-center">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
        {label}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {PRODUCT_PRESET_IDS.map((id) => {
          const active = value === id;
          const title = dict.tryIt.presets[id].title;
          const accent = presetAccent(id);
          const Icon = PRESET_ICON[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={active}
              style={
                active
                  ? {
                      borderColor: `rgb(${accent} / 0.55)`,
                      backgroundColor: `rgb(${accent} / 0.14)`,
                      boxShadow: `0 0 24px -6px rgb(${accent} / 0.45)`,
                    }
                  : undefined
              }
              className={cn(
                "group inline-flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-[14px] font-medium transition-[color,border-color,background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)]",
                active
                  ? "text-[color:var(--color-text-primary)]"
                  : "border-[color:var(--color-border-subtle)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text-primary)]",
              )}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                style={active ? { color: `rgb(${accent})` } : undefined}
                className={cn(
                  !active && "text-[color:var(--color-text-subtle)]",
                )}
              />
              {title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
