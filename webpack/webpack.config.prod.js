const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "production",
  devtool: "none",
  stats: "errors-only",
  bail: true,
  output: {
    filename: "editor.js"
  },
  plugins: [
    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: "editor.css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       extractComments: true,
  //       cache: true,
  //       parallel: true,
  //       sourceMap: true, // Must be set to true if using source-maps in production
  //       terserOptions: {
  //         // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
  //         extractComments: "all",
  //         compress: {
  //           drop_console: true
  //         }
  //       }
  //     })
  //   ]
  // }
});
