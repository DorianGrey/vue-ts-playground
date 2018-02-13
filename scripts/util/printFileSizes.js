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
const { gzipsize, gzipOpts } = require("./gzipSize");

const paths = require("../../config/paths");
const LabeledFormatter = require("../../config/webpack/pluginUtils/LabeledFormatter");
const getRelativeChunkName = require("./getRelativeChunkName");
const {
  relevantSizeComparisonRegex
} = require("./determineFileSizesBeforeBuild");

const out = new LabeledFormatter();

const assetsSizeWarnLimit = 250 * 1024; // <=> 250 KB.
const potentiallyExtractedChunkSizeLimit = 512; // <=> 1 KB.

const assetCategories = {
  "Service worker": /(workbox|service-worker).*\.js$/,
  "Language packs": /lang-.+\.chunk\.js$/,
  Scripts: /\.js$/,
  Styles: /\.css$/,
  "Source maps": /\.map$/,
  Images: /\.(jpe?g|png|gif|bmp)$/,
  Fonts: /\.(woff2?|eot|ttf|svg)$/
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

function colorizeDiffLabel(difference, currentLabel, alertLimit) {
  let label = currentLabel;
  if (difference >= 0) {
    label = `+${label}`;
  }

  let coloring;
  switch (true) {
    case difference >= alertLimit:
      coloring = chalk.red;
      break;
    case difference > 0 && difference < alertLimit:
      coloring = chalk.yellow;
      break;
    case difference < 0:
      coloring = chalk.green;
      break;
    default:
      coloring = chalk.grey;
      break;
  }

  return coloring(`(${label})`);
}

function determineSizeDiff(
  previousFileSizes,
  buildFolder,
  assetName,
  currentSize,
  type,
  alertLimit
) {
  const relativeName = getRelativeChunkName(buildFolder, assetName);
  const previousInfo = previousFileSizes.sizes[relativeName];
  if (previousInfo) {
    const difference = currentSize - previousInfo[type];
    const label = colorizeDiffLabel(
      difference,
      filesize(difference),
      alertLimit
    );
    return !Number.isNaN(difference) && label ? ` ${label}` : "";
  } else {
    return "";
  }
}

function printFileSizesOnAssetCategory(
  previousFileSizes,
  assetsStats,
  exceptionalAssetCnt
) {
  const buildFolder = paths.appBuild;

  const missingPreviousVersion = [];

  const assets = assetsStats.map(asset => {
    const filePath = path.join(buildFolder, asset.name);
    const fileContents = fs.readFileSync(filePath);
    const originalFileSize = fs.statSync(filePath).size;
    const gzipSize = gzipsize(fileContents);

    const originalSizeDiff = determineSizeDiff(
      previousFileSizes,
      buildFolder,
      asset.name,
      originalFileSize,
      "original",
      1024 * 50 * 3
    );
    const gzipSizeDiff = determineSizeDiff(
      previousFileSizes,
      buildFolder,
      asset.name,
      gzipSize,
      "gzip",
      1024 * 50
    );

    if (!originalSizeDiff || !gzipSizeDiff) {
      missingPreviousVersion.push(asset.name);
    }

    return {
      folder: path.join(path.dirname(asset.name)),
      name: path.basename(asset.name),
      originalFileSize,
      size: gzipSize,
      sizeLabel: {
        src: `${filesize(originalFileSize)}${originalSizeDiff} (src)`,
        gzip: `${filesize(gzipSize)}${gzipSizeDiff} (gzip)`
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

  return missingPreviousVersion;
}

function alignPad(originalLabel, to) {
  let sizeLength = stripAnsi(originalLabel).length;
  if (sizeLength < to) {
    const rightPadding = " ".repeat(to - sizeLength);
    originalLabel += rightPadding;
  }
  return originalLabel;
}

function printFileSizes(previousFileSizes, webpackStats, staticAssets = []) {
  // Prints a detailed summary of build files.
  const jsonStats = webpackStats.toJson();
  const assetsStats = jsonStats.assets;
  staticAssets = staticAssets.map(s => ({ name: s }));

  const missingPreviousVersion = [];

  try {
    assetsStats.push(...staticAssets);

    let exceptionalAssetCnt = {
      tooLarge: 0,
      extracted: 0
    };

    out
      .endl()
      .note(
        `Emitted assets in ${chalk.cyan(
          path.resolve(paths.appBuild)
        )} (displayed gzip sizes refer to compression level=${gzipOpts.level}):`
      )
      .endl();

    let remainingAssets = Object.getOwnPropertyNames(assetCategories).reduce(
      (relevantAssets, c) => {
        const [_relevantAssets, nextAssets] = partition(relevantAssets, asset =>
          assetCategories[c].test(asset.name)
        );
        if (_relevantAssets.length > 0) {
          out.indicated("> " + c).endl();
          const missingPrevious = printFileSizesOnAssetCategory(
            previousFileSizes,
            _relevantAssets,
            exceptionalAssetCnt
          );
          missingPreviousVersion.push(...missingPrevious);
          out.endl();
        }
        return nextAssets;
      },
      assetsStats
    );

    if (remainingAssets.length > 0) {
      out.indicated("> Others").endl();
      const missingPrevious = printFileSizesOnAssetCategory(
        previousFileSizes,
        remainingAssets,
        exceptionalAssetCnt
      );
      missingPreviousVersion.push(...missingPrevious);
      out.endl();
    }

    if (exceptionalAssetCnt.tooLarge > 0) {
      out
        .warning(
          `${exceptionalAssetCnt.tooLarge === 1 ? "There is" : "There are"} ${
            exceptionalAssetCnt.tooLarge
          } assets which exceed the configured size limit of ${filesize(
            assetsSizeWarnLimit
          )}. These are marked in ${chalk.yellow("yellow")}.`
        )
        .endl()
        .endl();
    }

    if (exceptionalAssetCnt.extracted > 0) {
      out
        .note(
          `${exceptionalAssetCnt.extracted === 1 ? "There is" : "There are"} ${
            exceptionalAssetCnt.extracted
          } assets which are smaller than the configured lower size limit of ${filesize(
            potentiallyExtractedChunkSizeLimit
          )}. These should be considered remains of extracted chunks and are marked in ${chalk.grey(
            "grey"
          )}.`
        )
        .endl()
        .endl();
    }

    const relevantMissingPreviousVersion = missingPreviousVersion.filter(a =>
      relevantSizeComparisonRegex.test(a)
    );

    if (relevantMissingPreviousVersion.length > 0) {
      out
        .debug(
          `Some assets did not have a previous version, though they should have: ${JSON.stringify(
            missingPreviousVersion,
            null,
            4
          )} in ${JSON.stringify(
            Object.getOwnPropertyNames(previousFileSizes.sizes),
            null,
            4
          )}`
        )
        .endl();
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = printFileSizes;
