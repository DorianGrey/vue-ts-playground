/* eslint-env node */
const path = require("path");
const fs = require("fs-extra");
const vueCompiler = require("vue-template-compiler");
const vueNextCompiler = require("vue-template-es2015-compiler");
const tsJest = require("ts-jest/preprocessor");

const transforms = {
  ts: tsJest,
  typescript: tsJest
};

const extractHTML = (template, templatePath) => {
  let resultHTML = "";

  if (!template.lang || template.lang === "resultHTML") {
    resultHTML = template.content;
  } else {
    throw new Error(
      `${templatePath}: unknown <template lang="${template.lang}">`
    );
  }

  return resultHTML;
};

const generateOutput = (script, renderFn, staticRenderFns) => {
  let output = "";
  output += `/* istanbul ignore next */;(function(){\n${script}\n})()\n
    /* istanbul ignore next */if (module.exports.__esModule) module.exports = module.exports.default\n`;
  output +=
    `/* istanbul ignore next */var __vue__options__ = (typeof module.exports === "function"` +
    `? module.exports.options: module.exports)\n`;
  if (renderFn && staticRenderFns) {
    output += `/* istanbul ignore next */__vue__options__.render = ${renderFn}\n
      /* istanbul ignore next */__vue__options__.staticRenderFns = ${staticRenderFns}\n`;
  }
  return output;
};

const stringifyRender = render =>
  vueNextCompiler(`function render () {${render}}`);

const stringifyStaticRender = staticRenderFns =>
  `[${staticRenderFns.map(stringifyRender).join(",")}]`;

module.exports = {
  // TODO: We need to handle "getCacheKey".
  // TODO: We need to work around the av-ts stuff with static attributes - they are added via setting
  // .arguments and .caller, but these are not allowed to be modified in strict mode.
  // TODO: Since jest does not know about externally referenced files, we need a way to figure out
  // if the "instrument" transform option should be set or not.
  // The current way to force jest to collect coverage from .vue files causes the instrumentation to trigger,
  // but the results might be a bit confusing...

  process(src, filePath, jestConfig, transformOptions) {
    // heavily based on vueify (Copyright (c) 2014-2016 Evan You)
    const { script, template } = vueCompiler.parseComponent(src, { pad: true });

    // If there is a specific lang definition, but no transformer is listed, we cannot handle this ...
    if (script && script.lang && !transforms[script.lang]) {
      throw new Error(`No transformer defined for script.lang=${script.lang}`);
    }

    let transformer = script && script.lang ? transforms[script.lang] : null;
    let transformedScript;

    if (transformer && script) {
      // We have to differ between inline code and external referenced file.
      if (script.src) {
        const targetSourcePath = path.resolve(
          path.dirname(filePath),
          script.src
        );
        const targetSource = fs.readFileSync(targetSourcePath, "utf8");
        transformedScript = tsJest.process(
          targetSource,
          targetSourcePath,
          jestConfig,
          transformOptions
        );
      } else {
        throw new Error(
          `Transforming inline sources is currently not supported.`
        );
      }
    } else if (script) {
      transformedScript = script.content;
    }

    let render;
    let staticRenderFns;
    if (template) {
      const HTML = extractHTML(template, filePath);
      const res = HTML && vueCompiler.compile(HTML);
      render = stringifyRender(res.render);
      staticRenderFns = stringifyStaticRender(res.staticRenderFns);
    }

    return generateOutput(transformedScript, render, staticRenderFns);
  }
};
