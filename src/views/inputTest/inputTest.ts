import { Component, Vue } from "vue-property-decorator";
import { pluck } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  domStreams: ["plus$"]
})
export default class InputTest extends Vue {
  inputText: string = "bass";
  invertedInputText: string = this.invertText(this.inputText);
  plus$ = new Subject<Event>();

  mounted() {
    const piped = this.plus$.pipe(
      pluck<Event, string>("event", "msg", "target", "value")
    );

    // Helper function that allows automatic lifecycle handling regarding subscribe/unsubscribe.
    this.$subscribeTo(
      piped,
      s => (this.invertedInputText = this.invertText(s))
    );
  }

  private invertText(s: string): string {
    return s
      .split("")
      .reverse()
      .join("");
  }
}
