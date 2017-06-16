"use strict";

/*
  This file and the formatting functionality it provides was inspired by the FileSizeReporter from the react-dev-utils
  package.
  The additions and changes primarily aim at an improved overview of the results by separating the generated asset list to categories,
  and format these categories properly both by color and hierarchy.
 */

const fs        = require("fs-extra");
const chalk     = require("chalk");
const path      = require("path");
const filesize  = require("filesize");
const stripAnsi = require("strip-ansi");
const gzipsize  = require("gzip-size").sync;

const paths       = require("../../config/paths");
const formatUtils = require("./formatUtil");

const assetCategories = {
  "Scripts": /\.js$/,
  "Styles": /\.css$/,
  "Source maps": /\.map$/,
  "Images": /\.(jpe?g|png|gif|bmp)$/,
  "Fonts": /\.(woff2?|eot|ttf|svg)$/
};

function partition(src, predicate) {
  let res1 = [],
      res2 = [];

  for (let e of src) {
    if (predicate(e)) {
      res1.push(e);
    } else {
      res2.push(e);
    }
  }

  return [res1, res2];
}

function printFileSizesOnAssetCategory(assetsStats) {
  const buildFolder = paths.appBuild;

  const assets = assetsStats.map(asset => {
    const filePath         = path.join(buildFolder, asset.name);
    const fileContents     = fs.readFileSync(filePath);
    const originalFileSize = fs.statSync(filePath).size;
    const gzipSize         = gzipsize(fileContents);
    return {
      folder: path.join(path.basename(buildFolder), path.dirname(asset.name)),
      name: path.basename(asset.name),
      size: gzipSize,
      sizeLabel: {
        src: `${filesize(originalFileSize)} (src)`,
        gzip: `${filesize(gzipSize)} (gzip)`
      }
    };
  });
  assets.sort((a, b) => b.size - a.size);

  const longestSrcSizeLabelLength = Math.max.apply(
    null,
    assets.map(a => stripAnsi(a.sizeLabel.src).length)
  );

  const longestGzipSizeLabelLength = Math.max.apply(
    null,
    assets.map(a => stripAnsi(a.sizeLabel.gzip).length)
  );

  const longestFileNameSize = Math.max.apply(
    null,
    assets.map(a => stripAnsi(a.folder + path.sep + a.name).length)
  );

  assets.forEach(asset => {
    let sizeLabelSrc  = alignPad(asset.sizeLabel.src, longestSrcSizeLabelLength);
    let sizeLabelGzip = alignPad(asset.sizeLabel.gzip, longestGzipSizeLabelLength);
    let assetName     = chalk.cyan(alignPad(asset.name, longestFileNameSize - (asset.folder.length + 1)));

    process.stdout.write(
      chalk.dim(asset.folder + path.sep) +
      assetName +
      " @ " +
      sizeLabelSrc +
      " => " +
      sizeLabelGzip +
      "\n"
    );
  });
}

function alignPad(originalLabel, to) {
  let sizeLength = stripAnsi(originalLabel).length;
  if (sizeLength < to) {
    const rightPadding = ' '.repeat(to - sizeLength);
    originalLabel += rightPadding;
  }
  return originalLabel;
}

function printFileSizes(webpackStats/*, previousSizeMap*/) {
  // Prints a detailed summary of build files.
  const jsonStats   = webpackStats.toJson();
  const assetsStats = jsonStats.assets;

  process.stdout.write(formatUtils.formatNote("Emitted assets:") + "\n");

  let relevantAssets = assetsStats;
  for (let c in assetCategories) {
    if (assetCategories.hasOwnProperty(c)) {
      const [_relevantAssets, nextAssets] = partition(relevantAssets, asset => assetCategories[c].test(asset.name));
      if (_relevantAssets.length > 0) {
        process.stdout.write(formatUtils.formatIndicator("> " + c) + "\n");
        printFileSizesOnAssetCategory(_relevantAssets);
        process.stdout.write("\n");
      }
      relevantAssets = nextAssets;
    }
  }

  if (relevantAssets.length > 0) {
    process.stdout.write(formatUtils.formatIndicator("> Others") + "\n");
    printFileSizesOnAssetCategory(relevantAssets);
    process.stdout.write("\n");
  }
}

module.exports = printFileSizes;