import { Module, Plugin } from "vuex";
import { LanguagePack } from "../languagePack";

import { I18nState } from "./interfaces";
import Getters from "./getters";
import Mutations from "./mutations";

export const I18N_MODULE_NAME = "i18n";
export const I18N_MODULE_ACTIONS = {
  SET: `${I18N_MODULE_NAME}/SET`,
  GET: `${I18N_MODULE_NAME}/GET`
};

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
