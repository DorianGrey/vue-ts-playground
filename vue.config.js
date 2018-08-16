const PurgeCssPlugin = require("purgecss-webpack-plugin");
const glob           = require("globby");
const paths          = require("./config/paths");

module.exports = {
  outputDir: "build",
  lintOnSave: false,
  pwa: {
    manifestPath: "manifest.webmanifest",
    name: "Demo App",
    themeColor: "#F5F5F5",
    mobileWebAppCapable: "yes",
    appleMobileWebAppCapable: "no",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    workboxOptions: {
      // We're forcing this - otherwise, request the user to reload the page
      // would not behave as intended.
      skipWaiting: true,
      clientsClaim: true
    }
  },
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args.forEach(arg => {
          arg.loadingCss = require("./scripts/renderLoading")().css;
        });
        return args;
      });

    config
      .when(process.env.NODE_ENV === "production", config => {
        // Use a runtime chunk to optimize cache busting.
        // Otherwise, the runtime information would be added to the entry point.
        config
          .optimization
          .runtimeChunk({ name: "runtime" });

        // Configure style purging.
        const purgeOptions = {
          paths: glob.sync([
            paths.resolveApp("public/index.html"),
            paths.resolveApp("src/**/*.vue"),
            paths.resolveApp("node_modules/vuetify/es5/**/*.js")
          ]),
          styleExtensions: [".sass", ".scss", ".css", ".styl"],
          whitelist: [
            "*:not*", // See issue: https://github.com/purifycss/purifycss/issues/161
            ".notices", // Hierarchy not detected correctly.
            ".snackbar", // Same
            ".carousel-3d-container"
          ],
          whitelistPatterns: [
            /v-input__(append|prepend)-outer/,
            /picker(-reverse)?-transition/,
            /tab(-reverse)?-transition/,
            /--text$/
          ]
        };
        config
          .plugin("purgecss")
          .use(PurgeCssPlugin, [purgeOptions]) // Mind the array!
        ;

        // Configure workbox to exclude manifest.webmanifest (only excludes manifest.json by default)
        config
          .plugin("workbox")
          .tap(args => {
            args.forEach(arg => {
              arg.exclude.push(/manifest\.webmanifest$/);
            });
            return args;
          })
        ;
      });
  }
};