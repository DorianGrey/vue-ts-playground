import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { TodoModel } from "./state/types";
import { TODO_MODULE_MUTATIONS, TodoSpace } from "./state/todo.state";

@Component
export default class TodoListEntryDisplay extends Vue {
  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.SET_EDITABLE)
  readonly setEditable: (target: number) => void;

  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.DELETE)
  readonly deleteTodo: (target: number) => void;

  @Prop({ type: Object, required: true })
  todo: TodoModel;
}
