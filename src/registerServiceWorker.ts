/* tslint:disable:no-console */

import { register } from "register-service-worker";

import VueI18n from "vue-i18n";

type Cb = () => void;
type SnackBarCb = (text: string, buttonText: string, callback?: Cb) => void;

export default function registerServiceWorker(
  showSnackbar: SnackBarCb,
  $t: (key: string) => VueI18n.TranslateResult
) {
  if (process.env.NODE_ENV === "production") {
    register(`${process.env.BASE_URL}service-worker.js`, {
      ready() {
        console.log(
          "App is being served from cache by a service worker.\n" +
            "For more details, visit https://goo.gl/AFskqB"
        );
      },
      cached() {
        console.log("Content has been cached for offline use.");
        // At this point, everything has been precached.
        // It's the perfect time to display a
        // "Content is cached for offline use." message.
        showSnackbar($t("service-worker.is-cached").toString(), "OK");
      },
      updated() {
        console.log("New content is available; please refresh.");
        showSnackbar(
          $t("service-worker.new-content").toString(),
          $t("service-worker.reload").toString(),
          () => location.reload(true)
        );
      },
      offline() {
        console.log(
          "No internet connection found. App is running in offline mode."
        );
      },
      error(error: Error) {
        console.error("Error during service worker registration:", error);
      }
    });
  }
}
