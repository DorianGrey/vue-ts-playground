import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import Flatpickr from "flatpickr";
import messages from "./messages.json";

export default {
  language: "en",
  messages,
  dateTimeFormat,
  flatPickr: {
    locale: (Flatpickr.l10ns as any).en, // This is available by default.
    useTimeFormat_24hrs: false,
    dateFormat: "Y/m/d",
    dateTimeFormat: "Y/m/d H:i"
  }
} as LanguagePack;
