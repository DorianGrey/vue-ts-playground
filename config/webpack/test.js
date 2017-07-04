const merge = require("webpack-merge");
const { NoEmitOnErrorsPlugin } = require("webpack");
const NamedModulesPlugin = require("webpack/lib/NamedModulesPlugin");

const commonConfig = require("./common");
const paths = require("../paths");

// TODO: Optimize loaders - most of the stuff is not required.
// TODO: Coverage is not working atm. - need to fix this somehow.

module.exports = merge.smartStrategy({ plugins: "replace" })(
  commonConfig(true, {}, ""),
  {
    output: {
      path: paths.appBuild
    },
    plugins: [new NamedModulesPlugin(), new NoEmitOnErrorsPlugin()]
  }
);
