import { Component, Vue } from "av-ts";
import onceEventHelper from "../utility/onceEvent";

@Component
export default class App extends Vue {
  // a: string = 6;
  isMenuOpen = false;

  openMenu($event: Event): void {
    if (!this.isMenuOpen) {
      $event.preventDefault();
      $event.stopPropagation();
      this.isMenuOpen = true;
      onceEventHelper(document, "click", () => (this.isMenuOpen = false));
    }
  }
}
