"use strict";

const path = require("path");
const chalk = require("chalk");
const { NoEmitOnErrorsPlugin } = require("webpack");
const HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin");
const NamedModulesPlugin = require("webpack/lib/NamedModulesPlugin");
const merge = require("webpack-merge");

const ErrorFormatterPlugin = require("../webpack/plugins/ErrorFormatterPlugin");
const paths = require("../paths");
const commonConfig = require("./common");
const { DEFAULT_PORT, HOST, PUBLIC_ADDRESS } = require("../hostInfo");

const publicPath = "/";
const publicUrl = "";

module.exports = function() {
  // Note: We're using the "prepend" strategy here to ensure
  // that "FriendlyErrorsWebpackPlugin" is registered before the
  // logger that handles deferred messages.
  return merge.smartStrategy({ plugins: "prepend" })(
    commonConfig(true, {}, publicUrl),
    {
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
          path.resolve(info.absoluteResourcePath)
      },

      plugins: [
        new NamedModulesPlugin(),
        new HotModuleReplacementPlugin(),
        new NoEmitOnErrorsPlugin(),
        new ErrorFormatterPlugin({
          successMessages: [
            `Development server is available at:
            
                Local: ${chalk.cyan(`${HOST}:${DEFAULT_PORT}`)}
                Public: ${chalk.cyan(`${PUBLIC_ADDRESS}:${DEFAULT_PORT}`)}
            `
          ]
        })
      ]
    }
  );
};
