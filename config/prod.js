"use strict";

const path                                 = require("path");
const merge                                = require("webpack-merge");
const {
        NoEmitOnErrorsPlugin
      }                                    = require("webpack");
const CommonsChunkPlugin                   = require("webpack/lib/optimize/CommonsChunkPlugin");
const HashedModuleIdsPlugin                = require("webpack/lib/HashedModuleIdsPlugin");
const UglifyJsPlugin                       = require("webpack/lib/optimize/UglifyJsPlugin");
const InlineChunkManifestHtmlWebpackPlugin = require("inline-chunk-manifest-html-webpack-plugin");

const paths        = require("./paths");
const commonConfig = require("./common");

const publicPath = "/";
const publicUrl  = "";

if (process.env.NODE_ENV !== "production") {
  throw new Error("Production builds must have NODE_ENV=production.");
}

module.exports = function () {
  return merge.smart(commonConfig(false), {
    bail: true,
    entry: paths.appIndex,

    // TODO: Handle https://vue-loader.vuejs.org/en/configurations/extract-css.html !

    output: {
      path: paths.appBuild,
      filename: "static/js/[name].[chunkhash:8].js",
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      publicPath: publicPath,
      devtoolModuleFilenameTemplate: info =>
        path.relative(paths.appSrc, info.absoluteResourcePath),
    },

    plugins: [
      // Plugin to let the whole build fail on any error; i.e. do not tolerate these
      new NoEmitOnErrorsPlugin(),
      // For more consistent module IDs
      new HashedModuleIdsPlugin(),
      // Creates a dynamic vendor chunk by including all entries from the `node_modules` directory.
      new CommonsChunkPlugin({
        name: "vendor",
        minChunks: ({resource}) => /node_modules/.test(resource)
      }),
      // Externalizes the application manifest.
      new CommonsChunkPlugin("manifest"),
      // Generate a manifest file which contains a mapping of all asset filenames
      // to their corresponding output file so that tools can pick it up without
      // having to parse `index.html`.
      // Extracts the chunk manifest and inlines it into the template, while retaining
      // the original file.
      new InlineChunkManifestHtmlWebpackPlugin({
        filename: "asset-manifest.json",
        dropAsset: false
      }),
      new UglifyJsPlugin({
        compress: {
          warnings: false,
          // This feature has been reported as buggy a few times, such as:
          // https://github.com/mishoo/UglifyJS2/issues/1964
          // We'll wait with enabling it by default until it is more solid.
          reduce_vars: false,
        },
        output: {
          comments: false,
        },
        sourceMap: true,
      })

    ]
  });
};