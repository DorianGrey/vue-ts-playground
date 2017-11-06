import { Component, p, Prop, Vue } from "av-ts";

import { TodoModel } from "./state/interfaces";
import { TODO_MODULE_NAME } from "./state/todo.state";
import TodoEntry from "./todoEntry.vue";

type ActiveTab = "active" | "expired";

@Component({
  components: {
    todoEntry: TodoEntry
  } as any // work around typing problems with TS 2.6.1
})
export default class TodoList extends Vue {
  @Prop
  id = p({
    type: String,
    required: true
  }) as string;

  newTodoEditable = false;

  activeTab: ActiveTab = "active";

  showNewTodoBlock(): void {
    this.newTodoEditable = true;
  }

  hideNewTodoBlock(): void {
    this.newTodoEditable = false;
  }

  setActiveTab(activeTab: ActiveTab): void {
    this.activeTab = activeTab;
  }

  get todoList(): TodoModel[] {
    return this.$store.getters[`${TODO_MODULE_NAME}/allTodos`];
  }

  get expiredTodos(): TodoModel[] {
    return this.$store.getters[`${TODO_MODULE_NAME}/expiredTodos`];
  }
}
