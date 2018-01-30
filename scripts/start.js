"use strict";

process.env.NODE_ENV = "development";

const renderLoadingAnimation = require("./util/renderLoading");
const LabeledFormatter = require("../config/webpack/pluginUtils/LabeledFormatter");

const out = new LabeledFormatter();

out.softCls();
out.info("Starting development environment...").endl();
out.info("Rendering loading animation...").endl();

renderLoadingAnimation()
  .then(() => {
    out.info("Loading animation rendered, starting server...").endl();

    const WebpackDevServer = require("webpack-dev-server");
    const webpack = require("webpack");

    const devConfig = require("../config/webpack/dev");
    const devServerConfigFactory = require("../config/webpack/devServer");
    const {
      DEFAULT_PORT,
      HOST,
      PUBLIC_ADDRESS
    } = require("../config/hostInfo");

    const config = devConfig();
    const compiler = webpack(config);

    const devServerConfig = devServerConfigFactory(
      PUBLIC_ADDRESS,
      DEFAULT_PORT,
      config.output.publicPath
    );
    const devServer = new WebpackDevServer(compiler, devServerConfig);

    devServer.listen(DEFAULT_PORT, HOST, err => {
      if (err) {
        return console.log(err);
      }
    });

    ["SIGINT", "SIGTERM"].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
