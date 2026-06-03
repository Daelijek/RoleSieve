/**
 * Maps human-readable launcher chips (defined in `lib/i18n` `tryIt.regions/experiences/periods`)
 * to HeadHunter API codes accepted by the backend `AutoSearchExportBody` (`web/schemas.py`).
 *
 * Notes / limitations:
 * - "Удалённо" is a schedule on HH, not an area; the backend has no `schedule` field,
 *   so it maps to no area filter.
 * - Backend caps `period` to 1..30 days, so longer periods are clamped to 30.
 */

const AREA_BY_LABEL: Record<string, string> = {
  Москва: "1",
  СПб: "2",
  Алматы: "160",
};

const EXPERIENCE_BY_LABEL: Record<string, string> = {
  "Без опыта": "noExperience",
  "1–3 года": "between1And3",
  "3–6 лет": "between3And6",
  "6+ лет": "moreThan6",
};

const PERIOD_MAX_DAYS = 30;

/** "Москва" → "1"; unknown / "Удалённо" → undefined. */
export function mapRegionToArea(label: string): string | undefined {
  return AREA_BY_LABEL[label];
}

/** "1–3 года" → "between1And3"; "Любой" / unknown → undefined. */
export function mapExperience(label: string): string | undefined {
  return EXPERIENCE_BY_LABEL[label];
}

/** "За 7 дней" → 7; clamps to backend max of 30 days. undefined if unparseable. */
export function mapPeriodToDays(label: string): number | undefined {
  const match = label.match(/\d+/);
  if (!match) return undefined;
  const days = Number(match[0]);
  if (!Number.isFinite(days) || days <= 0) return undefined;
  return Math.min(days, PERIOD_MAX_DAYS);
}
