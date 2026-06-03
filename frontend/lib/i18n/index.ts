import { ru, type Dictionary, type Locale } from "./ru";
import { en } from "./en";

export type { Dictionary, Locale } from "./ru";

export const DEFAULT_LOCALE: Locale = "ru";

export const SUPPORTED_LOCALES: Locale[] = ["ru", "en"];

const dictionaries: Record<Locale, Dictionary> = { ru, en: en as unknown as Dictionary };

export function getDict(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] ?? ru;
}

export { LocaleProvider, useDict, useLocale } from "./context";
