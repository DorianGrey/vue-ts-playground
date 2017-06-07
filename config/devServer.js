"use strict";


const paths               = require("./paths");
const selectPublicAddress = require("./selectPublicAddress");

module.exports = function (selectedHost, port) {
  const selectedPublicAddress = selectPublicAddress(selectedHost);

  return {
    historyApiFallback: true,
    clientLogLevel: "none",
    compress: true,
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    inline: true,
    stats: "minimal",
    watchOptions: {
      ignored: /node_modules/,
    },
    public: `${selectedPublicAddress}:${port}`
  };
};