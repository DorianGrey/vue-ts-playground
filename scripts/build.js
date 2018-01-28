"use strict";

process.env.NODE_ENV = "production";

const path = require("path");
const glob = require("globby");
const shelljs = require("shelljs");

const renderLoadingAnimation = require("./util/renderLoading");
const formatUtil = require("./util/formatUtil");
const statsFormatter = require("./util/statsFormatter");
const printFileSizes = require("./util/printFileSizes");
const printHostingInformation = require("./util/printHostingInformation");
const formatWebpackMessages = require("./util/formatWebpackMessages");
const determineFileSizesBeforeBuild = require("./util/determineFileSizesBeforeBuild");
const paths = require("../config/paths");

formatUtil.cls();
const writer = process.stdout.write.bind(process.stdout);

process.on("unhandledRejection", err => {
  writer(formatUtil.formatError(`${err}\n`));
  throw err;
});

writer(formatUtil.formatInfo("Creating an optimized production build...\n"));
writer(formatUtil.formatInfo("Rendering loading animation...\n"));

renderLoadingAnimation()
  .then(() => {
    let previousFileSizes;
    try {
      previousFileSizes = determineFileSizesBeforeBuild(paths.appBuild);
    } catch (e) {
      writer(
        formatUtil.formatError(
          "Determining file sizes before build failed, due to",
          e,
          "Going ahead with empty object.\n"
        )
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
      process.stdout.write(formatUtil.formatError(e));
      process.exit(1);
    }

    writer(formatUtil.formatInfo("Clearing target directories...\n"));

    // const outputOptions = presetToOptions("none");
    fs.emptyDirSync(paths.appBuild);
    fs.emptyDirSync(paths.appBuildStats);

    writer(formatUtil.formatInfo("Copying non-referenced static files...\n"));
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

    writer(formatUtil.formatInfo("Processing build...\n"));

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }
        const jsonified = formatWebpackMessages(stats.toJson({}, true));
        const formattedStats = statsFormatter.formatStats(jsonified);

        statsFormatter.printWarnings(formattedStats.warnings, writer);

        if (formattedStats.errors.length) {
          return reject(formattedStats.errors);
        } else {
          printFileSizes(previousFileSizes, stats, staticAssets);
          printHostingInformation(hasYarn);

          resolve();
        }
      });
    });
  })
  .catch(errors => {
    statsFormatter.printErrors(errors, writer);
    process.exit(1);
  });
