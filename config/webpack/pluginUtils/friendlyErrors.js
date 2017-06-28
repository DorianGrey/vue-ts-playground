/*
 The formatter and transformer mentioned here follow a suggestion from the issue list
 of the FriendlyErrorsWebpackPlugin:
 https://github.com/geowarin/friendly-errors-webpack-plugin/issues/38#issuecomment-300836179
 These are intended to handle arbitrarily formatted webpack errors.
 */

const _ = require("lodash");

// Transform functionality
function isWebpackError(e) {
  return (
    (!Array.isArray(e.originalStack) || !e.originalStack.length) &&
    e.file == null &&
    e.hasOwnProperty("webpackError")
  );
}

function transform(error) {
  if (isWebpackError(error)) {
    return Object.assign({}, error, {
      name: "Webpack error",
      type: "webpack-error"
    });
  }

  return error;
}

// Format functionality.
function concat() {
  const args = Array.from(arguments).filter(e => e !== null);
  const baseArray = Array.isArray(args[0]) ? args[0] : [args[0]];
  return Array.prototype.concat.apply(baseArray, args.slice(1));
}

function displayError(error) {
  return [error.webpackError, ""];
}

function format(errors) {
  // console.warn("Found linter errors:",errors);
  const lintErrors = errors.filter(e => e.type === "webpack-error");
  if (lintErrors.length > 0) {
    // console.warn("Found linter errors:",lintErrors);
    const flatten = (accum, curr) => accum.concat(curr);
    return concat(
      lintErrors.map(error => displayError(error)).reduce(flatten, [])
    );
  }
  return [];
}

module.exports = {
  transform,
  format
};
