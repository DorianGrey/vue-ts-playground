const path = require("path");
const webpackConfig = require("../webpack/test");

process.env.NODE_ENV = "development";

module.exports = function(config) {
  config.set({
    basePath: "",
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ["PhantomJS"],
    frameworks: ["mocha", "sinon-chai", "phantomjs-shim"],
    reporters: ["mocha", "junit", "coverage"],
    files: [{ pattern: "./index.ts", watch: false }],
    preprocessors: {
      // TODO: The "coverage" preprocessor is required here, but we have to figure out where exactly...
      "./index.ts": ["webpack", "sourcemap"]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    mochaReporter: {
      output: "minimal"
    },
    // The junit reporter is primarily used to provide a report that may be picked
    // up be almost every tool that can handle XUnit conforming reports. E.g. CI systems like Jenkins
    // have several plugins for this part of the process.
    junitReporter: {
      outputDir: "../../test-results/junit"
    },
    coverageReporter: {
      dir: "../../test-results",
      reporters: [
        { type: "lcov", subdir: "coverage" },
        { type: "text-summary", subdir: "coverage" }
      ]
    },

    port: 9876,
    colors: true,
    // Reduce output noise to a minimum in dev mode, so that the results are easier to keep an eye on.
    logLevel: config.LOG_WARN,
    autoWatch: false,
    singleRun: true
  });
};
