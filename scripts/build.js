"use strict";

process.env.NODE_ENV = "production";

const webpack         = require("webpack");
const presetToOptions = require("webpack/lib/Stats").presetToOptions;
const chalk           = require("chalk");
const fs              = require("fs-extra");

const paths      = require("../config/paths");
const prodConfig = require("../config/prod");


console.log("Creating an optimized production build...");

const compiler      = webpack(prodConfig());
const outputOptions = presetToOptions("minimal");

fs.emptyDirSync(paths.appBuild);
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

