"use strict";

/**
 *
 * @param {string[]} errors List of errors to print.
 * @param {Signale} out
 */
function printErrors(errors, out) {
  if (errors.length) {
    const eCnt = errors.length;
    out.error(
      `There ${eCnt === 1 ? "is" : "are"} ${eCnt} build error${
        eCnt === 1 ? "" : "s"
      }:`
    );

    errors.forEach(err => {
      out.error(err);
    });
  }
}

/**
 *
 * @param {string[]} warnings List of errors to print.
 * @param {Signale} out
 */
function printWarnings(warnings, out) {
  if (warnings.length) {
    const eCnt = warnings.length;

    out.warn(
      `There ${eCnt === 1 ? "is" : "are"} ${eCnt} build warning${
        eCnt === 1 ? "" : "s"
      }:`
    );

    warnings.forEach(warn => {
      out.warn(warn);
    });
  }
}

function formatWarnings(jsonified) {
  // return jsonified.map(warn => formatUtil.formatWarning(warn));
  return jsonified;
}

function formatErrors(jsonified) {
  // return jsonified.map(e => formatUtil.formatError(e));
  return jsonified;
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
