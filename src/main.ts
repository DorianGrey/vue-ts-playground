// Import external stylesheets here to work around a warning of libsass;
// results should be equal.
import "../node_modules/sanitize.css/sanitize.css";
import "../node_modules/vuetify/dist/vuetify.css";
import "./styles/index.scss";

import VeeValidate from "vee-validate";
import Vue, { CreateElement } from "vue";
import VueRx from "vue-rx";

import createI18nDefinition from "./i18n";
import createStore from "./store";
import router from "./router";
import * as WebFontLoader from "webfontloader";

// Vuetify stuff
import Vuetify from "vuetify/es5/components/Vuetify";
import createVuetifyConfig from "./vuetify";

// More "fancyness" stuff.
import VueCarousel3d from "vue-carousel-3d";

import App from "./app/app.vue";

import { LanguagePack, loadBrowserLanguagePack } from "./i18n/languagePack";

// Import here instead of using the template - reduce initial loading time.
WebFontLoader.load({
  google: {
    families: ["Roboto:300,400,500,700", "Material Icons"]
  }
});

Vue.use(VueRx);
Vue.use(VeeValidate);
Vue.use(VueCarousel3d);

function main(languagePack: LanguagePack) {
  const store = createStore(languagePack);
  const i18n = createI18nDefinition(languagePack);

  Vue.use(Vuetify, createVuetifyConfig(i18n));

  return new Vue({
    el: "#app",
    components: { App },
    render: (h: CreateElement) => h("app"),
    i18n,
    router,
    store
  });

  // Service worker gets registered once the app component gets mounted.
}

loadBrowserLanguagePack()
  .then(main)
  .catch(err => console.error(err));
