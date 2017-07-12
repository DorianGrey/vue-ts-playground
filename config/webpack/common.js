"use strict";

const { DefinePlugin } = require("webpack");
const chalk = require("chalk");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const paths = require("../paths");
const formatUtil = require("../../scripts/util/formatUtil");
const loadingAnimation = require("../../src/generated/loading.scss.json");

const nodeOptions = {
  fs: "empty",
  net: "empty",
  tls: "empty",
  global: true,
  crypto: "empty",
  process: true,
  module: false,
  clearImmediate: false,
  setImmediate: false
};

const PLUGIN_HTML = function(isDev, publicUrl) {
  const minify = isDev
    ? false
    : {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      };

  return new HtmlWebpackPlugin({
    filename: "index.html", // Keep in mind that the output path gets prepended to this name automatically.
    inject: "body",
    template: paths.appHtml,
    minify,
    // Custom config.
    title: "Demo App",
    devMode: isDev,
    baseHref: "/",
    publicUrl,
    loadingCss: loadingAnimation.css
  });
};

const POSTCSS_PLUGINS = () => [
  require("postcss-flexbugs-fixes"),
  require("autoprefixer")({
    browsers: [
      ">1%",
      "last 4 versions",
      "Firefox ESR",
      "not ie < 11" // supporting IE < 11 should not be required anymore, due to the lack of usage statistics.
    ],
    flexbox: "no-2009"
  })
];

const RULE_SCSS = function(isDev, extractTextPluginOptions) {
  // Development mode docs:
  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use a plugin to extract that CSS to a file, but
  // in development "style" loader enables hot editing of CSS.

  // Production mode docs:
  // The notation here is somewhat confusing.
  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader normally turns CSS into JS modules injecting <style>,
  // but unlike in development configuration, we do something different.
  // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
  // (second argument), then grabs the result CSS and puts it into a
  // separate file in our build process. This way we actually ship
  // a single CSS file in production instead of JS code injecting <style>
  // tags. If you use code splitting, however, any async bundles will still
  // use the "style" loader inside the async code so CSS from them won't be
  // in the main CSS file.
  // [Note]: Atm., this chain causes a warning from the postcss-loader that it
  // found a source-map, but is not configured to retain it, so it will be discarded.
  // This is caused by a configuration problem of resolve-url-loader
  // (see https://github.com/bholloway/resolve-url-loader/issues/60), and can safely
  // be ignored.

  const scssLoaderChain = [
    {
      loader: require.resolve("css-loader"),
      options: {
        importLoaders: 1,
        minimize: !isDev,
        sourceMap: isDev
      }
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        sourceMap: isDev,
        ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
        plugins: POSTCSS_PLUGINS
      }
    },
    {
      loader: require.resolve("resolve-url-loader"),
      options: {
        sourceMap: isDev
      }
    },
    {
      loader: require.resolve("sass-loader"),
      options: {
        sourceMap: true, // Has to be true always, since the resolve-url-loader requires it to properly map the resource paths.
        outputStyle: isDev ? "nested" : "compressed"
      }
    }
  ];

  const result = { test: /\.scss$/ };
  const styleLoader = require.resolve("style-loader");

  if (isDev) {
    result.use = [styleLoader].concat(scssLoaderChain);
  } else {
    result.use = ExtractTextPlugin.extract(
      Object.assign(
        {
          fallback: styleLoader,
          use: scssLoaderChain
        },
        extractTextPluginOptions
      )
    );
  }

  return result;
};

const RULE_WEBFONTS = function() {
  const webFontRule = {
    test: /\.(ttf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,
    use: {
      loader: require.resolve("url-loader"),
      query: {
        limit: 2 * 1024, // i.e. if the content has a size of > 2KB, it will be copied via file-loader.
        name: "static/media/[name].[hash:8].[ext]"
      }
    },
    include: [/node_modules/]
  };

  // TODO: We might need conditional updates to webFontRule.use.query.publicPath here.

  return webFontRule;
};

const RULE_IMAGES = function(isDev) {
  return {
    test: /\.(gif|png|jpe?g)$/i,
    use: [
      {
        loader: require.resolve("file-loader"),
        query: {
          name: "static/media/[name].[hash:8].[ext]"
        }
      },
      {
        loader: require.resolve("image-webpack-loader"),
        query: {
          bypassOnDebug: isDev
        }
      }
    ]
  };
};

module.exports = function(isDev, extractTextPluginOptions, publicUrl) {
  return {
    // resolve TypeScript and Vue file
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.vue$/,
          use: {
            loader: require.resolve("vue-loader"),
            options: {
              loaders: {
                js: require.resolve("ts-loader")
              },
              esModule: true,
              extractCSS: !isDev,
              postcss: POSTCSS_PLUGINS
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
                transpileOnly: true
              }
            }
          ]
        },
        RULE_SCSS(isDev, extractTextPluginOptions),
        RULE_WEBFONTS(),
        RULE_IMAGES(isDev)
      ]
    },

    node: nodeOptions,

    performance: {
      hints: isDev ? false : "warning"
    },

    resolve: {
      extensions: [".ts", ".vue", ".js"]
    },

    devtool: isDev ? "inline-source-map" : "source-map",

    stats: "minimal",

    plugins: [
      PLUGIN_HTML(isDev, publicUrl),
      new CaseSensitivePathsPlugin(),
      new DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(isDev ? "development" : "production")
        }
      }),

      new ForkTsCheckerWebpackPlugin({
        watch: "./src",
        tsconfig: "./tsconfig.json",
        tslint: "./tslint.json",
        async: false,
        formatter: "codeframe"
      }),

      new StyleLintPlugin({
        quiet: false,
        emitErrors: true,
        failOnError: !isDev,
        configFile: paths.resolveApp("stylelint.json"),
        files: ["src/**/*.vue", "src/!(bootstrap-cyborg)/*.scss"],
        syntax: "scss",
        formatter: require("stylelint-formatter-pretty")
      }),

      new ProgressBarPlugin({
        complete: ".",
        format: `${formatUtil.formatIndicator(">")}${chalk.cyan(
          ":bar"
        )} ${chalk.cyan(":percent")} (:elapsed seconds)`,
        summary: false,
        width: 50
      })
    ]
  };
};
