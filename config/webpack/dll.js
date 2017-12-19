const paths = require("../paths");

const packageJson = Object(require(paths.appPackageJson));
const depNames = Object.getOwnPropertyNames(packageJson.dependencies);

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
