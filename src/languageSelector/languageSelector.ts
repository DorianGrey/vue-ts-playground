import Vue from "vue";
import Component from "vue-class-component";

import { LanguagePack, loadLanguagePack } from "../i18n/languagePack";
import { I18N_MODULE_ACTIONS } from "../i18n/state/i18n.state";

@Component
export default class LanguageSelector extends Vue {
  currentLanguage: string;
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

  // Lifecycle
  created(): void {
    this.currentLanguage = (this.$store.getters[
      I18N_MODULE_ACTIONS.GET
    ] as LanguagePack).language;
  }

  langChanged(newLang: string): void {
    if (newLang !== this.currentLanguage) {
      this.currentLanguage = newLang;
      loadLanguagePack(this.currentLanguage).then(langPack => {
        this.$i18n.setDateTimeFormat(
          langPack.language,
          langPack.dateTimeFormat
        );
        this.$i18n.setLocaleMessage(langPack.language, langPack.messages);

        // These two calls will trigger the actual UI update.
        this.$store.commit(I18N_MODULE_ACTIONS.SET, langPack);
        this.$i18n.locale = langPack.language;
      });
    }
  }
}
