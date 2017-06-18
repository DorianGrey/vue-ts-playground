"use strict";

const formatUtil = require("../../../scripts/util/formatUtil");

const logLevels = ["info", "warn", "error"];

let isCompiling     = true,
    logLevel        = "warn",
    stashedMessages = [];

function setCompiling(newValue) {
  isCompiling = newValue;

  if (newValue === false) {
    flushStash();
  }
}

function setLogLevel(newLevel) {
  logLevel = newLevel;
}

function checkAndHandle(message, targetLevel) {
  if (logLevels.indexOf(targetLevel) >= logLevels.indexOf(logLevel)) {
    handleMessage(message);
  }
}

function handleMessage(message) {
  if (isCompiling) {
    stashedMessages.push(message);
  } else {
    process.stdout.write(message + "\n");
  }
}

function error() {
  const message = formatUtil.formatError(Array.prototype.slice.call(arguments).join(","));
  checkAndHandle(message, "error");
}

function warn() {
  const message = formatUtil.formatWarning(Array.prototype.slice.call(arguments).join(","));
  checkAndHandle(message, "warn");
}

function info() {
  const message = formatUtil.formatInfo(Array.prototype.slice.call(arguments).join(","));
  checkAndHandle(message, "info");
}

function flushStash() {
  process.stdout.write("\n");
  stashedMessages.forEach(handleMessage);
  stashedMessages = [];
}

function getLogger() {
  return {
    info,
    warn,
    error
  };
}

module.exports = {
  setCompiling,
  flushStash,
  getLogger
};