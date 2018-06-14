"use strict";

process.env.NODE_ENV = "production";

const path = require("path");
const glob = require("globby");
const shelljs = require("shelljs");

const renderLoadingAnimation = require("./util/renderLoading");
const { softCls } = require("../config/formatUtil");
const { buildLog, log } = require("../config/logger");
const statsFormatter = require("./util/statsFormatter");
const printFileSizes = require("./util/printFileSizes");
const printHostingInformation = require("./util/printHostingInformation");
const formatWebpackMessages = require("./util/formatWebpackMessages");
const determineFileSizesBeforeBuild = require("./util/determineFileSizesBeforeBuild")
  .determineFileSizes;
const paths = require("../config/paths");

softCls();

process.on("unhandledRejection", err => {
  log.error(err);
  throw err;
});

buildLog.await("Creating an optimized production build...");
buildLog.await("Rendering loading animation...");

async function build() {
  await renderLoadingAnimation();
  let previousFileSizes;
  try {
    previousFileSizes = determineFileSizesBeforeBuild(paths.appBuild);
  } catch (e) {
    log.error(
      `Determining file sizes before build failed, due to ${e}, going ahead with empty object.`
    );
    previousFileSizes = {
      root: paths.appBuild,
      sizes: {}
    };
  }
  const webpack = require("webpack");
  const fs = require("fs-extra");

  const prodConfig = require("../config/webpack/prod");

  const hasYarn = fs.existsSync(paths.yarnLockFile);
  let compiler;
  try {
    compiler = webpack(prodConfig());
  } catch (e) {
    buildLog.error(e);
    process.exit(1);
  }

  buildLog.await("Clearing target directories...");

  // const outputOptions = presetToOptions("none");
  fs.emptyDirSync(paths.appBuild);
  fs.emptyDirSync(paths.appBuildStats);

  buildLog.await("Copying non-referenced static files...");
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });

  // Determine copied paths, and add the generated service worker stuff as well
  // used for properly generating an output.
  const staticAssets = glob
    .sync([
      paths.appPublic + "/**/*",
      `!${paths.appPublic}/index.template.html`
    ])
    .map(p => path.relative(paths.appPublic, p));

  buildLog.await("Processing build...");

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const jsonified = formatWebpackMessages(stats.toJson({}, true));
      const formattedStats = statsFormatter.formatStats(jsonified);

      statsFormatter.printWarnings(formattedStats.warnings, log);

      if (formattedStats.errors.length) {
        return reject(formattedStats.errors);
      } else {
        printFileSizes(previousFileSizes, stats, staticAssets);
        printHostingInformation(hasYarn, log);

        resolve();
      }
    });
  });
}

build().catch(errors => {
  statsFormatter.printErrors(errors, log);
  process.exit(1);
});
