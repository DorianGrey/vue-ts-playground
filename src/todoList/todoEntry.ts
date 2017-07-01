import { Component, p, Prop, Vue } from "av-ts";

import { createNewTodo } from "./state/creators";
import { TodoModel } from "./state/interfaces";
import { TODO_MODULE_ACTIONS } from "./state/todo.state";

@Component
export default class TodoEntry extends Vue {
  @Prop
  todo = p({
    type: Object,
    required: false
  }) as TodoModel;

  @Prop
  initialEditable = p({
    type: Boolean,
    required: false
  }) as boolean;

  @Prop
  afterSubmit = p({
    type: Function,
    required: false
  });

  editable = this.initialEditable || false;
  targetTodo: TodoModel = this.todo
    ? { ...this.todo }
    : {
        headline: "",
        description: ""
      } as TodoModel;

  setEditable(newValue: boolean): void {
    this.editable = newValue;
    // TODO: Depending on the initial state, we have to inform the outer component to clear the entry.
    // Maybe use store for this.
  }

  onSubmit(): void {
    // TODO: If `this.todo` already is a `todo` object,
    // we need to send an UPDATE instead of an ADD.
    this.$store.commit(
      TODO_MODULE_ACTIONS.ADD,
      createNewTodo(this.targetTodo.headline, this.targetTodo.description)
    );
    if (this.afterSubmit) {
      this.afterSubmit();
    }
    this.setEditable(false);
  }
}
