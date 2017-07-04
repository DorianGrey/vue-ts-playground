import Vue from "vue";

Vue.config.productionTip = false;

/*
 * get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

// require all test files (files that ends with .spec.js)
const testsContext = require.context("../../src", true, /\.spec\.ts$/);
// Require all src files except type definitions for coverage.

/*
TODO: We need a regex here that matches only the first of these:
 index.ts
 index.spec.ts
 index.d.ts

 */

// const srcContext = require.context("../../src", true, /(?!(spec|d))\.ts/);
requireAll(testsContext);
// requireAll(srcContext);
