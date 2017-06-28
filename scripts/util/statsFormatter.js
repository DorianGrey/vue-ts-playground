"use strict";

const formatUtil = require("./formatUtil");

function printErrors(errors, writer) {
  if (errors.length) {
    const eCnt = errors.length;
    writer("\n");
    writer(
      formatUtil.formatError(
        `There ${eCnt === 1 ? "is" : "are"} ${eCnt} build error${eCnt === 1
          ? ""
          : "s"}:\n`
      )
    );
    errors.forEach(err => {
      writer(err + "\n\n");
    });
  }
}

function printWarnings(warnings, writer) {
  if (warnings.length) {
    const eCnt = warnings.length;
    writer("\n");
    writer(
      formatUtil.formatWarning(
        `There ${eCnt === 1 ? "is" : "are"} ${eCnt} build warning${eCnt === 1
          ? ""
          : "s"}:\n`
      )
    );
    warnings.forEach(warn => {
      writer(warn + "\n\n");
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
