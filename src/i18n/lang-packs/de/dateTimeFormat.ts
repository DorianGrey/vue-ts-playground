import VueI18n from "vue-i18n";

export default {
  long: {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }
} as VueI18n.DateTimeFormat;
