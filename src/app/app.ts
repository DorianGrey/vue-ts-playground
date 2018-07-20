import Vue from "vue";
import Component from "vue-class-component";
import noop from "lodash-es/noop";

import onceEventHelper from "../utility/onceEvent";
import LanguageSelector from "../languageSelector/languageSelector.vue";
import registerServiceWorker from "../registerServiceWorker";

@Component({
  components: {
    languageSelector: LanguageSelector
  } as any // work around typing problems with TS 2.6.1
})
export default class App extends Vue {
  // a: string = 6;
  isMenuOpen = false;

  snackbarOptions = {
    show: false,
    text: "",
    buttonText: "",
    onClick: noop as (() => void)
  };

  // Lifecycle
  mounted() {
    if (process.env.NODE_ENV === "production") {
      registerServiceWorker(this.showSnackbar.bind(this), this.$t.bind(this));
    }
  }

  openMenu($event: Event): void {
    if (!this.isMenuOpen) {
      $event.preventDefault();
      $event.stopPropagation();
      this.isMenuOpen = true;
      onceEventHelper(document, "click", () => (this.isMenuOpen = false));
    }
  }

  showSnackbar(text: string, buttonText: string, callback?: () => void) {
    this.snackbarOptions.text = text;
    this.snackbarOptions.buttonText = buttonText;
    if (callback) {
      this.snackbarOptions.onClick = callback;
    }
    this.snackbarOptions.show = true;
  }

  hideSnackbar() {
    if (this.snackbarOptions.onClick) {
      this.snackbarOptions.onClick();
    }
    this.snackbarOptions.show = false;
    this.snackbarOptions.onClick = noop;
    this.snackbarOptions.text = "";
    this.snackbarOptions.buttonText = "";
  }
}
