const { join } = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  devtool: "source-map",
  output: {
    library: "_",
    path: join(__dirname, "./dist/umd"),
    filename: "newdash.js",
    libraryTarget: "umd"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.umd.json"
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
