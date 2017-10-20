declare module "vue-carousel-3d" {
  import {ComponentOptions, PluginFunction} from "vue";

  // TODO: Still not sure about the details of these typings; just using them to properly
  // silence the code checkers.

  export const Carousel3d: ComponentOptions<never>;
  export const Slide: ComponentOptions<never>;

  const def: PluginFunction<never>;
  export default def;
}
