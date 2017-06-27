import {Component, p, Prop, Vue} from "av-ts";

import {TodoModel} from "./state/interfaces";

@Component
export default class TodoEntry extends Vue {
  @Prop todo = p({
    type:     Object,
    required: false
  }) as TodoModel;

  @Prop initialEditable = p({
    type:     Boolean,
    required: false
  }) as boolean;

  editable              = this.initialEditable || false;
  targetTodo: TodoModel = this.todo ? {...this.todo} : {
    headline:    "",
    description: ""
  } as TodoModel;

  setEditable(newValue: boolean): void {
    this.editable = newValue;
    // TODO: Depending on the initial state, we have to inform the outer component to clear the entry.
    // Maybe use store for this.
  }

  onSubmit(): void {
    console.warn("Submission iniated!");
    // TODO: Requires to be more useful..
  }
}
