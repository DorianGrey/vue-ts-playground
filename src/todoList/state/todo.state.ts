import { Module, Plugin } from "vuex";

import { TodoModel, TodoState } from "./interfaces";

import Getters from "./getters";
import Mutations from "./mutations";

export const initialTodoState: TodoModel[] = [
  {
    id: 1,
    headline: "Test todo",
    description: "A lot of stuff to be done!",
    deadline: new Date(Date.now() + 60 * 60 * 1000),
    created: new Date()
  },
  {
    id: 2,
    headline: "Test todo #2",
    description:
      "Picanha porchetta ribeye cow, spare ribs t-bone short loin. Leberkas pastrami meatloaf boudin, bresaola salami capicola swine filet mignon chicken pork loin shankle ball tip jowl. Bresaola kielbasa sausage ribeye salami. Turkey beef ribs corned beef andouille, pork belly boudin jowl kielbasa cupim short loin shank.",
    deadline: new Date(Date.now() + 60 * 60 * 1000 * 2),
    created: new Date()
  }
];

export const TODO_MODULE_NAME = "todos";

export const TODO_MODULE_ACTIONS = {
  ADD: `${TODO_MODULE_NAME}/ADD`,
  UPDATE: `${TODO_MODULE_NAME}/UPDATE`,
  DELETE: `${TODO_MODULE_NAME}/DELETE`
};

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
