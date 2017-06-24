"use strict";

process.env.NODE_ENV = "production";

const renderLoadingAnimation  = require("./util/renderLoading");
const formatUtil              = require("./util/formatUtil");
const statsFormatter          = require("./util/statsFormatter");
const printFileSizes          = require("./util/printFileSizes");
const printHostingInformation = require("./util/printHostingInformation");
const formatWebpackMessages   = require("./util/formatWebpackMessages");

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
    const webpack         = require("webpack");
    const fs              = require("fs-extra");

    const paths      = require("../config/paths");
    const prodConfig = require("../config/webpack/prod");

    const hasYarn  = fs.existsSync(paths.yarnLockFile);
    const compiler = webpack(prodConfig());

    writer(formatUtil.formatInfo("Clearing target directories...\n"));

    // const outputOptions = presetToOptions("none");
    fs.emptyDirSync(paths.appBuild);
    fs.emptyDirSync(paths.appBuildStats);
    fs.copySync(paths.appPublic, paths.appBuild, {
      dereference: true,
      filter: file => file !== paths.appHtml,
    });

    writer(formatUtil.formatInfo("Loading animation rendered, processing build...\n"));

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }
        const jsonified      = formatWebpackMessages(stats.toJson({}, true));
        const formattedStats = statsFormatter.formatStats(jsonified);

        statsFormatter.printWarnings(formattedStats.warnings, writer);

        if (formattedStats.errors.length) {
          return reject(formattedStats.errors);
        } else {

          printFileSizes(stats);
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



