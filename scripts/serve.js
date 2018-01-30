"use strict";

const chalk = require("chalk");
const express = require("express");
const compression = require("compression");
const path = require("path");
const httpProxy = require("http-proxy");
const fs = require("fs-extra");
const LabeledFormatter = require("../config/webpack/pluginUtils/LabeledFormatter");

const paths = require("../config/paths");

const out = new LabeledFormatter();

fs.pathExists(paths.appBuild).then(exists => {
  if (!exists) {
    console.error(
      `The expected build directory ${chalk.cyan(
        paths.appBuild
      )} does not exist. Are you sure you've executed ${chalk.cyan(
        "yarn build"
      )} before?`
    );
    process.exit(1);
  } else {
    // Enter your proxy rules here.
    const serverPort = 4004;
    const app = express();
    const router = express.Router();
    const proxy = httpProxy.createProxyServer();
    // Configure proxy as you'd like here...

    const serveDirs = process.argv.slice(2);
    if (serveDirs.length === 0) {
      serveDirs.push(paths.appBuild);
    }

    app.use(router);
    app.use(compression());

    serveDirs.forEach(dirName => {
      app.use(express.static(path.resolve(process.cwd(), dirName)));
    });

    // Serve assets
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(serveDirs[0] + "/index.html"))
    );

    app.listen(serverPort, () => {
      out
        .info(
          `Serving from directories ${chalk.cyan(serveDirs.join(", "))} ...`
        )
        .endl();

      out
        .info(
          `Listening on ${chalk.cyan(`http://localhost:${serverPort}`)} ...`
        )
        .endl();
    });
  }
});
