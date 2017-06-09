import "./styles/index.scss";

import Vue, {CreateElement} from "vue";
import VueRouter from "vue-router";

import App from "./app.vue";
import InputTest from "./inputTest/inputTest.vue";
import TestRoute2 from "./testRoute2/testRoute2.vue";
import NotFound from "./404/404.vue";

import {bootloader} from "./bootloader";

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
  // Router configuration.
  const routes = [
    {
      path:     "/",
      redirect: "/testRoute1"
    },
    {
      path:      "/testRoute1",
      component: InputTest
    },
    {
      path:      "/testRoute2/:id",
      component: TestRoute2,
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

  new Vue({
    el:         "#app",
    components: {App},
    render:     (h: CreateElement) => h("app"),
    router
  });
}

bootloader(main);
