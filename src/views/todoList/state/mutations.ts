import { MutationTree } from "vuex";
import findIndex from "lodash-es/findIndex";

import { TodoModel, TodoState } from "./types";

export function ADD(state: TodoState, newTodo: TodoModel) {
  state.todoList.push(newTodo);
}

export function UPDATE(state: TodoState, newTodo: TodoModel) {
  const currentIndex = findIndex(state.todoList, { id: newTodo.id });
  if (currentIndex >= 0) {
    state.todoList.splice(currentIndex, 1, newTodo);
  }
}

export function DELETE(state: TodoState, todoId: number) {
  const currentIndex = findIndex(state.todoList, { id: todoId });
  if (currentIndex >= 0) {
    state.todoList.splice(currentIndex, 1);
  }
}

export function SET_EDITABLE(state: TodoState, todoId: number) {
  const currentIndex = findIndex(state.todoList, { id: todoId });
  if (currentIndex >= 0) {
    const targetTodo = state.todoList[currentIndex].withEditMode(true);
    state.todoList.splice(currentIndex, 1, targetTodo);
  }
}

export function SET_READONLY(state: TodoState, todoId: number) {
  const currentIndex = findIndex(state.todoList, { id: todoId });
  if (currentIndex >= 0) {
    const targetTodo = state.todoList[currentIndex].withEditMode(false);
    state.todoList.splice(currentIndex, 1, targetTodo);
  }
}

export default {
  ADD,
  UPDATE,
  DELETE,
  SET_EDITABLE,
  SET_READONLY
} as MutationTree<TodoState>;
