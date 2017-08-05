import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import * as Flatpickr from "flatpickr";
import messages from "./messages.json";

export default {
  language: "en",
  messages,
  dateTimeFormat,
  flatPickr: {
    locale: Flatpickr.l10ns.default,
    dateFormat: "Y/m/d",
    dateTimeFormat: "Y/m/d H:i"
  }
} as LanguagePack;
