const shelljs = require("shelljs");
const fs = require("fs-extra");
const path = require("path");

const { gzipsize } = require("./gzipSize");
const getRelativeChunkName = require("./getRelativeChunkName");

function determineFileSizes(buildFolder) {
  const fileNames = shelljs
    .ls("-R", buildFolder)
    .map(f => path.resolve(buildFolder, f));

  const sizes = fileNames
    .filter(fileName => /\.(js|css|json|webmanifest)$/.test(fileName))
    .reduce((result, fileName) => {
      const contents = fs.readFileSync(fileName);
      const key = getRelativeChunkName(buildFolder, fileName);
      const originalSize = fs.statSync(fileName).size;
      result[key] = {
        original: originalSize,
        gzip: gzipsize(contents)
      };
      return result;
    }, {});

  return { root: buildFolder, sizes };
}

module.exports = determineFileSizes;
