import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { TodoModel } from "./state/types";
import { TODO_MODULE_GETTERS, TodoSpace } from "./state/todo.state";
import TodoListEntryDisplay from "./todoListEntryDisplay.vue";
import TodoListEntryEditable from "./todoListEntryEditable.vue";

type ActiveTab = "active" | "expired";

@Component({
  components: {
    todoListEntryDisplay: TodoListEntryDisplay,
    todoListEntryEditable: TodoListEntryEditable
  }
})
export default class TodoList extends Vue {
  @Prop({
    type: String,
    required: true
  })
  id: string;

  @TodoSpace.Getter(TODO_MODULE_GETTERS.allTodos)
  readonly todoList: TodoModel[];

  @TodoSpace.Getter(TODO_MODULE_GETTERS.expiredTodos)
  readonly expiredTodos: TodoModel[];

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
}
