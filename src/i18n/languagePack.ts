import { DateTimeFormat, LocaleMessageObject } from "vue-i18n";
import { BROWSER_LANGUAGE } from "./browserLanguage";
import { Locale } from "flatpickr";

export interface LanguagePack {
  language: string;
  messages: LocaleMessageObject;
  dateTimeFormat: DateTimeFormat;
  flatPickrLocale: Locale;
}

export function loadLanguagePack(lang: string): Promise<LanguagePack> {
  switch (lang) {
    case "de":
      return import(/* webpackChunkName: "lang-de" */ "./lang-packs/de").then(
        mod => mod.default as LanguagePack
      );
    default:
      return import(/* webpackChunkName: "lang-en" */ "./lang-packs/en").then(
        mod => mod.default as LanguagePack
      );
  }
}

export function loadBrowserLanguagePack(): Promise<LanguagePack> {
  return loadLanguagePack(BROWSER_LANGUAGE);
}
