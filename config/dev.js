"use strict";

const path                       = require("path");
const HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin");
const CaseSensitivePathsPlugin   = require("case-sensitive-paths-webpack-plugin");
const NamedModulesPlugin         = require("webpack/lib/NamedModulesPlugin");
const merge                      = require("webpack-merge");

const paths        = require("./paths");
const commonConfig = require("./common");

const publicPath = "/";
const publicUrl  = "";

const nodeOptions = {
  fs: "empty",
  net: "empty",
  tls: "empty",
  global: true,
  crypto: "empty",
  process: true,
  module: false,
  clearImmediate: false,
  setImmediate: false
};

module.exports = function () {
  return merge.smart(commonConfig(true), {
    entry: paths.appIndex,
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
    // resolve TypeScript and Vue file
    resolve: {
      extensions: [".ts", ".vue", ".js"]
    },

    module: {
      strictExportPresence: true,

      rules: [
        {
          test: /\.vue$/,
          use: {
            loader: "vue-loader",
            options: {
              loaders: {
                js: "ts-loader"
              },
              esModule: true,
              postcss: () => [
                require("postcss-flexbugs-fixes"),
                require("autoprefixer")({
                  browsers: [
                    ">1%",
                    "last 4 versions",
                    "Firefox ESR",
                    "not ie < 9", // Vuejs doesn't support IE8 anyway
                  ],
                  flexbox: "no-2009",
                }),
              ]
            }
          }
        },
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              // transpileOnly: true
            }
          }
        }
      ]
    },

    node: nodeOptions,

    performance: {
      hints: false
    },

    devtool: "inline-source-map",

    stats: "minimal",

    plugins: [
      new NamedModulesPlugin(),
      new HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
    ]
  });
};