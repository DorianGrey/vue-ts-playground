"use strict";

process.env.NODE_ENV = "production";

const path                   = require("path");
const chalk                  = require("chalk");
const renderLoadingAnimation = require("./util/renderLoading");
const formatUtil             = require("../config/formatUtil");

function printStats(stats) {
  console.log(stats.toString("minimal"));

  // This stuff is still work in progress...
  /*
  const writer = process.stdout.write.bind(process.stdout);

  if (jsonified.warnings.length) {
    const eCnt = jsonified.warnings.length;
    writer("\n");
    writer(formatUtil.formatWarning(`There ${eCnt === 1 ? "is" : "are"} ${eCnt} build warning${eCnt === 1 ? "": "s"}:\n`));
    jsonified.warnings.forEach(warn => {
      writer(formatUtil.formatWarning("\n" + warn) + "\n");
    });
  }

  if (jsonified.errors.length) {
    const eCnt = jsonified.errors.length;
    writer("\n");
    writer(formatUtil.formatWarning(`There ${eCnt === 1 ? "is" : "are"} ${eCnt} build error${eCnt === 1 ? "": "s"}:\n`));
    jsonified.errors.forEach(err => {
      writer(formatUtil.formatError("\n" + err) + "\n");
    });
  }
  */
}

formatUtil.cls();
process.stdout.write(formatUtil.formatInfo("Creating an optimized production build...\n"));
process.stdout.write(formatUtil.formatInfo("Rendering loading animation...\n"));

renderLoadingAnimation()
  .then(() => {
    process.stdout.write(formatUtil.formatInfo("Loading animation rendered, processing build...\n"));

    const webpack         = require("webpack");
    const presetToOptions = require("webpack/lib/Stats").presetToOptions;
    const chalk           = require("chalk");
    const fs              = require("fs-extra");

    const paths      = require("../config/paths");
    const prodConfig = require("../config/prod");

    const compiler      = webpack(prodConfig());
    const outputOptions = presetToOptions("none");
    fs.emptyDirSync(paths.appBuild);
    fs.emptyDirSync(paths.appBuildStats);
    fs.copySync(paths.appPublic, paths.appBuild, {
      dereference: true,
      filter: file => file !== paths.appHtml,
    });

    compiler.run((err, stats) => {
      if (err) {
        if (err.details) {
          console.err(err.details);
        }
        return reject(err);
      }
      printStats(stats);

      process.stdout.write(stats.toString(outputOptions) + "\n");

      process.stdout.write(`Use ${chalk.cyan("yarn serve")} or ${chalk.cyan("npm run serve")} to preview your production build.\n\n`);
      process.stdout.write(`Both a HTML and a JSON report about the generated bundles were generated to ${chalk.cyan(paths.appBuildStats + path.separator)}. These are useful to analyze your bundles' sizes.\n\n`)
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });



