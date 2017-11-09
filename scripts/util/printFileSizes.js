"use strict";

/*
  This file and the formatting functionality it provides was inspired by the FileSizeReporter from the react-dev-utils
  package.
  The additions and changes primarily aim at an improved overview of the results by separating the generated asset list to categories,
  and format these categories properly both by color and hierarchy.
 */

const fs = require("fs-extra");
const chalk = require("chalk");
const path = require("path");
const filesize = require("filesize");
const stripAnsi = require("strip-ansi");
const zlib = require("zlib");

const paths = require("../../config/paths");
const formatUtils = require("./formatUtil");

const assetsSizeWarnLimit = 250 * 1024; // <=> 250 KB.
const potentiallyExtractedChunkSizeLimit = 512; // <=> 1 KB.
const gzipOpts = { level: 6 }; // This level is used by default by many servers like nginx.

const assetCategories = {
  "Service worker": /(workbox|service-worker).*\.js$/,
  Scripts: /\.js$/,
  Styles: /\.css$/,
  "Source maps": /\.map$/,
  Images: /\.(jpe?g|png|gif|bmp)$/,
  Fonts: /\.(woff2?|eot|ttf|svg)$/
};

function gzipsize(src) {
  return zlib.gzipSync(src, gzipOpts).length;
}

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

function printFileSizesOnAssetCategory(assetsStats, exceptionalAssetCnt) {
  const buildFolder = paths.appBuild;

  const assets = assetsStats.map(asset => {
    const filePath = path.join(buildFolder, asset.name);
    const fileContents = fs.readFileSync(filePath);
    const originalFileSize = fs.statSync(filePath).size;
    const gzipSize = gzipsize(fileContents);
    return {
      folder: path.join(path.dirname(asset.name)),
      name: path.basename(asset.name),
      originalFileSize,
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
    const sizeLabelSrc = alignPad(
      asset.sizeLabel.src,
      longestSrcSizeLabelLength
    );
    const sizeLabelGzip = alignPad(
      asset.sizeLabel.gzip,
      longestGzipSizeLabelLength
    );

    const assetTooLarge = asset.originalFileSize > assetsSizeWarnLimit;
    const assetMayBeExtractedChunk =
      asset.originalFileSize < potentiallyExtractedChunkSizeLimit &&
      /\.js$/.test(asset.name);
    if (assetTooLarge) {
      exceptionalAssetCnt.tooLarge++;
    }
    if (assetMayBeExtractedChunk) {
      exceptionalAssetCnt.extracted++;
    }
    const colorer = assetTooLarge
      ? chalk.yellow
      : assetMayBeExtractedChunk ? chalk.grey : chalk.cyan;

    const assetName = colorer(
      alignPad(asset.name, longestFileNameSize - (asset.folder.length + 1))
    );

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
    const rightPadding = " ".repeat(to - sizeLength);
    originalLabel += rightPadding;
  }
  return originalLabel;
}

function printFileSizes(webpackStats, staticAssets = []) {
  // Prints a detailed summary of build files.
  const jsonStats = webpackStats.toJson();
  const assetsStats = jsonStats.assets;
  staticAssets = staticAssets.map(s => ({ name: s }));

  try {
    assetsStats.push(...staticAssets);

    let exceptionalAssetCnt = {
      tooLarge: 0,
      extracted: 0
    };

    process.stdout.write(
      "\n" +
        formatUtils.formatNote(
          `Emitted assets in ${chalk.cyan(
            path.resolve(paths.appBuild)
          )} (displayed gzip sizes refer to compression level=${
            gzipOpts.level
          }):`
        ) +
        "\n"
    );

    let remainingAssets = Object.getOwnPropertyNames(assetCategories).reduce(
      (relevantAssets, c) => {
        const [_relevantAssets, nextAssets] = partition(relevantAssets, asset =>
          assetCategories[c].test(asset.name)
        );
        if (_relevantAssets.length > 0) {
          process.stdout.write(formatUtils.formatIndicator("> " + c) + "\n");
          printFileSizesOnAssetCategory(_relevantAssets, exceptionalAssetCnt);
          process.stdout.write("\n");
        }
        return nextAssets;
      },
      assetsStats
    );

    if (remainingAssets.length > 0) {
      process.stdout.write(formatUtils.formatIndicator("> Others") + "\n");
      printFileSizesOnAssetCategory(remainingAssets, exceptionalAssetCnt);
      process.stdout.write("\n");
    }

    if (exceptionalAssetCnt.tooLarge > 0) {
      process.stdout.write(
        formatUtils.formatWarning(
          `${exceptionalAssetCnt.tooLarge === 1 ? "There is" : "There are"} ${
            exceptionalAssetCnt.tooLarge
          } assets which exceed the configured size limit of ${filesize(
            assetsSizeWarnLimit
          )}. These are marked in ${chalk.yellow("yellow")}.`
        ) + "\n"
      );
      process.stdout.write("\n");
    }

    if (exceptionalAssetCnt.extracted > 0) {
      process.stdout.write(
        formatUtils.formatNote(
          `${exceptionalAssetCnt.extracted === 1 ? "There is" : "There are"} ${
            exceptionalAssetCnt.extracted
          } assets which are smaller than the configured lower size limit of ${filesize(
            potentiallyExtractedChunkSizeLimit
          )}. These should be considered remains of extracted chunks and are marked in ${chalk.grey(
            "grey"
          )}.`
        ) + "\n"
      );
      process.stdout.write("\n");
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = printFileSizes;
