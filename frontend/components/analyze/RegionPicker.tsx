"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { getDict } from "@/lib/i18n";
import { isAbortError, suggestAreas, type AreaSuggestion } from "@/lib/api/client";

const dict = getDict();

export type RegionValue = { id: string; label: string };

type RegionPickerProps = {
  value: RegionValue;
  onChange: (value: RegionValue) => void;
  disabled?: boolean;
};

const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;

export function RegionPicker({ value, onChange, disabled }: RegionPickerProps) {
  const t = dict.analyze.launcher;
  const presets = t.regionPresets;

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<AreaSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const presetIds: string[] = presets.map((p) => p.id);
  const isCustom = value.id !== "" && !presetIds.includes(value.id);

  useEffect(() => {
    const q = text.trim();

    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      if (q.length < MIN_CHARS) {
        setResults([]);
        setLoading(false);
        setErrored(false);
        return;
      }
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      setErrored(false);
      try {
        const items = await suggestAreas(q, ac.signal);
        setResults(items);
        setOpen(true);
      } catch (e) {
        if (isAbortError(e)) return;
        setResults([]);
        setErrored(true);
        setOpen(true);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [text]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function selectPreset(preset: RegionValue) {
    onChange({ id: preset.id, label: preset.label });
  }

  function selectSuggestion(item: AreaSuggestion) {
    onChange({ id: item.id, label: item.text });
    setText("");
    setResults([]);
    setOpen(false);
  }

  function clearCustom() {
    const any = presets[0] ?? { id: "", label: "" };
    onChange({ id: any.id, label: any.label });
  }

  return (
    <div ref={wrapRef} className="relative">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-subtle)]">
        {t.regionLabel}
      </span>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const active = value.id === preset.id;
          return (
            <button
              type="button"
              key={preset.id || "any"}
              onClick={() => selectPreset(preset)}
              disabled={disabled}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] transition-colors duration-[var(--duration-fast)] disabled:opacity-50",
                active
                  ? "border-violet/50 bg-[color:var(--color-violet)]/15 text-[color:var(--color-text-primary)]"
                  : "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/60 text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]",
              )}
            >
              {preset.label}
            </button>
          );
        })}

        {isCustom ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/50 bg-[color:var(--color-violet)]/15 px-3 py-1.5 text-[12.5px] text-[color:var(--color-text-primary)]">
            <MapPin size={12} strokeWidth={2} className="text-violet" />
            {value.label}
            <button
              type="button"
              onClick={clearCustom}
              disabled={disabled}
              aria-label={value.label}
              className="ml-0.5 text-[color:var(--color-text-subtle)] transition-colors hover:text-[color:var(--color-text-primary)] disabled:opacity-50"
            >
              <X size={12} strokeWidth={2.25} />
            </button>
          </span>
        ) : null}
      </div>

      <div className="relative mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder={t.regionSearchPlaceholder}
          disabled={disabled}
          className="w-full rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-canvas)]/70 px-3 py-2 pr-9 text-[13.5px] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-subtle)] outline-none transition-colors focus:border-violet/50 disabled:opacity-60"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-subtle)]">
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Search size={14} />
          )}
        </span>

        {open ? (
          <ul className="absolute z-20 mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] py-1 shadow-[0_16px_48px_-24px_rgb(0_0_0/0.6)] backdrop-blur">
            {errored ? (
              <li className="px-3 py-2 text-[12.5px] text-[color:var(--color-text-muted)]">
                {t.regionSearchError}
              </li>
            ) : results.length === 0 ? (
              <li className="px-3 py-2 text-[12.5px] text-[color:var(--color-text-subtle)]">
                {loading ? t.regionSearching : t.regionNoResults}
              </li>
            ) : (
              results.map((item) => {
                const active = item.id === value.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectSuggestion(item)}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-surface-2)]"
                    >
                      <span className="truncate">{item.text}</span>
                      {active ? (
                        <Check size={13} strokeWidth={2.5} className="shrink-0 text-violet" />
                      ) : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
