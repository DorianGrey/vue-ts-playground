"use strict";

process.env.NODE_ENV = "development";

const WebpackDevServer = require("webpack-dev-server");
const webpack          = require("webpack");
const chalk            = require("chalk");

const devConfig       = require("../config/dev");
const devServerConfig = require("../config/devServer");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST         = process.env.HOST || "0.0.0.0";

const compiler  = webpack(devConfig());
const devServer = new WebpackDevServer(compiler, devServerConfig());

devServer.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }

  console.log(`Starting development server at ${chalk.cyan(`${HOST}:${DEFAULT_PORT}`)}...`);

});

["SIGINT", "SIGTERM"].forEach(function (sig) {
  process.on(sig, function () {
    devServer.close();
    process.exit();
  });
});