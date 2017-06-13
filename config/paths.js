const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp   = (...relativePath) => path.resolve(appDirectory, ...relativePath);

module.exports = {
  resolveApp: resolveApp,
  appPublic: resolveApp("public"),
  appBuild: resolveApp("build"),
  appBuildStats: resolveApp("buildStats"),
  appSrc: resolveApp("src"),
  appIndex: resolveApp("src/index.ts"),
  appHtml: resolveApp("public/index.html"),
  appGenerated: resolveApp("src/generated")
};