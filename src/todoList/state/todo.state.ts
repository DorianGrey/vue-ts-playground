import { Module, Plugin } from "vuex";

import { TodoModel, TodoState } from "./interfaces";

import Getters from "./getters";
import Mutations from "./mutations";

export const initialTodoState: TodoModel[] = [
  {
    id: 1,
    headline: "Test todo",
    description: "A lot of stuff to be done!",
    deadline: new Date(),
    created: new Date()
  }
];

export const TODO_MODULE_NAME = "todos";

export class TodoStateModule implements Module<TodoState, any> {
  namespaced: boolean = true;

  mutations = Mutations;
  getters = Getters;

  state: TodoState;
  plugins: Array<Plugin<TodoState>> = [];

  constructor(plugins?: Array<Plugin<TodoState>>) {
    this.state = { todoList: initialTodoState };
    if (plugins) {
      this.plugins = plugins;
    }
  }
}
