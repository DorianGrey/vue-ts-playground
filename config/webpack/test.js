const merge = require("webpack-merge");
const { DefinePlugin, NoEmitOnErrorsPlugin } = require("webpack");
const NamedModulesPlugin = require("webpack/lib/NamedModulesPlugin");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WebpackKarmaDieHardPlugin = require("webpack-karma-die-hard");

const commonCfg = require("./common");
const paths = require("../paths");

// TODO: Optimize loaders - most of the stuff is not required.
// TODO: Coverage is not working atm. - need to fix this somehow.
// TODO: Need to set up source maps properly - inline etc.

const commonConfig = commonCfg(true, {}, "");

module.exports = {
  output: {
    path: paths.appBuild
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        // enforce: "pre",
        use: require.resolve("source-map-loader"),
        exclude: [paths.resolveApp("node_modules/vue-carousel-3d")]
      },
      {
        test: /\.ts$/,
        enforce: "post",
        use: {
          loader: require.resolve("istanbul-instrumenter-loader"),
          query: {
            esModules: true
          }
        },
        exclude: [/node_modules/, /\.spec\.ts$/]
      },
      {
        test: /\.vue$/,
        use: {
          loader: require.resolve("vue-loader"),
          options: {
            loaders: {
              js: require.resolve("ts-loader")
            },
            esModule: true,
            extractCSS: false
          }
        }
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              appendTsSuffixTo: [/\.vue$/],
              silent: true,
              transpileOnly: true,
              compilerOptions: {
                sourceMap: false,
                inlineSourceMap: true
              }
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|s?css)$/,
        use: require.resolve("ignore-loader")
      }
    ]
  },
  resolve: commonConfig.resolve,
  performance: {
    hints: false
  },
  node: commonConfig.node,
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      watch: "./src",
      tsconfig: "./tsconfig.json",
      tslint: "./tslint.json"
    }),
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    new WebpackKarmaDieHardPlugin(),
    new NamedModulesPlugin(),
    new NoEmitOnErrorsPlugin()
  ]
};
