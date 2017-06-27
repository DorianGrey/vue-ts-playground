import "./styles/index.scss";

import VeeValidate from "vee-validate";
import Vue, {CreateElement} from "vue";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";
import Vuex from "vuex";

// More "fancyness" stuff.
import VueCarousel3d from "vue-carousel-3d";

import NotFound from "./404/404.vue";
import App from "./app/app.vue";
import InputTest from "./inputTest/inputTest.vue";
import TodoList from "./todoList/todoList.vue";

import {bootloader} from "./bootloader";
import {TODO_MODULE_NAME, TodoStateModule} from "./todoList/state/todo.state";

import {BROWSER_LANGUAGE} from "./i18n/browserLanguage";
import {DATE_TIME_FORMATS} from "./i18n/dateTimeFormats";

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

let app: any;

function main() {
  Vue.use(VueRouter);
  Vue.use(Vuex);
  Vue.use(VueI18n);
  Vue.use(VeeValidate); // TODO: Attempt more strict typing.
  Vue.use(VueCarousel3d);

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
      path:      "/gallery",
      component: lazyLoadHelper(_import_(/* webpackChunkName: "gallery" */"./gallery/gallery.vue"))
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

  const store = new Vuex.Store({
    strict:  process.env.NODE_ENV !== "production",
    modules: {
      [TODO_MODULE_NAME]: new TodoStateModule()
    }
  });

  store.commit("todos/ADD", {
    id:          2,
    headline:    "Tester todo",
    description: "Even more stuff to be done!",
    deadline:    new Date(Date.now() + 3600000),
    created:     new Date()
  });

  const i18n = new VueI18n({
    locale: BROWSER_LANGUAGE, // set locale
    dateTimeFormats: DATE_TIME_FORMATS
  });

  app = new Vue({
    el:         "#app",
    components: {App},
    render:     (h: CreateElement) => h("app"),
    i18n,
    router,
    store
  });
}

bootloader(main);
