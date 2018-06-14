const paths = require("../paths");

const packageJson = Object(require(paths.appPackageJson));
// Simply pick up all direct dependencies except those with in a non-js index file.
const depNames = Object.getOwnPropertyNames(packageJson.dependencies).filter(
  s => !s.includes("sanitize.css")
);

// Note: This config refers to the autodll-webpack-plugin config as mentioned here: https://github.com/asfktz/autodll-webpack-plugin/
// It will NOT WORK with default webpack.
module.exports = {
  inject: true, // will inject the DLL bundle to index.html
  entry: {
    vendor: depNames
  },
  filename: "[name].dll.js",
  context: paths.appRoot
};
