// For scss imports.
declare module "*.scss" {
  let __scss__: string;
  export default __scss__;
}

declare module "*.svg" {
  let __svg__: string;
  export default __svg__;
}

declare module "*.vue" {
  import Vue from "vue";
  export default typeof Vue;
}

// To avoid having to use @types/node, we'll define the required process.env.NODE_ENV here.
interface Process {
  env: {
    PUBLIC_URL: string;
    NODE_ENV: "production" | "development";
  };
}

declare const process: Process;

// For the import() function. Only works properly in conjunction with the string-replace-loader, which adjusts _import_ to import.
// See the reference description (https://github.com/tc39/proposal-dynamic-import).
// Note: Naming the created chunk is possible since webpack 2.4.0 (see https://github.com/webpack/webpack/releases/tag/v2.4.0) using a special comment notation:
// import(/* webpackChunkName: "my-chunk-name" */ "module")
declare function _import_<T>(path: string): Promise<T>
