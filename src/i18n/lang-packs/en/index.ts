import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import * as Flatpickr from "flatpickr";
import messages from "./messages.json";

export default {
  language: "en",
  messages,
  dateTimeFormat,
  flatPickrLocale: Flatpickr.l10ns.default
} as LanguagePack;
