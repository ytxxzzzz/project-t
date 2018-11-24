const path = require("path");

module.exports = {
  mode: 'development',
  context: path.join(__dirname, "src", "react"),
  entry: path.join(__dirname, "src", "react", "index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },

  devServer: {
    open: true,
    openPage: "index.html",
//    contentBase: path.join(__dirname, "public"),
    watchContentBase: true,
    port: 8080,
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      // css loader
      {test: /\.css$/, use: ['style-loader', 'css-loader']},

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

};

