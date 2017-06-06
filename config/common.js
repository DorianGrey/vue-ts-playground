"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");

const paths = require("./paths");

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
    plugins: [
      PLUGIN_HTML(isDev)
    ]
  }
};