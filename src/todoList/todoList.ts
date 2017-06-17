import {Component, p, Prop, Vue} from "av-ts";
import {TodoModel} from "./todo.state";
import TodoEntry from "./todoEntry.vue";

@Component({
  components: {
    todoEntry: TodoEntry
  }
})
export default class TodoList extends Vue {
  @Prop id = p({
    type:     String,
    required: true
  }) as string;

  get todoList(): TodoModel[] {
    return this.$store.getters.allTodos;
  }

  get expiredTodos(): TodoModel[] {
    return this.$store.getters.expiredTodos;
  }
}
