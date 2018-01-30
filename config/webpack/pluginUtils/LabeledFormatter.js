"use strict";

const {
  formatFirstLineMessage,
  formatIndicator,
  formatDebug,
  formatNote,
  formatInfo,
  formatWarning,
  formatError,
  formatErrorLabel,
  formatSuccess,
  softCls,
  hardCls
} = require("./formatUtil");

class LabeledFormatter {
  constructor(writer) {
    this.writer = writer || process.stdout.write.bind(process.stdout);
  }

  indicated(indicator) {
    this.writer(formatIndicator(indicator));
    return this;
  }

  raw(text) {
    this.writer(text);
    return this;
  }

  note(text) {
    this.writer(formatNote(text));
    return this;
  }

  debug(text) {
    this.writer(formatDebug(text));
    return this;
  }

  info(text) {
    this.writer(formatInfo(text));
    return this;
  }

  warning(text) {
    this.writer(formatWarning(text));
    return this;
  }

  error(text) {
    this.writer(formatError(text));
    return this;
  }

  errorLabel(text) {
    this.writer(formatErrorLabel(text));
    return this;
  }

  success(text) {
    this.writer(formatSuccess(text));
    return this;
  }

  endl() {
    this.writer("\n");
    return this;
  }

  softCls() {
    softCls();
    return this;
  }

  hardCls() {
    hardCls();
    return this;
  }

  formatFirstLineMessage(text) {
    this.writer(formatFirstLineMessage(text));
    return this;
  }
}

module.exports = LabeledFormatter;
