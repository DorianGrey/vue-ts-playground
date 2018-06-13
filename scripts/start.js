"use strict";

process.env.NODE_ENV = "development";

const renderLoadingAnimation = require("./util/renderLoading");
const LabeledFormatter = require("../config/webpack/pluginUtils/LabeledFormatter");

const out = new LabeledFormatter();

out.softCls();
out.info("Starting development environment...").endl();
out.info("Rendering loading animation...").endl();

async function start() {
  await renderLoadingAnimation();
  out.info("Loading animation rendered, starting server...").endl();

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
    console.error(e);
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
      out.info("Dev server listening...");
    });
  });

  return serverInstance;
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
