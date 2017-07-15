import { MutationTree } from "vuex";
import findIndex from "lodash-es/findIndex";

import { TodoModel, TodoState } from "./interfaces";

export function ADD(state: TodoState, newTodo: TodoModel) {
  state.todoList.push(newTodo);
}

export function UPDATE(state: TodoState, newTodo: TodoModel) {
  const currentIndex = findIndex(state.todoList, { id: newTodo.id });
  if (currentIndex >= 0) {
    state.todoList.splice(currentIndex, 1, newTodo);
  }
}

export function DELETE(state: TodoState, todoId: string) {
  const currentIndex = findIndex(state.todoList, { id: todoId });
  if (currentIndex >= 0) {
    state.todoList.splice(currentIndex, 1);
  }
}

export default {
  ADD,
  UPDATE,
  DELETE
} as MutationTree<TodoState>;
