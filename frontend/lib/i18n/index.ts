import { ru, type Dictionary } from "./ru";
import { en } from "./en";

export type Locale = "ru" | "en";

export const DEFAULT_LOCALE: Locale = "ru";

export const SUPPORTED_LOCALES: Locale[] = ["ru", "en"];

const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDict(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] ?? ru;
}

export type { Dictionary } from "./ru";
