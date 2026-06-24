/**
 * Helpers mapping launcher selections to HeadHunter API codes accepted by the
 * backend `AutoSearchExportBody` (`web/schemas.py`).
 *
 * Option lists (region presets, work formats, experiences, periods) live in
 * `lib/i18n` as `{ id, label }` / `{ days, label }` objects so the HH codes stay
 * locale-independent while the labels are localized. That avoids fragile
 * label-to-id lookups that would break between ru/en.
 *
 * Notes / limitations:
 * - HH `area` accepts a numeric region id (e.g. Москва = "1"), not a name, so
 *   free-text regions are resolved to an id via `/suggests/areas` autocomplete.
 * - Backend caps `period` to 1..30 days, so longer values are clamped to 30.
 */

export const PERIOD_MAX_DAYS = 30;

/** Clamp a period in days to the backend-supported range; undefined if invalid. */
export function clampPeriodDays(days: number): number | undefined {
  if (!Number.isFinite(days) || days <= 0) return undefined;
  return Math.min(Math.round(days), PERIOD_MAX_DAYS);
}

/** Empty string ids ("any" option) and falsy values become undefined (no filter). */
export function filterValue(id: string): string | undefined {
  const v = id.trim();
  return v ? v : undefined;
}
