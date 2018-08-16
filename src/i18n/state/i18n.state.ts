import { Module, Plugin } from "vuex";
import { namespace } from "vuex-class";
import { LanguagePack } from "../languagePack";

import { I18nState } from "./interfaces";
import Getters from "./getters";
import Mutations from "./mutations";

export const I18N_MODULE_NAME = "i18n";
// TODO: See if we can simplify this via constructing it.
export const I18N_MODULE_GETTERS = {
  SET: "SET",
  GET: "GET",
  LANG: "LANG"
};

export const I18N_MODULE_MUTATIONS = {
  SET: "SET"
};

export const I18nSpace = namespace(I18N_MODULE_NAME);

export class I18nStateModule implements Module<I18nState, any> {
  namespaced: boolean = true;

  mutations = Mutations;
  getters = Getters;

  state: I18nState;
  plugins: Array<Plugin<I18nState>> = [];

  constructor(initialPack: LanguagePack, plugins?: Array<Plugin<I18nState>>) {
    this.state = { languagePack: initialPack };
    if (plugins) {
      this.plugins = plugins;
    }
  }
}
