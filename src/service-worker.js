importScripts("workbox-sw.prod.v2.1.1.js");

const workboxSW = new WorkboxSW();
workboxSW.precache([]);

workboxSW.router.registerNavigationRoute("index.html", {
  whitelist: [/^(?!\/__).*/]
});
