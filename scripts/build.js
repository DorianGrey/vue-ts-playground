"use strict";

process.env.NODE_ENV = "production";

const renderLoadingAnimation = require("./util/renderLoading");

console.log("Creating an optimized production build...");

renderLoadingAnimation()
  .then(() => {

    const webpack         = require("webpack");
    const presetToOptions = require("webpack/lib/Stats").presetToOptions;
    const chalk           = require("chalk");
    const fs              = require("fs-extra");

    const paths      = require("../config/paths");
    const prodConfig = require("../config/prod");

    const compiler      = webpack(prodConfig());
    const outputOptions = presetToOptions("minimal");
    fs.emptyDirSync(paths.appBuild);
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
      process.stdout.write(stats.toString(outputOptions) + "\n");

      console.log(`Use ${chalk.cyan("yarn serve")} or ${chalk.cyan("npm run serve")} to preview your production build.`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });



