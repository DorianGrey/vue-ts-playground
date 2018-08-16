import { LanguagePack } from "../../languagePack";
import dateTimeFormat from "./dateTimeFormat";
import messages from "./messages.json";

// These vuetify messages are custom, since they are only provided for `en`.
const vuetifyMessages = {
  dataIterator: {
    rowsPerPageText: "Einträge pro Seite",
    rowsPerPageAll: "Alle",
    pageText: "{0}-{1} von {2}",
    noResultsText: "Keine passenden Einträge gefunden",
    nextPage: "Nächste Seite",
    prevPage: "Vorherige Seite"
  },
  dataTable: {
    rowsPerPageText: "Zeilen pro Seite:"
  },
  noDataText: "Keine Daten verfügbar."
};

export default {
  language: "de",
  messages: {
    ...messages,
    $vuetify: vuetifyMessages
  },
  dateTimeFormat,
  timeFormat: "24hr",
  firstDayOfWeek: 1 // Monday
} as LanguagePack;
