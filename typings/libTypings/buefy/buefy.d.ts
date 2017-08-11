declare module "buefy" {
  import Vue from "vue";

  export type StyleType = "is-white" | "is-black" | "is-light" | "is-dark" | "is-primary" | "is-info" | "is-success" | "is-warning" | "is-danger";

  // See https://buefy.github.io/#/documentation/constructor-options
  export interface BuefyOptions {
    defaultIconPack: "mdi" | "fa";
    defaultContainerElement: string;
    defaultSnackbarDuration: number;
    defaultToastDuration: number;
    defaultTooltipType: StyleType;
    defaultTooltipAnimated: boolean;
    defaultInputAutocomplete: "on" | "off";
  }

  const def: Vue.PluginFunction<Partial<BuefyOptions>>;
  export default def;


  // Type definitions for global extensions.
  export interface SnackbarOpenOptions {
    type?: StyleType;
    message: string;
    position?: "is-top-right" | "is-top" | "is-top-left" | "is-bottom-right" | "is-bottom" | "is-bottom-left";
    duration?: number;
    container?: string;
    actionText?: string | null;
    onAction?: () => void;
  }
  export interface SnackbarService {
    open(param: string | SnackbarOpenOptions): void;
  }

}


declare module "buefy/src/components/snackbar" {
  import {SnackbarService} from "buefy";
  const def: SnackbarService;
  export default def;
}

declare module "buefy/src/utils/config" {
  import {BuefyOptions} from "buefy";

  const config: BuefyOptions;
  export default config;

  export function setOptions(options: BuefyOptions): void;
}