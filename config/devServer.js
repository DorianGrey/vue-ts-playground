"use strict";

const paths = require("./paths");

module.exports = function () {
  return {
    historyApiFallback: true,
    clientLogLevel: "none",
    compress: true,
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    stats: "minimal",
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};