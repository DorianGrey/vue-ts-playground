import Vue = require("vue");
import Buefy = require("buefy");

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    $snackbar?: Buefy.SnackbarService;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $snackbar: Buefy.SnackbarService;
  }
}