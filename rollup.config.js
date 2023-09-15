const commonjs = require("@rollup/plugin-commonjs");
const pluginNodeResolve = require("@rollup/plugin-node-resolve");

const { babel } = require("@rollup/plugin-babel");
const terser = require("@rollup/plugin-terser");

module.exports = {
  input: "./src/index.js",
  output: {
    format: "umd",
    name: "main",
    file: "dist/bundle.js",
  },
  external: ["lodash"],
  plugins: [
    commonjs(),
    pluginNodeResolve(),
    babel({ babelHelpers: "bundled", exclude: /node_modules/ }),
    terser(),
  ],
};
