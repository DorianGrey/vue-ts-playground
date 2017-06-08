"use strict";

process.env.NODE_ENV = "development";

const WebpackDevServer = require("webpack-dev-server");
const webpack          = require("webpack");
// const chalk            = require("chalk");

const devConfig                            = require("../config/dev");
const devServerConfigFactory               = require("../config/devServer");
const {DEFAULT_PORT, HOST, PUBLIC_ADDRESS} = require("../config/hostInfo");

const compiler        = webpack(devConfig());
const devServerConfig = devServerConfigFactory(HOST, PUBLIC_ADDRESS, DEFAULT_PORT);
const devServer       = new WebpackDevServer(compiler, devServerConfig);

devServer.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }
  //
  // console.log(`Starting development server at ${chalk.cyan(`${HOST}:${DEFAULT_PORT}`)}...`);
  // if (devServerConfig.public.indexOf(HOST) === -1) {
  //   console.log(`Server is publicly available via ${chalk.cyan(devServerConfig.public)}...`);
  // }

});

["SIGINT", "SIGTERM"].forEach(function (sig) {
  process.on(sig, function () {
    devServer.close();
    process.exit();
  });
});