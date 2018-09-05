import { Component, Vue } from "vue-property-decorator";
import { pluck } from "rxjs/operators";

@Component
export default class InputTest extends Vue {
  inputText: string = "bass";
  invertedInputText: string = this.reverseText(this.inputText);

  mounted() {
    const piped = this.$watchAsObservable("inputText", {
      immediate: true
    }).pipe(pluck<{ newValue: string }, string>("newValue"));
    // Helper function that allows automatic lifecycle handling regarding subscribe/unsubscribe.
    this.$subscribeTo(
      piped,
      s => (this.invertedInputText = this.reverseText(s))
    );
  }

  private reverseText(s: string): string {
    return s
      .split("")
      .reverse()
      .join("");
  }
}
