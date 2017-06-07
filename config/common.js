"use strict";

const {DefinePlugin}           = require("webpack");
const HtmlWebpackPlugin        = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

const paths = require("./paths");

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

const PLUGIN_HTML = function (isDev) {
  const minify = isDev ? false : {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  };

  return new HtmlWebpackPlugin({
    filename: "index.html", // Keep in mind that the output path gets prepended to this name automatically.
    inject: "body",
    template: paths.appHtml,
    minify,
    // Custom config.
    title: "Demo App",
    devMode: isDev,
    baseHref: "/",
    // loadingCss: loadingAnimation.css
  });
};

module.exports = function (isDev) {
  return {
    // resolve TypeScript and Vue file
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
          use: [
            {
              loader: "string-replace-loader", // For being able to use webpack's import() function without causing conflicts with the TS parser.
              query: {
                search: "_import_",
                replace: "import",
                flags: "g"
              }
            },
            {
              loader: "ts-loader",
              options: {
                appendTsSuffixTo: [/\.vue$/],
                // transpileOnly: true
              }
            }
          ]
        }
      ]
    },

    node: nodeOptions,

    performance: {
      hints: isDev ? false : "warning"
    },

    resolve: {
      extensions: [".ts", ".vue", ".js"]
    },

    devtool: isDev ? "inline-source-map" : "source-map",

    stats: "minimal",

    plugins: [
      PLUGIN_HTML(isDev),
      new CaseSensitivePathsPlugin(),
      new DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(isDev ? "development" : "production")
        }
      })
    ]
  }
};