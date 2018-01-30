"use strict";

const formatUtil = require("../../config/webpack/pluginUtils/formatUtil");

/**
 *
 * @param {string[]} errors List of errors to print.
 * @param {LabeledFormatter} out
 */
function printErrors(errors, out) {
  if (errors.length) {
    const eCnt = errors.length;
    out
      .endl()
      .error(
        `There ${eCnt === 1 ? "is" : "are"} ${eCnt} build error${
          eCnt === 1 ? "" : "s"
        }:`
      )
      .endl();

    errors.forEach(err => {
      out
        .raw(err)
        .endl()
        .endl();
    });
  }
}

/**
 *
 * @param {string[]} warnings List of errors to print.
 * @param {LabeledFormatter} out
 */
function printWarnings(warnings, out) {
  if (warnings.length) {
    const eCnt = warnings.length;

    out
      .endl()
      .warning(
        `There ${eCnt === 1 ? "is" : "are"} ${eCnt} build warning${
          eCnt === 1 ? "" : "s"
        }:`
      )
      .endl();

    warnings.forEach(warn => {
      out
        .raw(warn)
        .endl()
        .endl();
    });
  }
}

function formatWarnings(jsonified) {
  return jsonified.map(warn => formatUtil.formatWarning(warn));
}

function formatErrors(jsonified) {
  return jsonified.map(e => formatUtil.formatError(e));
}

function formatStats(jsonified) {
  jsonified.warnings = formatWarnings(jsonified.warnings);
  jsonified.errors = formatErrors(jsonified.errors);
  return jsonified;
}

module.exports = {
  formatStats,
  printWarnings,
  printErrors
};
