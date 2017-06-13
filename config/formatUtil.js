const chalk    = require("chalk");
const readline = require("readline");

exports.formatIndicator = function (indicator) {
  "use strict";
  return `${chalk.bgCyan.white.bold("", indicator, "")}  `;
};

exports.formatNote = function (text) {
  "use strict";
  return `${chalk.bgRed.white("", "N", "")} ${text}`;
};

exports.formatInfo = function (text) {
  "use strict";
  return `${chalk.bgBlue.black("", "I", "")} ${text}`;
};

exports.formatWarning = function (text) {
  "use strict";
  return `${chalk.bgYellow.black("", "WARNING", "")} ${text}`;
};

exports.formatError = function (text) {
  "use strict";
  return `${chalk.bgRed.black("", "ERROR", "")} ${text}`;
};

exports.cls = function () {
  "use strict";
  if (process.stdout.isTTY) {
    // Fill screen with blank lines. Then move to 0 (beginning of visible part) and clear it
    const blank = "\n".repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
};