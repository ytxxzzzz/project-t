var webpack = require('webpack');
const path = require("path");

module.exports = {
  context: path.join(__dirname, "src", "main", "react"),
  entry: path.join(__dirname, "src", "main", "react", "index.tsx"),
  output: {
    path: path.join(__dirname, 'dist/bundle'),
    filename: "bundle.js"
  },

  devServer: {
    open: true,
    // ブラウザに直接アドレスを入力されてもルーティングする設定
    // 本フロントアプリの実体はboundle.jsしかないので、当然ブラウザに直接アドレス入れると、
    // 存在しないのでNotFoundとなってしまう。その時にとりあえずルートへリダイレクトする設定
    historyApiFallback: {
      disableDotRule: true  // react-routerのURLの変数部にドットがある場合に正常動作させるおまじない
    },
    openPage: "",
    contentBase: path.join(__dirname, "dist"),
    publicPath: '/bundle/',
    watchContentBase: true,
    port: 8080,
    // 外部のホストからも接続OKにする設定
    host: '0.0.0.0',
    disableHostCheck: true,
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

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    })
  ]

};
