import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { TodoModel } from "./state/interfaces";
import { TODO_MODULE_NAME } from "./state/todo.state";
import TodoEntry from "./todoEntry.vue";

type ActiveTab = "active" | "expired";

@Component({
  components: {
    todoEntry: TodoEntry
  }
})
export default class TodoList extends Vue {
  @Prop({
    type: String,
    required: true
  })
  id: string;

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
