// For scss imports.
declare module "*.scss" {
  let __scss__: string;
  export default __scss__;
}

declare module "*.svg" {
  let __svg__: string;
  export default __svg__;
}

declare module "*/messages.json" {
  import VueI18n from "vue-i18n";
  let __json__: VueI18n.LocaleMessageObject;
  export default __json__;
}
