const path = require("path");
const sass = require("node-sass");

const paths = require("../config/paths");

module.exports = function() {
  "use strict";

  return sass.renderSync({
    file: path.resolve(paths.appSrc, "styles", "loading.scss"),
    outputStyle: "compressed"
  });
};
