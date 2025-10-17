/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

/* eslint-env node */
const ESLintPlugin = require("eslint-webpack-plugin");
const {configure} = require("quasar/wrappers");
const envParser = require("./src/config/envparser.js");
const path = require("path");
const fs = require("fs");

module.exports = configure(function (ctx) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      "app",
      "axios",
      "i18n",
      "filters",
      "platformCheck",
      "store",
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // "fontawesome-v5",
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: "hash", // available values: 'hash', 'history'
      env: envParser(),
      androidStudioPath:
        "/Applications/Android Studio.app/Contents/bin/studio.sh",
      // transpile: false,
      // publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{extensions: ["js", "vue"]}]);

        chain.output
          .filename("js/[name].[contenthash].js")
          .chunkFilename("js/[name].[contenthash].js");
      },

      extendWebpack(cfg) {
        const envVars = envParser();

        cfg.plugins.push(
          new (require("webpack").DefinePlugin)({
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // or true, depending on your needs
            'process.env.VUE_APP_NAME': JSON.stringify(envVars.VUE_APP_NAME),
            'process.env.VUE_APP_BASE_URL': JSON.stringify(envVars.VUE_APP_BASE_URL),
            'process.env.VUE_APP_GOOGLE_RECAPTCHA': JSON.stringify(envVars.VUE_APP_GOOGLE_RECAPTCHA),
            'process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD': JSON.stringify(envVars.VUE_APP_RECAPTCHA_SCORE_THRESHOLD),
            'process.env.VUE_APP_ENABLE_PUSH_NOTIFICATIONS': JSON.stringify(envVars.VUE_APP_ENABLE_PUSH_NOTIFICATIONS),
            'process.env.VUE_APP_PUSH_DEBUG': JSON.stringify(envVars.VUE_APP_PUSH_DEBUG),
          })
        );
        cfg.module.rules.push({
          test: /\.js$/,
          include: path.resolve(__dirname, "runners"),
          loader: "babel-loader",
        });
        cfg.plugins.push({
          apply: (compiler) => {
            compiler.hooks.done.tap("GenerateVersion", () => {
              const version = Date.now();
              const outputPath = path.resolve(__dirname, "dist/spa/version.json");

              // Zorg ervoor dat de dist/spa map bestaat
              if (!fs.existsSync("dist/spa")) {
                fs.mkdirSync("dist/spa", {recursive: true});
              }

              fs.writeFileSync(outputPath, JSON.stringify({version}));
              console.log("✅ Version file generated:", version);
            });
          },
        });
      },
      copy: [
        {from: "src/runners/background.js", to: "runners/background.js"},
      ],
    },

    devServer: {
      host: "localhost",
      port: 8080,
      open: true,
    },

    capacitor: {
      hideSplashscreen: true,
      appName: "DemoApp",
      minVersion: 13,
      version: 13,
      ios: {
        appName: "DemoApp",
        minVersion: 13,
        version: 13,
        // Additional iOS-specific configurations
      },
    },

    // https://quasar.dev/uasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {
        loading: {
          spinnerSize: 30,
        },
      },

      // iconSet: 'material-icons', // Quasar icon set
      lang: "nl", // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ["Loading", "Notify", "Dialog"],
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{extensions: ["js"]}]);
      },

      middlewares: [
        ctx.prod ? "compression" : "",
        "render", // keep this as last one
      ],
    },
  };
});
