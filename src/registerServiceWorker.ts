// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

import { SnackbarService } from "buefy";
import VueI18n from "vue-i18n";

export default function register(
  $snackbar: SnackbarService,
  $t: typeof VueI18n.prototype.t
) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and
                  // the fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in your web app.
                  $snackbar.open({
                    message: $t("service-worker.new-content").toString(),
                    type: "is-success",
                    onAction: () => {
                      location.reload(true);
                    },
                    actionText: $t("service-worker.reload").toString(),
                    position: "is-bottom",
                    duration: 60000
                  });
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a
                  // "Content is cached for offline use." message.
                  $snackbar.open({
                    message: $t("service-worker.is-cached").toString(),
                    actionText: null,
                    position: "is-bottom",
                    duration: 5000
                  });
                }
              }
            };
          };
        })
        .catch(error => {
          $snackbar.open({
            message: $t("service-worker.failed-cache").toString(),
            type: "is-danger",
            position: "is-bottom",
            duration: 10000
          });
          console.warn(error);
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
