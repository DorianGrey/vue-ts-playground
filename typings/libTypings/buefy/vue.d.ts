import Vue, {ComponentOptions} from "vue";
import {SnackbarService} from "buefy";

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    $snackbar?: SnackbarService;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $snackbar: SnackbarService;
  }
}