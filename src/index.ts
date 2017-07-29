import "./styles/index.scss";

import VeeValidate from "vee-validate";
import Vue, { CreateElement } from "vue";
import VueI18n from "vue-i18n";
import VueRouter, { RouteConfig } from "vue-router";
import Vuex from "vuex";

// More "fancyness" stuff.
import VueCarousel3d from "vue-carousel-3d";

import NotFound from "./404/404.vue";
import App from "./app/app.vue";
import InputTest from "./inputTest/inputTest.vue";
import TodoList from "./todoList/todoList.vue";

import { bootloader } from "./bootloader";
import { TODO_MODULE_NAME, TodoStateModule } from "./todoList/state/todo.state";

import { LanguagePack, loadBrowserLanguagePack } from "./i18n/languagePack";

let app: any;

function main(languagePack: LanguagePack) {
  Vue.use(VueRouter);
  Vue.use(Vuex);
  Vue.use(VueI18n);
  Vue.use(VeeValidate); // TODO: Attempt more strict typing.
  Vue.use(VueCarousel3d);

  // Router configuration.
  const routes: RouteConfig[] = [
    {
      path: "/",
      redirect: "/input-test"
    },
    {
      path: "/input-test",
      component: InputTest
    },
    {
      path: "/todo-list/:id",
      component: TodoList,
      props: true // The value of :id is set as a prop on the component itself.
    },
    {
      path: "/gallery",
      // Note: Naming the created chunk is possible since webpack 2.4.0
      // (see https://github.com/webpack/webpack/releases/tag/v2.4.0) using a special comment notation:
      // import(/* webpackChunkName: "my-chunk-name" */ "module")
      component: () =>
        import(/* webpackChunkName: "gallery" */ "./gallery/gallery.vue")
    },
    {
      path: "*",
      component: NotFound
    }
  ];

  const router = new VueRouter({
    mode: window.history.pushState ? "history" : "hash",
    routes,
    scrollBehavior: (
      _to: any,
      _from: any,
      savedPosition: { x: number; y: number }
    ) => {
      return savedPosition;
    }
  });

  const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    modules: {
      [TODO_MODULE_NAME]: new TodoStateModule()
    }
  });

  const i18n = new VueI18n({
    locale: languagePack.language, // set locale
    dateTimeFormats: {
      [languagePack.language]: languagePack.dateTimeFormat
    },
    messages: {
      [languagePack.language]: languagePack.messages
    }
  });

  app = new Vue({
    el: "#app",
    components: { App },
    render: (h: CreateElement) => h("app"),
    i18n,
    router,
    store
  });
}

bootloader(() => {
  loadBrowserLanguagePack().then(main).catch(err => console.error(err));
});
