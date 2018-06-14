"use strict";

process.env.NODE_ENV = "development";

const chalk = require("chalk");
const renderLoadingAnimation = require("./util/renderLoading");
const { log, buildLog } = require("../config/logger");
const formatUtil = require("../config/formatUtil");

formatUtil.softCls();
log.info("Starting development environment...");
buildLog.await("Rendering loading animation...");

async function start() {
  await renderLoadingAnimation();
  buildLog.await("Starting server...");

  const serve = require("webpack-serve");

  const devConfig = require("../config/webpack/dev");
  const devServerConfigFactory = require("../config/webpack/devServer");
  const {
    useLocalIp,
    DEFAULT_PORT,
    LOCAL_HOST_ADDRESS,
    PUBLIC_ADDRESS
  } = require("../config/hostInfo");

  const config = devConfig();
  const devServerConfig = devServerConfigFactory(
    useLocalIp ? PUBLIC_ADDRESS : LOCAL_HOST_ADDRESS,
    DEFAULT_PORT,
    config.output.publicPath
  );
  let devServer;
  try {
    devServer = serve({ config, ...devServerConfig });
  } catch (e) {
    log.error(e);
    process.exit(1);
  }

  const serverInstance = devServer.then(server => {
    ["SIGINT", "SIGTERM"].forEach(sig => {
      process.on(sig, () => {
        server.close();
        process.exit(0);
      });
    });

    server.on("listening", () => {
      const serverAddress = chalk.cyan(
        `http://${
          useLocalIp ? PUBLIC_ADDRESS : LOCAL_HOST_ADDRESS
        }:${DEFAULT_PORT}`
      );
      buildLog.success(`Dev server available via ${serverAddress}...`);
    });
  });

  return serverInstance;
}

start().catch(err => {
  log.error(err);
  process.exit(1);
});
