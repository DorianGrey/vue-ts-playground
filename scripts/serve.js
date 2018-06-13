"use strict";

const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");

const Koa = require("koa");
const compress = require("koa-compress");
const serveStatic = require("@shellscape/koa-static/legacy"); // Already used by webpack-serve, thus...
const history = require("connect-history-api-fallback");
const convert = require("koa-connect");

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
    const app = new Koa();
    const serveDirs = process.argv.slice(2);
    if (serveDirs.length === 0) {
      serveDirs.push(paths.appBuild);
    }

    app
      .use(convert(history({}))) // HTML5 fallback
      .use(compress()); // Use compression.

    serveDirs.forEach(serveDir => app.use(serveStatic(serveDir)));

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
