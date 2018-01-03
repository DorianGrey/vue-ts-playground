import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import messages from "./messages.json";

export default {
  language: "en",
  messages,
  dateTimeFormat,
  timeFormat: "ampm",
  firstDayOfWeek: 0 // Sunday
} as LanguagePack;
