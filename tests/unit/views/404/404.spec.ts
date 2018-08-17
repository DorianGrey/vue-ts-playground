import Vue from "vue";
import NotFound from "@/views/404/404.vue";

import { shallowMount, Wrapper } from "@vue/test-utils";

describe("404", () => {
  let wrapper: Wrapper<Vue>;

  beforeAll(() => {
    wrapper = shallowMount(NotFound);
  });

  it("should render the 'not found' story correctly", () => {
    const content = wrapper.find("#not-found-page");
    const story = content.find("blockquote").text();

    expect(content.find("h2").text()).toEqual(expect.stringContaining("404"));
    expect(story).toEqual(
      expect.stringContaining("I refuse to prove that I exist")
    );
    expect(story).toEqual(
      expect.stringContaining("It proves you exist, and so therefore")
    );
    expect(story).toEqual(
      expect.stringContaining("and promptly disappears in a puff of logic")
    );
  });

  it("should contain a reference to the story's origin on elastic.co", () => {
    expect(wrapper.find("p.italic").text()).toEqual(
      expect.stringContaining("https://www.elastic.co")
    );
  });
});
