import { GetterTree } from "vuex";
import { I18nState } from "./interfaces";

export function currentLanguagePack(state: I18nState) {
  return state.languagePack;
}

export default {
  currentLanguagePack
} as GetterTree<I18nState, any>;
