import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import messages from "./messages.json";

export default {
  language: "de",
  messages,
  dateTimeFormat,
  timeFormat: "24hr",
  firstDayOfWeek: 1 // Monday
} as LanguagePack;
