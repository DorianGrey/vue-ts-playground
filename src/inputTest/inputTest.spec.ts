import { expect } from "chai";

import Vue from "vue";
import inputTest from "./inputTest.vue";

describe("inputTest", () => {
  it("should render contents correctly", () => {
    const Ctor = Vue.extend(inputTest as any); // TODO: Check typing!
    const vm = new Ctor().$mount();

    const element = vm.$el.getElementsByTagName("input")[0];

    // element should exist
    expect(element).to.not.be.undefined;
    expect((element as HTMLInputElement).value).to.equal("bass");
  });
});
