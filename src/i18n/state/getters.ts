import { GetterTree } from "vuex";
import { I18nState } from "./interfaces";

export function GET(state: I18nState) {
  return state.languagePack;
}

export function LANG(state: I18nState) {
  return state.languagePack.language;
}

export default {
  GET,
  LANG
} as GetterTree<I18nState, any>;
