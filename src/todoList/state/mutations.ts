import {MutationTree} from "vuex";

import {TodoModel, TodoState} from "./interfaces";


export function ADD(state: TodoState, newTodo: TodoModel) {
  state.todoList.push(newTodo);
}

export default {
  ADD
} as MutationTree<TodoState>;
