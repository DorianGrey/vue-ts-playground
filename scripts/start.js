"use strict";

process.env.NODE_ENV = "development";

const chalk                  = require("chalk");
const renderLoadingAnimation = require("./util/renderLoading");
const formatUtil             = require("./util/formatUtil");

formatUtil.cls();
process.stdout.write(formatUtil.formatInfo("Starting development environment...\n"));
process.stdout.write(formatUtil.formatInfo("Rendering loading animation...\n"));

renderLoadingAnimation()
  .then(() => {
    process.stdout.write(formatUtil.formatInfo("Loading animation rendered, starting server...\n"));

    const WebpackDevServer = require("webpack-dev-server");
    const webpack          = require("webpack");

    const devConfig                            = require("../config/webpack/dev");
    const devServerConfigFactory               = require("../config/webpack/devServer");
    const {DEFAULT_PORT, HOST, PUBLIC_ADDRESS} = require("../config/hostInfo");

    const compiler        = webpack(devConfig());
    const devServerConfig = devServerConfigFactory(HOST, PUBLIC_ADDRESS, DEFAULT_PORT);
    const devServer       = new WebpackDevServer(compiler, devServerConfig);

    devServer.listen(DEFAULT_PORT, HOST, err => {
      if (err) {
        return console.log(err);
      }

    });

    ["SIGINT", "SIGTERM"].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

