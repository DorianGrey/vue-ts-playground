"use strict";

const path = require("path");
const chalk = require("chalk");
const merge = require("webpack-merge");
const AutoDllPlugin = require("autodll-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const ErrorFormatterPlugin = require("../webpack/plugins/ErrorFormatterPlugin");
const paths = require("../paths");
const commonConfig = require("./common");
const {
  useLocalIp,
  DEFAULT_PORT,
  LOCAL_HOST_ADDRESS,
  PUBLIC_ADDRESS
} = require("../hostInfo");
const dllConfig = require("./dll");

const publicPath = "/";
const publicUrl = "";

module.exports = function() {
  return merge.smart(commonConfig(true, publicUrl), {
    mode: "development",
    entry: [
      // Set of polyfills required to get this at least somewhat working in IE11... LOL
      /*
        "core-js/modules/es7.object.values", // Vuetify
        "core-js/modules/es6.array.find",
        "core-js/modules/es6.array.from",
        "core-js/modules/es7.array.includes", // Vuetify
        "core-js/modules/es6.array.find-index", // Vuetify
        "core-js/modules/es6.string.repeat", // Vuetify
        "core-js/modules/es6.math.cbrt", // Vuetify
        "core-js/es6/promise",
        */
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
        path.resolve(info.absoluteResourcePath)
    },

    optimization: {
      noEmitOnErrors: true
    },

    plugins: [
      new ErrorFormatterPlugin(),
      // Note: This plugin has to added AFTER the HtmlWebpackPlugin, otherwise, its "inject" option won't work.
      new AutoDllPlugin(dllConfig),
      // See https://github.com/mzgoddard/hard-source-webpack-plugin
      new HardSourceWebpackPlugin({
        info: {
          level: "warn"
        }
      })
    ]
  });
};
