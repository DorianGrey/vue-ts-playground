import Vue from "vue";
import InputTest from "./inputTest.vue";
import VueI18n from "vue-i18n";

import { shallow } from "vue-test-utils";

describe("inputTest", () => {
  beforeAll(() => {
    Vue.use(VueI18n);
  });

  it("should render contents correctly", () => {
    const i18n = new VueI18n({
      locale: "en",
      messages: {
        en: {
          "input-test": {
            label: "You have entered: {text}"
          }
        }
      }
    });

    const wrapper = shallow(InputTest, { i18n });

    expect(wrapper.findAll("input")).toHaveLength(1);
    expect(wrapper.findAll("div")).toHaveLength(1);
    // Note: .text() and .html() do not work on an input element, thus we have to
    // access the element manually.
    expect((wrapper.find("input").element as HTMLInputElement).value).toEqual(
      "bass"
    );
    expect(wrapper.find("div").text()).toMatch(/bass$/);
  });
});
