"use strict";

const history = require("connect-history-api-fallback");
const convert = require("koa-connect");
const compress = require("koa-compress");
const paths = require("../paths");

module.exports = function(host, port, publicPath) {
  return {
    content: [paths.appPublic],
    dev: {
      publicPath,
      logLevel: "silent",
      stats: "errors-only"
    },
    hot: {
      logLevel: "silent",
      host
    },
    port,
    logLevel: "error",
    logTime: false,
    host,
    add: (app, middleware, options) => {
      const historyOptions = {
        // ... see: https://github.com/bripkens/connect-history-api-fallback#options
      };

      app.use(convert(history(historyOptions)));
      app.use(compress());
    }
  };
};
