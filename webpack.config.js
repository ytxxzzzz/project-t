const path = require("path");

module.exports = {
  mode: 'development',
  context: path.join(__dirname, "src", "main", "react"),
  entry: path.join(__dirname, "src", "main", "react", "index.tsx"),
  output: {
    filename: "bundle.js"
  },

  devServer: {
    open: true,
    inline: true,
    // ブラウザに直接アドレスを入力されてもルーティングする設定
    // 本フロントアプリの実体はboundle.jsしかないので、当然ブラウザに直接アドレス入れると、
    // 存在しないのでNotFoundとなってしまう。その時にとりあえずルートへリダイレクトする設定
    historyApiFallback: {
      disableDotRule: true  // react-routerのURLの変数部にドットがある場合に正常動作させるおまじない
    },
    openPage: "",
    contentBase: path.join(__dirname, "public"),
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
      {
        test: /\.css$/, 
        use: [
          'style-loader', 
          {loader: 'css-loader', options: {url: true}},
        ]
      },

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

};

