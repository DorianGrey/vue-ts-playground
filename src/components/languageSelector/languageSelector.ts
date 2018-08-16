import Vue from "vue";
import Component from "vue-class-component";

import { LanguagePack, loadLanguagePack } from "@/i18n/languagePack";
import {
  I18N_MODULE_GETTERS,
  I18N_MODULE_MUTATIONS,
  I18nSpace
} from "@/i18n/state/i18n.state";

@Component
export default class LanguageSelector extends Vue {
  @I18nSpace.Getter(I18N_MODULE_GETTERS.LANG)
  readonly currentLanguage: string;

  @I18nSpace.Mutation(I18N_MODULE_MUTATIONS.SET)
  readonly setLanguage: (langPack: LanguagePack) => void;

  languages = [
    {
      key: "de",
      value: "languages.de"
    },
    {
      key: "en",
      value: "languages.en"
    }
  ];

  langChanged(newLang: string): void {
    if (newLang !== this.currentLanguage) {
      loadLanguagePack(newLang).then(langPack => {
        this.$i18n.setDateTimeFormat(
          langPack.language,
          langPack.dateTimeFormat
        );
        this.$i18n.setLocaleMessage(langPack.language, langPack.messages);

        // These two calls will trigger the actual UI update.
        this.setLanguage(langPack);
        this.$i18n.locale = langPack.language;
      });
    }
  }
}
