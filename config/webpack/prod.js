"use strict";

const path = require("path");
const merge = require("webpack-merge");
const { NoEmitOnErrorsPlugin } = require("webpack");

const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const NamedModulesPlugin = require("webpack/lib/NamedModulesPlugin");
const NamedChunksPlugin = require("webpack/lib/NamedChunksPlugin");
const NameAllModulesPlugin = require("name-all-modules-plugin");

const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const InlineChunkManifestHtmlWebpackPlugin = require("inline-chunk-manifest-html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const ShakePlugin = require("webpack-common-shake").Plugin;
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");
const glob = require("globby");

const paths = require("../paths");
const commonConfig = require("./common");

const shouldUseRelativeAssetPaths = paths.publicPath === "./";

if (process.env.NODE_ENV !== "production") {
  throw new Error("Production builds must have NODE_ENV=production.");
}

// Note: defined here because it will be used more than once.
const cssFilename = "static/css/[name].[contenthash:8].css";

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split("/").length).join("../") }
  : {};

module.exports = function() {
  // Transformer to remove revision info in case the output file already contains
  // a hash (i.e. webpack output).
  const hashRegExp = /\.\w{8}\./;
  const removeRevisionTransform = manifestEntries => {
    return manifestEntries.map(entry => {
      if (hashRegExp.test(entry.url)) {
        delete entry.revision;
      }
      return entry;
    });
  };

  return merge.smart(
    commonConfig(false, extractTextPluginOptions, paths.publicUrl),
    {
      bail: true,
      entry: paths.appIndex,

      // TODO: Handle https://vue-loader.vuejs.org/en/configurations/extract-css.html !

      output: {
        path: paths.appBuild,
        filename: "static/js/[name].[chunkhash:8].js",
        chunkFilename: "static/js/[name].[chunkhash:8].chunk.js",
        publicPath: paths.publicPath,
        devtoolModuleFilenameTemplate: info =>
          path.relative(paths.appSrc, info.absoluteResourcePath)
      },

      plugins: [
        // Plugin to let the whole build fail on any error; i.e. do not tolerate these
        new NoEmitOnErrorsPlugin(),

        // For more consistent module identifiers.
        new NamedModulesPlugin(),
        // In case any chunk does NOT yet have a name...
        new NamedChunksPlugin(chunk => {
          if (chunk.name) {
            return chunk.name;
          }
          return (
            chunk
              .mapModules(m => {
                if (!m.context || !m.request) {
                  return null;
                }
                return path.relative(m.context, m.request);
              })
              .filter(Boolean)
              .join("_") || null
          );
        }),
        // In case anyone does NOT yet have a name...
        new NameAllModulesPlugin(),

        // Creates a dynamic vendor chunk by including all entries from the `node_modules` directory.
        new CommonsChunkPlugin({
          name: "vendor",
          minChunks: ({ resource }) => /node_modules/.test(resource)
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
          dropAsset: true
        }),
        // Extract CSS, purify, dedupe and optimize it.
        new ExtractTextPlugin({
          filename: cssFilename
        }),
        new PurifyCSSPlugin({
          paths: glob.sync([
            paths.resolveApp("public/index.html"),
            paths.resolveApp("src/**/*.vue"),
            paths.resolveApp("node_modules/flatpickr/**/*.js"),
            paths.resolveApp(
              "node_modules/buefy/src/components/snackbar/Snackbar.vue"
            )
          ]),
          styleExtensions: [".sass", ".scss", ".css"],
          purifyOptions: {
            whitelist: ["*:not*"] // See issue: https://github.com/purifycss/purifycss/issues/161
          }
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessor: require("cssnano"),
          cssProcessorOptions: { discardComments: { removeAll: true } },
          canPrint: true
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

        new ModuleConcatenationPlugin(),

        new WorkboxPlugin({
          globDirectory: paths.appBuild,
          globPatterns: ["**/*.{html,js,css,jpg,eot,svg,woff2,woff,ttf,json}"],
          globIgnores: ["**/*.map"],
          swDest: path.join(paths.appBuild, "service-worker.js"),
          swSrc: path.join(paths.appSrc, "service-worker.js"),
          manifestTransforms: [removeRevisionTransform]
        }),

        // Improved tree-shaking for CJS modules... at least as far as safely possible.
        new ShakePlugin(),
        new UglifyJsPlugin({
          compress: {
            warnings: false,
            // This feature has been reported as buggy a few times, such as:
            // https://github.com/mishoo/UglifyJS2/issues/1964
            // We'll wait with enabling it by default until it is more solid.
            reduce_vars: false
          },
          output: {
            comments: false
          },
          sourceMap: true
        })
      ]
    }
  );
};
