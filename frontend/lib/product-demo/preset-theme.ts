import type { ProductPresetId } from "./types";

/**
 * Per-segment accent colors, using the technologies/roles each segment is
 * commonly associated with. Values are raw `R G B` channel strings so they
 * can be composed as `rgb(<channels> / <alpha>)` in inline styles and CSS
 * custom properties, independent of the theme tokens in globals.css.
 *
 * Primary hues are deliberately placed far apart on the color wheel so no
 * two segments look alike: blue / orange / magenta / green.
 *
 * - python   → Python blue + yellow
 * - frontend → orange + React cyan
 * - product  → magenta + violet
 * - devops   → green + lime
 */
export type PresetTheme = {
  /** Primary accent (dominates the picker, zone glow, popover and backdrop). */
  primary: string;
  /** Secondary accent (used for the complementary background blobs). */
  secondary: string;
};

export const PRESET_THEME: Record<ProductPresetId, PresetTheme> = {
  python: { primary: "59 130 246", secondary: "250 204 21" },
  frontend: { primary: "251 146 60", secondary: "34 211 238" },
  product: { primary: "217 70 239", secondary: "139 92 246" },
  devops: { primary: "34 197 94", secondary: "132 204 22" },
};

/** Primary accent channels for a segment (`R G B`). */
export function presetAccent(id: ProductPresetId): string {
  return PRESET_THEME[id].primary;
}
