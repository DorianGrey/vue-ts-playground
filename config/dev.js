"use strict";

const path                       = require("path");
const HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin");
const NamedModulesPlugin         = require("webpack/lib/NamedModulesPlugin");
const merge                      = require("webpack-merge");

const paths        = require("./paths");
const commonConfig = require("./common");

const publicPath = "/";
const publicUrl  = "";


module.exports = function () {
  return merge.smart(commonConfig(true, {}), {
    // TODO: This should be an array, also containing webpack's dev client.
    entry: [
      require.resolve("webpack-dev-server/client") + "?/",
      require.resolve("webpack/hot/dev-server"),
      paths.appIndex
    ],
    output: {
      path: paths.appBuild,
      filename: "static/js/bundle.js",
      chunkFilename: "static/js/[name].chunk.js",
      publicPath: publicPath,
      pathinfo: true,
      // Point sourcemap entries to original disk location
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath),
    },

    plugins: [
      new NamedModulesPlugin(),
      new HotModuleReplacementPlugin()
    ]
  });
};