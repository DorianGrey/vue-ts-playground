"use strict";

const path = require("path");
const merge = require("webpack-merge");

const HashedModuleIdsPlugin = require("webpack/lib/HashedModuleIdsPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const { InjectManifest } = require("workbox-webpack-plugin");
const glob = require("globby");

const paths = require("../paths");
const commonConfig = require("./common");

if (process.env.NODE_ENV !== "production") {
  throw new Error("Production builds must have NODE_ENV=production.");
}

// Note: defined here because it will be used more than once.
const cssFilename = "static/css/[name].[chunkhash:8].css"; // TODO: Turn into [contenthash] once available...

module.exports = function() {
  return merge.smart(commonConfig(false, paths.publicUrl), {
    bail: true,
    mode: "production",
    entry: paths.appIndex,

    output: {
      path: paths.appBuild,
      filename: "static/js/[name].[chunkhash:8].js",
      chunkFilename: "static/js/[name].[chunkhash:8].js",
      publicPath: paths.publicPath,
      devtoolModuleFilenameTemplate: info =>
        path.relative(paths.appSrc, info.absoluteResourcePath)
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            chunks: "all",
            test: /[\\\/]node_modules[\\\/]/,
            priority: -10,
            name: "vendor"
          }
        }
      },
      runtimeChunk: { name: "runtime" },
      minimizer: [
        new OptimizeCssAssetsPlugin({
          cssProcessor: require("cssnano"),
          cssProcessorOptions: {
            discardComments: { removeAll: true },
            map: { inline: false }
          },
          canPrint: true
        }),
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            ecma: 5,
            beautify: false,
            output: {
              comments: false
            },
            safari10: true
          }
        })
      ]
    },

    performance: false,

    plugins: [
      // For more consistent module IDs
      new HashedModuleIdsPlugin(),
      // Extract CSS, purify, dedupe and optimize it.
      new MiniCssExtractPlugin({
        filename: cssFilename,
        chunkFilename: cssFilename
        // allChunks: true
      }),
      new PurifyCSSPlugin({
        paths: glob.sync([
          paths.resolveApp("public/index.html"),
          paths.resolveApp("src/**/*.vue"),
          paths.resolveApp("node_modules/vuetify/es5/**/*.js")
        ]),
        styleExtensions: [".sass", ".scss", ".css", ".styl"],
        purifyOptions: {
          whitelist: [
            "*:not*", // See issue: https://github.com/purifycss/purifycss/issues/161
            ".notices", // Hierarchy not detected correctly.
            ".snackbar", // Same
            ".carousel-3d-container"
          ]
        }
      }),
      // Generate some information about the generated bundle size
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: path.join(
          paths.appBuildStats,
          "bundle-size-report.html"
        ),
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: path.join(
          paths.appBuildStats,
          "bundle-size-report.json"
        ),
        logLevel: "silent"
      }),

      new InjectManifest({
        // TODO: See if we can go back to "local".
        // This would pick up more modules than references atm. - try to figure out why!
        importWorkboxFrom: "cdn",
        globDirectory: paths.appBuild,
        globIgnores: ["**/*.map"],
        swDest: "service-worker.js",
        swSrc: path.join(paths.appSrc, "service-worker.js")
      })
    ]
  });
};
