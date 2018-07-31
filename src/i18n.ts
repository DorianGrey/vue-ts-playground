import Vue from "vue";
import VueI18n from "vue-i18n";

import { LanguagePack } from "./i18n/languagePack";

Vue.use(VueI18n);

export default function createI18nDefinition(languagePack: LanguagePack) {
  return new VueI18n({
    locale: languagePack.language, // set locale
    dateTimeFormats: {
      [languagePack.language]: languagePack.dateTimeFormat
    },
    messages: {
      [languagePack.language]: languagePack.messages
    }
  });
}
