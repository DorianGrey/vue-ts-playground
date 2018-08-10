import VueI18n from "vue-i18n";
import { BROWSER_LANGUAGE } from "./browserLanguage";

export interface LanguagePack {
  language: string;
  messages: VueI18n.LocaleMessageObject;
  dateTimeFormat: VueI18n.DateTimeFormat;
  timeFormat: "ampm" | "24hr";
  firstDayOfWeek: number; // 0 = Sunday
}

export function loadLanguagePack(lang: string): Promise<LanguagePack> {
  /* tslint:disable no-small-switch */
  // Small switch is intended, since other languages might be added.
  switch (lang) {
    case "de":
      return import(/* webpackChunkName: "lang-de" */ "./lang-packs/de/index").then(
        mod => mod.default
      );
    default:
      return import(/* webpackChunkName: "lang-en" */ "./lang-packs/en/index").then(
        mod => mod.default
      );
  }
  /* tslint:enable no-small-switch */
}

export function loadBrowserLanguagePack(): Promise<LanguagePack> {
  return loadLanguagePack(BROWSER_LANGUAGE);
}
