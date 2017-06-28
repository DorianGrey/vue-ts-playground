"use strict";

const formatUtil = require("../../../scripts/util/formatUtil");

const logLevels = ["info", "warn", "error"];

class ForkPluginDeferLogger {
  constructor(isDev, logLevel, writer) {
    this.isDev = !!isDev;
    this.logLevel = logLevels.indexOf(logLevel) < 0 ? "warn" : logLevel;
    this.writer = writer
      ? writer
      : message => process.stdout.write(message + "\n");

    this.isCompiling = true;
    this.stashedMessages = [];

    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
  }

  apply(compiler) {
    const self = this;
    if (this.isDev) {
      compiler.plugin("invalid", function() {
        self.setCompiling(true);
      });
      compiler.plugin("done", function() {
        self.setCompiling(false);
      });
    } else {
      self.setCompiling(false);
    }
  }

  setCompiling(newValue) {
    this.isCompiling = newValue;

    if (newValue === false) {
      this.flushStash();
    }
  }

  flushStash() {
    this.stashedMessages.forEach(this.handleMessage, this);
  }

  checkAndHandle(message, targetLevel) {
    if (logLevels.indexOf(targetLevel) >= logLevels.indexOf(this.logLevel)) {
      this.handleMessage(message);
    }
  }

  handleMessage(message) {
    if (this.isCompiling) {
      this.stashedMessages.push(message);
    } else {
      this.writer(message);
    }
  }

  error() {
    const message = formatUtil.formatError(
      Array.prototype.slice.call(arguments).join(",")
    );
    this.checkAndHandle(message, "error");
  }

  warn() {
    const message = formatUtil.formatWarning(
      Array.prototype.slice.call(arguments).join(",")
    );
    this.checkAndHandle(message, "warn");
  }

  info() {
    const message = formatUtil.formatInfo(
      Array.prototype.slice.call(arguments).join(",")
    );
    this.checkAndHandle(message, "info");
  }
}

module.exports = ForkPluginDeferLogger;
