import { Component, p, Prop, Vue } from "av-ts";

import { TodoModel } from "./state/interfaces";
import { TODO_MODULE_NAME } from "./state/todo.state";
import TodoEntry from "./todoEntry.vue";

@Component({
  components: {
    todoEntry: TodoEntry
  }
})
export default class TodoList extends Vue {
  @Prop
  id = p({
    type: String,
    required: true
  }) as string;

  newTodoEditable = false;

  showNewTodoBlock(): void {
    this.newTodoEditable = true;
  }

  get todoList(): TodoModel[] {
    return this.$store.getters[`${TODO_MODULE_NAME}/allTodos`];
  }

  get expiredTodos(): TodoModel[] {
    return this.$store.getters[`${TODO_MODULE_NAME}/expiredTodos`];
  }
}
