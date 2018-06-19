"use strict";

const chalk = require("chalk");
const fs = require("fs-extra");
const Koa = require("koa");
const compress = require("koa-compress");
const serveStatic = require("koa-static");
const history = require("connect-history-api-fallback");
const convert = require("koa-connect");

const { log } = require("../config/logger");
const paths = require("../config/paths");

fs.pathExists(paths.appBuild).then(exists => {
  if (!exists) {
    log.error(
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
      log.info(
        `Serving from directories ${chalk.cyan(serveDirs.join(", "))} ...`
      );
      log.info(
        `Listening on ${chalk.cyan(`http://localhost:${serverPort}`)} ...`
      );
    });
  }
});
