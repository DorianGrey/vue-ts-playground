const statsFormatter = require("../../../scripts/util/statsFormatter");
const formatWebpackMessages = require("../../../scripts/util/formatWebpackMessages");

const LabeledFormatter = require("../pluginUtils/LabeledFormatter");

function msToPeriod(ms) {
  "use strict";
  ms = Math.round(ms);

  const divisorSecond = 1000,
    divisorMinute = 60 * divisorSecond,
    divisorHour = 60 * divisorMinute;

  const hours = Math.floor(ms / divisorHour);
  ms = ms % divisorHour;

  const minutes = Math.floor(ms / divisorMinute);
  ms = ms % divisorMinute;

  const seconds = Math.ceil(ms / divisorSecond);
  ms = ms % divisorSecond;

  let result = [];
  if (hours > 0) {
    result.push(`${hours}h`);
  }

  if (minutes > 0) {
    result.push(`${minutes}m`);
  }

  if (seconds > 0) {
    result.push(`${seconds}s`);
  }

  if (ms > 0) {
    result.push(`${ms}ms`);
  }

  return result.join(" ");
}

class ErrorFormatterPlugin {
  constructor(options) {
    this.options = options || {};
    this.options.successMessages = this.options.successMessages || [];
    this.options.clear = this.options.clear || {};
    this.options.clear.mode = this.options.clear.mode || "soft";
    this.options.clear.onInvalid =
      typeof this.options.clear.onInvalid === "boolean"
        ? this.options.clear.onInvalid
        : true;
    this.options.clear.onDone =
      typeof this.options.clear.onDone === "boolean"
        ? this.options.clear.onDone
        : false;

    this.out = new LabeledFormatter();

    this.cls = (this.options.clear.mode === "soft"
      ? this.out.softCls
      : this.out.hardCls
    ).bind(this.out);
  }

  apply(compiler) {
    compiler.plugin("done", stats => {
      this.options.clear.onDone && this.cls();
      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();
      const compileTime = getCompileTime(stats);
      const time = msToPeriod(compileTime);

      if (!hasErrors && !hasWarnings) {
        this.out
          .endl()
          .success(`Compiled successfully in ${time}.`)
          .endl();

        if (this.options.successMessages.length > 0) {
          this.out.endl();
          this.options.successMessages.forEach(msg => {
            this.out.note(msg).endl();
          });
          this.out.endl();
        }
      } else {
        this.out.errorLabel(`Compilation failed after ${time}. `).endl();
        this.displayMalfunctions(hasErrors, hasWarnings, stats);
      }
    });

    compiler.plugin("invalid", () => {
      this.options.clear.onInvalid && this.cls();
      this.out.info("Compiling...").endl();
    });
  }

  displayMalfunctions(hasErrors, hasWarnings, stats) {
    const jsonified = formatWebpackMessages(stats.toJson({}, true));
    const formattedStats = statsFormatter.formatStats(jsonified);

    if (hasWarnings) {
      this.out.endl();
      statsFormatter.printWarnings(formattedStats.warnings, this.out);
    }

    if (hasErrors) {
      this.out.endl();
      statsFormatter.printErrors(formattedStats.errors, this.out);
    }
  }
}

function getCompileTime(stats) {
  if (stats.stats) {
    // Webpack multi compilations run in parallel so using the longest duration.
    // https://webpack.github.io/docs/configuration.html#multiple-configurations
    return stats.stats.reduce(
      (time, stats) => Math.max(time, getCompileTime(stats)),
      0
    );
  }
  return stats.endTime - stats.startTime;
}

module.exports = ErrorFormatterPlugin;
