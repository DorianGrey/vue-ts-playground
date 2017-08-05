import { MutationTree } from "vuex";
import { I18nState } from "./interfaces";
import { LanguagePack } from "../languagePack";

export function SET(state: I18nState, languagePack: LanguagePack) {
  state.languagePack = languagePack;
}

export default {
  SET
} as MutationTree<I18nState>;
