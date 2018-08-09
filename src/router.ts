import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import NotFound from "./views/404/404.vue";
import InputTest from "./views/inputTest/inputTest.vue";
import TodoList from "./views/todoList/todoList.vue";

Vue.use(VueRouter);

// Router configuration.
const routes: RouteConfig[] = [
  {
    path: "/",
    redirect: "/input-test"
  },
  {
    path: "/input-test",
    component: InputTest
  } as RouteConfig,
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
      import(/* webpackChunkName: "gallery" */ "./views/gallery/gallery.vue")
  } as RouteConfig,
  {
    path: "*",
    component: NotFound
  }
];

export default new VueRouter({
  mode: window.history.pushState ? "history" : "hash",
  routes,
  scrollBehavior: (
    _to: any,
    _from: any,
    savedPosition: { x: number; y: number } | void
  ) => {
    return savedPosition;
  }
});
