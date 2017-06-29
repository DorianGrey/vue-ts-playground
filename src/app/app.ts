import { Component, Vue } from "av-ts";

@Component
export default class App extends Vue {
  // a: string = 6;
  isMenuOpen = false;

  // TODO: Need to figure out why this does not work properly.
  // readonly onceClickHandler = () => {
  //   this.isMenuOpen = false;
  //   document.removeEventListener("click", this.onceClickHandler);
  // };

  openMenu(): void {
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
      // setTimeout(() => document.addEventListener("click", this.onceClickHandler));
    }
  }
}
