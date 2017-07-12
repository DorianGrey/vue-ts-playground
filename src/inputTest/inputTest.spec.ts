import Vue from "vue";
import inputTest from "./inputTest.vue";

describe("inputTest", () => {
  it("should render contents correctly", () => {
    const Ctor = Vue.extend(inputTest);
    const vm = new Ctor().$mount();

    const inputElement = vm.$el.getElementsByTagName("input")[0];
    const divElement = vm.$el.getElementsByTagName("div")[0];

    // Elements should exist
    expect(inputElement).not.toBeUndefined();
    expect(divElement).not.toBeUndefined();
    // Elements should have correct values.
    expect(divElement.textContent).toEqual("You entered: bass");
    expect((inputElement as HTMLInputElement).value).toEqual("bass");
  });
});
