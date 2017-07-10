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
  let __vue__: typeof Vue;
  export default __vue__;
}

// To avoid having to use @types/node, we'll define the required process.env.NODE_ENV here.
interface Process {
  env: {
    PUBLIC_URL: string;
    NODE_ENV: "production" | "development";
  };
}

declare const process: Process;
