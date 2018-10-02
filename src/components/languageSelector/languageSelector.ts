import Vue from "vue";
import Component from "vue-class-component";

import { LanguagePack } from "@/i18n/languagePack";
import {
  I18N_MODULE_ACTIONS,
  I18N_MODULE_MUTATIONS,
  I18nSpace
} from "@/i18n/state/i18n.state";
import { LoadLanguageActionPayload } from "@/i18n/state/actions";

@Component
export default class LanguageSelector extends Vue {
  @I18nSpace.Mutation(I18N_MODULE_MUTATIONS.SET)
  readonly setLanguage: (langPack: LanguagePack) => void;

  @I18nSpace.Action(I18N_MODULE_ACTIONS.LOAD)
  readonly loadLanguage: (
    data: LoadLanguageActionPayload
  ) => Promise<LanguagePack>;

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
    // Comparison with current language is performed in the action handler.
    this.loadLanguage({ lang: newLang, $i18n: this.$i18n }).catch(err => {
      // TODO: This might need a better handling ...
      console.warn(err);
    });
  }
}
