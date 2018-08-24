import Vue from "vue";
import Vuetify from "vuetify";
import VueI18n from "vue-i18n";
import { Store } from "vuex";
import VeeValidate from "vee-validate";

import createI18nDefinition from "@/i18n";
import languagePack from "@/i18n/lang-packs/en/index";
import createVuetifyConfig from "@/vuetify";
import createStore from "@/store";
import TodoListEntryDisplay from "@/views/todoList/todoListEntryDisplay.vue";

import { mount } from "@vue/test-utils";
import { TodoModel } from "@/views/todoList/state/types";

describe("todoListEntry", () => {
  let i18n: VueI18n;
  let store: Store<any>;

  beforeAll(() => {
    i18n = createI18nDefinition(languagePack);
    store = createStore(languagePack);
    Vue.use(Vuetify, createVuetifyConfig(i18n));
    Vue.use(VeeValidate);
  });

  it("should render correctly if a todo was provided", () => {
    const created = new Date();
    const deadline = new Date();
    const wrapper = mount(TodoListEntryDisplay, {
      i18n,
      store,
      propsData: {
        todo: new TodoModel("TODO", "A todo text", deadline, created)
      }
    });

    // Beware: The selector below is intended for a full `mount`, not a
    // shallow one!
    const contents = wrapper.findAll(".v-card__title div div");

    expect(wrapper.find("h3").text()).toEqual("TODO");
    expect(contents.length).toEqual(3);
    expect(contents.at(0).text()).toEqual("A todo text");
    expect(contents.at(1).text()).toEqual(
      expect.stringContaining(i18n.d(created, "long"))
    );
    expect(contents.at(2).text()).toEqual(
      expect.stringContaining(i18n.d(deadline, "long"))
    );
  });

  // TODO: This test is still a little curious regarding the warnings it causes.
  // Requires additional inspection.
  /*
  it("should render correctly if rendered in edit mode without a source todo object", () => {
    const wrapper = mount(TodoListEntry, {
      i18n,
      store,
      propsData: {
        initialEditable: true
      }
    });

    console.warn(wrapper.html());

    const titleContents = wrapper.find(".v-card-title");
    const headlineInput = titleContents.findAll("input");
    const descriptionInput = titleContents.findAll("textarea");

    expect(headlineInput.length).toEqual(1);
    expect(descriptionInput.length).toEqual(1);
  });
  */

  // TODO: Implement!
  /*
  it("should render correctly if rendered in edit mode with a source todo object", () => {
  //
  // });
  */
});
