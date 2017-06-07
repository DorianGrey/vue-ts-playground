"use strict";

const chalk       = require("chalk");
const express     = require("express");
const compression = require("compression");
const path        = require("path");
const httpProxy   = require("http-proxy");

const paths = require("../config/paths");

// Enter your proxy rules here.
const serverPort = 4000;
const app        = express();
const router     = express.Router();
const proxy      = httpProxy.createProxyServer();
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
app.get("*", (req, res) => res.sendFile(path.resolve(serveDirs[0] + "/index.html")));

app.listen(serverPort, () => {
  console.log(`Serving from directories ${chalk.cyan(serveDirs.join(", "))}...`);
  console.info(`Listening on ${chalk.cyan(`http://localhost:${serverPort}`)} ...`);
});