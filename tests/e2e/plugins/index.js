// https://docs.cypress.io/guides/guides/plugins-guide.html
/* eslint-disable import/no-extraneous-dependencies global-require */
const webpack = require("@cypress/webpack-preprocessor");

module.exports = (on, config) => {
  on("file:preprocessor", webpack({
    webpackOptions: {
      resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: { transpileOnly: false }
          }
        ]
      }
    },
    watchOptions: {}
  }));

  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js"
  });
};
