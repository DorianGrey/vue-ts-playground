"use strict";

const paths = require("../paths");

module.exports = function(publicHost, port, publicPath) {
  return {
    quiet: true, // Performed by FriendlyErrorsWebpackPlugin

    historyApiFallback: true,
    clientLogLevel: "none",
    compress: true,
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    inline: true,
    stats: "minimal",
    host: "::",
    publicPath,
    watchOptions: {
      ignored: /node_modules/
    },
    public: `${publicHost}:${port}`,
    overlay: {
      errors: true,
      warnings: false
    }
  };
};
