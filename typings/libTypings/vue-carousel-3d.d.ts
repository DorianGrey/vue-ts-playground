declare module "vue-carousel-3d" {
  import Vue from "vue";

  // TODO: Still not sure about the details of these typings; just using them to properly
  // silence the code checkers.

  export const Carousel3d: Vue.ComponentOptions<never>;
  export const Slide: Vue.ComponentOptions<never>;

  const def: Vue.PluginFunction<never>;
  export default def;
}
