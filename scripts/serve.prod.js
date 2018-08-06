"use strict";

const express = require("express");
const compression = require("compression");
const path = require("path");

const serverPort = 4004;
const app = express();
const router = express.Router();

const serveDirs = process.argv.slice(2);
if (serveDirs.length === 0) {
  serveDirs.push("./build");
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

app.listen(serverPort, () =>
  console.info(`Listening on http://localhost:${serverPort} ...`)
);