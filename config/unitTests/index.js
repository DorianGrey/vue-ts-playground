import Vue from "vue";

Vue.config.productionTip = false;
Vue.config.devtools = false;

/*
 * get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// require all test files (files that ends with .spec.js)
const testsContext = require.context("../../src", true, /\.spec\.ts$/);
// Require all src files except type definitions for coverage.
requireAll(testsContext);

const srcContext = require.context("../../src", true, /.(vue|ts)$/);
const filtered = srcContext
  .keys()
  .filter(k => !/\.(spec|d)\.ts$/.test(k) && !/index\.ts$/.test(k));

filtered.map(srcContext);
