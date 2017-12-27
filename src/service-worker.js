importScripts("workbox-sw.prod.v2.1.2.js");

const workboxSW = new WorkboxSW();
workboxSW.precache([]);

workboxSW.router.registerRoute(
  /^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/,
  workboxSW.strategies.cacheFirst()
);

workboxSW.router.registerNavigationRoute("index.html", {
  whitelist: [/^(?!\/__).*/]
});
