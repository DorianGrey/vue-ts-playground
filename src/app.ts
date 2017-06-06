import Vue, {CreateElement} from "vue";
import App from "./app.vue";

new Vue({
  el:         "#app",
  components: {App},
  render:     (h: CreateElement) => h("app")
});
