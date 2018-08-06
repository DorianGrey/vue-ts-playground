import Vuex from "vuex";
import { TODO_MODULE_NAME, TodoStateModule } from "./components/todoList/state/todo.state";
import { I18N_MODULE_NAME, I18nStateModule } from "./i18n/state/i18n.state";
import { LanguagePack } from "./i18n/languagePack";
import Vue from "vue";

Vue.use(Vuex);

export default function createStore(languagePack: LanguagePack) {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    modules: {
      [TODO_MODULE_NAME]: new TodoStateModule(),
      [I18N_MODULE_NAME]: new I18nStateModule(languagePack)
    }
  });
}
