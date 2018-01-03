import "./styles/index.scss";

import VeeValidate from "vee-validate";
import Vue, { CreateElement } from "vue";
import VueI18n from "vue-i18n";
import VueRouter, { RouteConfig } from "vue-router";
import Vuex from "vuex";
import * as WebFontLoader from "webfontloader";

// Vuetify stuff
import Vuetify from "vuetify/es5/components/Vuetify";
import VApp from "vuetify/es5/components/VApp";
import VNavigationDrawer from "vuetify/es5/components/VNavigationDrawer";
import VList from "vuetify/es5/components/VList";
import VIcon from "vuetify/es5/components/VIcon";
import VFooter from "vuetify/es5/components/VFooter";
import VBtn from "vuetify/es5/components/VBtn";
import VToolbar from "vuetify/es5/components/VToolbar";
import VSnackbar from "vuetify/es5/components/VSnackbar";
import VTextField from "vuetify/es5/components/VTextField";
import VDatePicker from "vuetify/es5/components/VDatePicker";
import VTimePicker from "vuetify/es5/components/VTimePicker";
import VMenu from "vuetify/es5/components/VMenu";
import VCard from "vuetify/es5/components/VCard";
import VChip from "vuetify/es5/components/VChip";
import VForm from "vuetify/es5/components/VForm";
import VDialog from "vuetify/es5/components/VDialog";
import VTabs from "vuetify/es5/components/VTabs";
import VGrid from "vuetify/es5/components/VGrid";

// More "fancyness" stuff.
import VueCarousel3d from "vue-carousel-3d";

import NotFound from "./404/404.vue";
import App from "./app/app.vue";
import InputTest from "./inputTest/inputTest.vue";
import TodoList from "./todoList/todoList.vue";

import { bootloader } from "./bootloader";
import { TODO_MODULE_NAME, TodoStateModule } from "./todoList/state/todo.state";

import { LanguagePack, loadBrowserLanguagePack } from "./i18n/languagePack";
import { I18N_MODULE_NAME, I18nStateModule } from "./i18n/state/i18n.state";

// Import here instead of using the template - reduce initial loading time.
WebFontLoader.load({
  google: {
    families: ["Roboto:300,400,500,700", "Material Icons"]
  }
});

function main(languagePack: LanguagePack) {
  Vue.use(VueRouter);
  Vue.use(Vuex);
  Vue.use(VueI18n);
  Vue.use(Vuetify, {
    components: {
      VApp,
      VNavigationDrawer,
      VFooter,
      VList,
      VIcon,
      VBtn,
      VToolbar,
      VSnackbar,
      VTextField,
      VDatePicker,
      VTimePicker,
      VMenu,
      VCard,
      VChip,
      VForm,
      VDialog,
      VTabs,
      VGrid
    }
  });
  Vue.use(VeeValidate); // TODO: Attempt more strict typing.
  Vue.use(VueCarousel3d);
  // TODO: Figure out if we can pick up particular elements, but still using the config.
  // Also, some kind of tree-shaking would be likely ...
  // Vue.use(Buefy, {
  //   defaultIconPack: "fa"
  // });

  // Router configuration.
  const routes: RouteConfig[] = [
    {
      path: "/",
      redirect: "/input-test"
    } as RouteConfig,
    {
      path: "/input-test",
      component: InputTest
    } as RouteConfig,
    {
      path: "/todo-list/:id",
      component: TodoList,
      props: true // The value of :id is set as a prop on the component itself.
    } as RouteConfig,
    {
      path: "/gallery",
      // Note: Naming the created chunk is possible since webpack 2.4.0
      // (see https://github.com/webpack/webpack/releases/tag/v2.4.0) using a special comment notation:
      // import(/* webpackChunkName: "my-chunk-name" */ "module")
      component: () =>
        import(/* webpackChunkName: "gallery" */ "./gallery/gallery.vue")
    } as RouteConfig,
    {
      path: "*",
      component: NotFound
    } as RouteConfig
  ];

  const router = new VueRouter({
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

  const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    modules: {
      [TODO_MODULE_NAME]: new TodoStateModule(),
      [I18N_MODULE_NAME]: new I18nStateModule(languagePack)
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

  return new Vue({
    el: "#app",
    components: { App } as any, // work around typing problems with TS 2.6.1
    render: (h: CreateElement) => h("app"),
    i18n,
    router,
    store
  });

  // Service worker gets registered once the app component gets mounted.
}

bootloader(() => {
  loadBrowserLanguagePack()
    .then(main)
    .catch(err => console.error(err));
});
