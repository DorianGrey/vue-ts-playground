import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import messages from "./messages.json";
import vuetifyMessages from "vuetify/src/locale/en.js";

export default {
  language: "en",
  messages: {
    ...messages,
    $vuetify: vuetifyMessages
  },
  dateTimeFormat,
  timeFormat: "ampm",
  firstDayOfWeek: 0 // Sunday
} as LanguagePack;
