import { Module, Plugin } from "vuex";
import { namespace } from "vuex-class";

import { TodoModel, TodoState } from "./types";

import Getters from "./getters";
import Mutations from "./mutations";

export const initialTodoState: TodoModel[] = [
  new TodoModel(
    "Test todo",
    "A lot of stuff to be done!",
    new Date(Date.now() + 60 * 60 * 1000),
    new Date()
  ),
  new TodoModel(
    "Test todo #2",
    "Picanha porchetta ribeye cow, spare ribs t-bone short loin. Leberkas pastrami meatloaf boudin, bresaola salami capicola swine filet mignon chicken pork loin shankle ball tip jowl. Bresaola kielbasa sausage ribeye salami. Turkey beef ribs corned beef andouille, pork belly boudin jowl kielbasa cupim short loin shank.",
    new Date(Date.now() + 60 * 60 * 1000 * 2),
    new Date()
  )
];

export const TODO_MODULE_NAME = "todos";
// TODO: See if we can simplify this via constructing it.
export const TODO_MODULE_MUTATIONS = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  SET_EDITABLE: "SET_EDITABLE",
  SET_READONLY: "SET_READONLY"
};

export const TODO_MODULE_GETTERS = {
  allTodos: "allTodos",
  expiredTodos: "expiredTodos"
};

export const TodoSpace = namespace(TODO_MODULE_NAME);

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
