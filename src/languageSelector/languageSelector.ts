import { Component, Lifecycle, Vue } from "av-ts";
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

  @Lifecycle
  created(): void {
    this.currentLanguage = (this.$store.getters[
      I18N_MODULE_ACTIONS.GET
    ] as LanguagePack).language;
  }

  langChanged(): void {
    loadLanguagePack(this.currentLanguage)
      .then(langPack => {
        this.$store.commit(I18N_MODULE_ACTIONS.SET, langPack);
        return langPack;
      })
      .then(langPack => {
        this.$i18n.setDateTimeFormat(
          langPack.language,
          langPack.dateTimeFormat
        );
        this.$i18n.setLocaleMessage(langPack.language, langPack.messages);
        this.$i18n.locale = langPack.language;
      });
  }
}
