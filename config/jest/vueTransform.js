const path = require("path");
const fs = require("fs-extra");
const vueCompiler = require("vue-template-compiler");
const vueNextCompiler = require("vue-template-es2015-compiler");

function extractHTML(template, templatePath) {
  let resultHTML = "";

  if (!template.lang || template.lang === "resultHTML") {
    resultHTML = template.content;
  } else {
    throw new Error(
      `${templatePath}: unknown <template lang="${template.lang}">`
    );
  }

  return resultHTML;
}

function generateOutput(script, renderFn, staticRenderFns) {
  let output = "";
  output += `/* istanbul ignore next */;(function(){\n${script}\n})()\n
    /* istanbul ignore next */if (module.exports.__esModule) module.exports = module.exports.default\n`;
  output +=
    `/* istanbul ignore next */var __vue__options__ = (typeof module.exports === "function"` +
    `? module.exports.options: module.exports)\n`;
  if (renderFn && staticRenderFns) {
    output += `/* istanbul ignore next */__vue__options__.render = ${renderFn}\n
      /* istanbul ignore next */__vue__options__.staticRenderFns = ${
        staticRenderFns
      }\n`;
  }
  return output;
}

const stringifyRender = render =>
  vueNextCompiler(`function render () {${render}}`);

const stringifyStaticRender = staticRenderFns =>
  `[${staticRenderFns.map(stringifyRender).join(",")}]`;

function findProcessor(filePath, transformers) {
  let matchingTransformer;
  for (let t of transformers) {
    const [matcher, transformer] = t;
    const regexp = new RegExp(matcher);
    if (regexp.test(filePath)) {
      matchingTransformer = transformer;
      break;
    }
  }
  return matchingTransformer;
}

function transformScript(filePath, jestConfig, transformOptions, script) {
  let transformedScript;
  if (script) {
    // We have to differ between inline code and external referenced file.
    let targetSource, targetSourcePath;

    const requiresPreprocessor =
      !!script.lang && !/js|javascript/.test(script.lang);

    if (script.src) {
      // External source - we have to read the file content before we can go ahead.
      // The destination path has to be resolved w.r.t. the "src" entry of the
      // script tag.
      targetSourcePath = path.resolve(path.dirname(filePath), script.src);
      targetSource = fs.readFileSync(targetSourcePath, "utf8");
    } else {
      // We need to update the file extension.
      // TODO: Need to figure out if this simple replacement works fine.
      targetSourcePath = filePath.replace(
        /.vue$/,
        script.lang ? `.${script.lang}` : ".js"
      );
      targetSource = script.content;
    }

    // Determine a preprocessor from the provided transform registry.
    // If a preprocessor is required, but cannot be determined, we need to throw
    // an error and let things crash.
    const externalProcessor = findProcessor(
      targetSourcePath,
      jestConfig.transform
    );

    if (externalProcessor) {
      const processor = require(externalProcessor);
      transformedScript = processor.process(
        targetSource,
        targetSourcePath,
        jestConfig,
        transformOptions
      );
    } else if (!requiresPreprocessor) {
      transformedScript = script.content;
    } else {
      throw new Error(
        `Cannot find preprocessor for script of ${
          filePath
        }, but it requires one. Used ${targetSourcePath} for determination.`
      );
    }
  }
  return transformedScript;
}

module.exports = {
  // TODO: We need to handle "getCacheKey".

  process(src, filePath, jestConfig, transformOptions) {
    // heavily based on vueify (Copyright (c) 2014-2016 Evan You)
    const { script, template } = vueCompiler.parseComponent(src, { pad: true });

    let transformedScript = transformScript(
      filePath,
      jestConfig,
      transformOptions,
      script
    );

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
