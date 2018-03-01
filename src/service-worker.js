workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(
  /^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/,
  workbox.strategies.cacheFirst()
);

workbox.routing.registerNavigationRoute("index.html", {
  whitelist: [/^(?!\/__).*/]
});
