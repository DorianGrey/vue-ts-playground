import "./styles/index.scss";

import Vue, {CreateElement} from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";

import App from "./app.vue";
import InputTest from "./inputTest/inputTest.vue";
import TodoList from "./todoList/todoList.vue";
import NotFound from "./404/404.vue";

import {bootloader} from "./bootloader";
import {initialTodoState, TodoModel} from "./todoList/todo.state";

/**
 * Helper function to reduce boilerplate for importing other components.
 *
 * @param promise Promise to use in the resulting factory function. Regularly, it's sufficient to use the result of
 *                `import("whatEverModule")` here.
 * @returns {(resolve:(mod:any)=>any)=>Promise<TResult2|TResult1>}
 */
function lazyLoadHelper<T>(promise: Promise<T>) {
  return (resolve: (mod: any) => any) => promise.then((res: any) => resolve(res.default));
}

function main() {
  Vue.use(VueRouter);
  Vue.use(Vuex);
  // Router configuration.
  const routes = [
    {
      path:     "/",
      redirect: "/input-test"
    },
    {
      path:      "/input-test",
      component: InputTest
    },
    {
      path:      "/todo-list/:id",
      component: TodoList,
      props:     true // The value of :id is set as a prop on the component itself.
    },
    {
      path:      "/asyncTest",
      component: lazyLoadHelper(_import_(/* webpackChunkName: "asyncTest" */"./asyncTest/asyncTest.vue"))
    },
    {
      path:      "*",
      component: NotFound
    }
  ];
  const router = new VueRouter({
    mode:           window.history.pushState ? "history" : "hash",
    routes,
    scrollBehavior: (_to: any, _from: any, savedPosition: { x: number, y: number }) => {
      return savedPosition;
    }
  });

  interface AppState {
    todoList: TodoModel[];
  }

  const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    state:     {
      todoList: initialTodoState
    },
    mutations: {
      add(state: AppState, newTodo: TodoModel) {
        state.todoList.push(newTodo);
      }
    },
    getters:   {
      allTodos:     state => state.todoList,
      expiredTodos: state => state.todoList.filter(t => t.deadline < new Date())
    }
  });

  store.commit("add", {
    id:          2,
    headline:    "Tester todo",
    description: "Even more stuff to be done!",
    deadline:    new Date(Date.now() + 3600000),
    created:     new Date()
  });

  new Vue({
    el:         "#app",
    components: {App},
    render:     (h: CreateElement) => h("app"),
    router,
    store
  });
}

bootloader(main);
