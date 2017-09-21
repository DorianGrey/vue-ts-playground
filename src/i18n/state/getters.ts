import { GetterTree } from "vuex";
import { I18nState } from "./interfaces";

export function GET(state: I18nState) {
  return state.languagePack;
}

export default {
  GET
} as GetterTree<I18nState, any>;
