const path = require("path");

function getRelativeChunkName(buildFolder, fileName) {
  // TODO: We need to simplify this using path manipulations ...
  // Enforce unix version to be able to properly handle everything else ...
  const unixedBuildFolder = buildFolder.split(path.sep).join("/");

  return fileName
    .split(path.sep)
    .join("/")
    .replace(unixedBuildFolder, "")
    .replace(
      /\/?(.*)(\.[0-9a-f]+)?(\.chunk)?(\.(js|css|json|webmanifest))/,
      (match, p1, p2, p3, p4) => p1 + p4
    );
}

module.exports = getRelativeChunkName;
