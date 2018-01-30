"use strict";

const chalk = require("chalk");
const readline = require("readline");

exports.formatIndicator = function(indicator) {
  return `${chalk.bgCyan.white.bold("", indicator, "")}  `;
};

exports.formatDebug = function(text) {
  return `${chalk.bgBlack.white("", "D", "")} ${text}`;
};

exports.formatNote = function(text) {
  return `${chalk.bgWhite.black("", "N", "")} ${text}`;
};

exports.formatInfo = function(text) {
  return `${chalk.bgBlue.black("", "I", "")} ${text}`;
};

exports.formatWarning = function(text) {
  return `${chalk.bgYellow.black("", "WARNING", "")} ${text}`;
};

exports.formatError = function(text) {
  return `${chalk.bgRed.black("", "ERROR", "")} ${text}`;
};

exports.formatErrorLabel = function(text) {
  return `${chalk.bgRed.black("", text, "")}`;
};

exports.formatSuccess = function(text) {
  return `${chalk.bgGreen.black("", "SUCCESS", "")} ${text}`;
};

exports.softCls = function() {
  if (process.stdout.isTTY) {
    // Fill screen with blank lines. Then move to 0 (beginning of visible part) and clear it
    const blank = "\n".repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
};

exports.hardCls = function() {
  process.stdout.write(
    process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
  );
};

exports.formatFirstLineMessage = function(text) {
  return chalk.bgWhite.black(text);
};
