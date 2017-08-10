importScripts("workbox-sw.prod.v1.3.0.js");

const workboxSW = new WorkboxSW();
workboxSW.precache([]);

workboxSW.router.registerNavigationRoute("index.html", {
  whitelist: [/^(?!\/__).*/]
});
