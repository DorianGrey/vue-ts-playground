import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import { de } from "flatpickr/dist/l10n/de";
import messages from "./messages.json";

export default {
  language: "de",
  messages,
  dateTimeFormat,
  flatPickrLocale: de
} as LanguagePack;
