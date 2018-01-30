"use strict";

process.env.NODE_ENV = "production";

const path = require("path");
const glob = require("globby");
const shelljs = require("shelljs");

const renderLoadingAnimation = require("./util/renderLoading");
const LabeledFormatter = require("../config/webpack/pluginUtils/LabeledFormatter");
const statsFormatter = require("./util/statsFormatter");
const printFileSizes = require("./util/printFileSizes");
const printHostingInformation = require("./util/printHostingInformation");
const formatWebpackMessages = require("./util/formatWebpackMessages");
const determineFileSizesBeforeBuild = require("./util/determineFileSizesBeforeBuild");
const paths = require("../config/paths");

const out = new LabeledFormatter();

out.softCls();

process.on("unhandledRejection", err => {
  out.error(`${err}`).endl();
  throw err;
});

out.info("Creating an optimized production build...").endl();
out.info("Rendering loading animation...").endl();

renderLoadingAnimation()
  .then(() => {
    let previousFileSizes;
    try {
      previousFileSizes = determineFileSizesBeforeBuild(paths.appBuild);
    } catch (e) {
      out
        .error(
          `Determining file sizes before build failed, due to ${e}, going ahead with empty object.`
        )
        .endl();
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
      out.error(e).endl();
      process.exit(1);
    }

    out.info("Clearing target directories...").endl();

    // const outputOptions = presetToOptions("none");
    fs.emptyDirSync(paths.appBuild);
    fs.emptyDirSync(paths.appBuildStats);

    out.info("Copying non-referenced static files...").endl();
    fs.copySync(paths.appPublic, paths.appBuild, {
      dereference: true,
      filter: file => file !== paths.appHtml
    });
    const pa = require.resolve("workbox-sw"),
      swTargetPath = path.join(paths.appBuild, path.basename(pa)),
      paMap = pa + ".map",
      swMapPath = path.join(paths.appBuild, path.basename(pa) + ".map");

    fs.copySync(pa, swTargetPath, {
      dereference: true
    });
    fs.copySync(paMap, swMapPath, {
      dereference: true
    });

    // Update service-worker script to properly update its referenced Workbox.js version.
    shelljs.sed(
      "-i",
      /workbox-sw\.prod\.v\d.\d.\d\.js/i,
      path.basename(pa),
      path.resolve(paths.appSrc, "service-worker.js")
    );

    // Determine copied paths, and add the generated service worker stuff as well
    // used for properly generating an output.
    const staticAssets = glob
      .sync([paths.appPublic + "**/*", `!${paths.appPublic}/index.html`])
      .map(p => path.relative(paths.appPublic, p));

    staticAssets.push(
      path.relative(paths.appBuild, swTargetPath),
      path.relative(paths.appBuild, swMapPath),
      "service-worker.js"
    );

    out.info("Processing build...").endl();

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }
        const jsonified = formatWebpackMessages(stats.toJson({}, true));
        const formattedStats = statsFormatter.formatStats(jsonified);

        statsFormatter.printWarnings(formattedStats.warnings, out);

        if (formattedStats.errors.length) {
          return reject(formattedStats.errors);
        } else {
          printFileSizes(previousFileSizes, stats, staticAssets);
          printHostingInformation(hasYarn, out);

          resolve();
        }
      });
    });
  })
  .catch(errors => {
    statsFormatter.printErrors(errors, out);
    process.exit(1);
  });
