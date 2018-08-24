import { GetterTree } from "vuex";

import { TodoState } from "./types";

export function allTodos(state: TodoState) {
  return state.todoList;
}

export function expiredTodos(state: TodoState) {
  const compDate = new Date();
  return state.todoList.filter(t => t.deadline < compDate);
}

export default {
  allTodos,
  expiredTodos
} as GetterTree<TodoState, any>;
