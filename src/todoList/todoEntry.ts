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

  pendingTodo: TodoModel | null = this.editable ? { ...this.targetTodo } : null;

  setEditable(newValue: boolean): void {
    this.editable = newValue;
    // TODO: Depending on the initial state, we have to inform the outer component to clear the entry.
    // Maybe use store for this.

    // We need a copy of the current model to properly deal with edit/cancel steps.
    if (this.editable === true) {
      this.pendingTodo = { ...this.targetTodo };
    }
  }

  onSubmit(): void {
    if (this.pendingTodo) {
      this.targetTodo = { ...this.pendingTodo };
    }
    this.setEditable(false);
    // If `this.todo` already is a `todo` object,
    // we need to send an UPDATE instead of an ADD.
    if (this.targetTodo.id) {
      this.$store.commit(TODO_MODULE_ACTIONS.UPDATE, this.targetTodo);
    } else {
      this.$store.commit(
        TODO_MODULE_ACTIONS.ADD,
        createNewTodo(this.targetTodo.headline, this.targetTodo.description)
      );
    }

    if (this.afterSubmit) {
      this.afterSubmit();
    }
  }

  onDelete(): void {
    if (this.targetTodo.id) {
      this.$store.commit(TODO_MODULE_ACTIONS.DELETE, this.targetTodo.id);
    }
  }

  onCancel(): void {
    if (this.pendingTodo) {
      this.targetTodo = { ...this.pendingTodo };
      this.pendingTodo = null;
    }
    this.setEditable(false);
  }
}
