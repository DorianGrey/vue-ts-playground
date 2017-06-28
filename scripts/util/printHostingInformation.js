"use strict";

const chalk = require("chalk");
const path = require("path");

const paths = require("../../config/paths");
const formatUtil = require("./formatUtil");

function printHostingInformation(hasYarn) {
  const serveMessage = hasYarn ? "yarn serve" : "npm run serve";

  process.stdout.write(
    formatUtil.formatNote(
      `Use ${chalk.cyan(serveMessage)} to preview your production build.\n\n`
    )
  );
  process.stdout.write(
    formatUtil.formatNote(
      `Both a HTML and a JSON report about the generated bundles were generated to ${chalk.cyan(
        paths.appBuildStats + path.sep
      )}. These are useful to analyze your bundles' sizes.\n\n`
    )
  );
}

module.exports = printHostingInformation;
