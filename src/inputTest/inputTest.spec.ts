import Vue from "vue";
import InputTest from "./inputTest.vue";
import VueI18n from "vue-i18n";
import Vuetify from "vuetify";

import { mount } from "@vue/test-utils";

describe("inputTest", () => {
  beforeAll(() => {
    Vue.use(VueI18n);
    Vue.use(Vuetify);
  });

  it("should render contents correctly", () => {
    const i18n = new VueI18n({
      locale: "en",
      messages: {
        en: {
          "input-test": {
            help: "An arbitrary text",
            label: "You have entered: {text}"
          }
        }
      }
    });

    // Note: "mount" instead of "shallow" is required due to nested elements.
    const wrapper = mount(InputTest, { i18n });

    expect(wrapper.findAll("input")).toHaveLength(1);
    // Note: .text() and .html() do not work on an input element, thus we have to
    // access the element manually.
    expect((wrapper.find("input").element as HTMLInputElement).value).toEqual(
      "bass"
    );
    expect(wrapper.find("div.output").text()).toMatch(/bass$/);
    expect(wrapper.findAll("div.output")).toHaveLength(1);
  });
});
