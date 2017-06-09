"use strict";

process.env.NODE_ENV = "development";

const renderLoadingAnimation = require("./util/renderLoading");

renderLoadingAnimation()
  .then(() => {
    const WebpackDevServer = require("webpack-dev-server");
    const webpack          = require("webpack");

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

