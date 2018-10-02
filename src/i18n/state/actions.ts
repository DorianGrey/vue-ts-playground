import { ActionTree, ActionContext } from "vuex";
import VueI18n, { IVueI18n } from "vue-i18n";

import { loadLanguagePack } from "@/i18n/languagePack";
import { I18N_MODULE_MUTATIONS } from "@/i18n/state/i18n.state";
import { I18nState } from "@/i18n/state/interfaces";

export interface LoadLanguageActionPayload {
  lang: string;
  $i18n: VueI18n & IVueI18n;
}

export function LOAD(
  context: ActionContext<I18nState, any>,
  payload: LoadLanguageActionPayload
) {
  const { lang, $i18n } = payload;

  if (context.state.languagePack.language === lang) {
    return Promise.resolve(context.state.languagePack);
  } else {
    return loadLanguagePack(lang).then(langPack => {
      context.commit(I18N_MODULE_MUTATIONS.SET, langPack);
      $i18n.setDateTimeFormat(langPack.language, langPack.dateTimeFormat);
      $i18n.setLocaleMessage(langPack.language, langPack.messages);

      // This call will trigger the actual UI update.
      $i18n.locale = langPack.language;
      return langPack;
    });
  }
}

export default {
  LOAD
} as ActionTree<I18nState, any>;
