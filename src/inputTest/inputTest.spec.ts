import Vue from "vue";
import inputTest from "./inputTest.vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

describe("inputTest", () => {
  it("should render contents correctly", () => {
    // TODO: Not yet working...
    const i18n = new VueI18n({});
    const Ctor = Vue.extend(inputTest);
    const vm = new Ctor({ i18n }).$mount();

    const inputElement = vm.$el.getElementsByTagName("input")[0];
    const divElement = vm.$el.getElementsByTagName("div")[0];

    // Elements should exist
    expect(inputElement).not.toBeUndefined();
    expect(divElement).not.toBeUndefined();
    // Elements should have correct values.
    expect(divElement.textContent).toMatch(/bass$/);
    expect((inputElement as HTMLInputElement).value).toEqual("bass");
  });
});
