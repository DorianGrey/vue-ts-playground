"use strict";

const chalk = require("chalk");
const path = require("path");

const paths = require("../../config/paths");

/**
 *
 * @param {Boolean} hasYarn
 * @param {LabeledFormatter} out
 */
function printHostingInformation(hasYarn, out) {
  const serveMessage = hasYarn ? "yarn serve" : "npm run serve";

  out
    .note(`Use ${chalk.cyan(serveMessage)} to preview your production build.`)
    .endl()
    .endl();
  out
    .note(
      `Both a HTML and a JSON report about the generated bundles were generated to ${chalk.cyan(
        paths.appBuildStats + path.sep
      )}. These are useful to analyze your bundles' sizes.`
    )
    .endl()
    .endl();
}

module.exports = printHostingInformation;
