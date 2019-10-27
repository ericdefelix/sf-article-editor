const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SASS = require('node-sass');

module.exports = {
  entry: {
    editor: Path.resolve(__dirname, '../src/editor.js')
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'editor.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  plugins: [
    new CleanWebpackPlugin(['build'], { root: Path.resolve(__dirname, '..') }),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../src/images'), to: 'images' },
      { from: Path.resolve(__dirname, '../src/background.html'), to: 'background.html' },
      { from: Path.resolve(__dirname, '../src/background.js'), to: 'background.js' },
      { from: Path.resolve(__dirname, '../src/index.js'), to: 'index.js' },
      { from: Path.resolve(__dirname, '../src/webpage.js'), to: 'webpage.js' },
      { from: Path.resolve(__dirname, '../src/sf-leap.js'), to: 'sf-leap.js' },
      { from: Path.resolve(__dirname, '../src/manifest.json'), to: 'manifest.json' },
      { from: Path.resolve(__dirname, '../src/modules'), to: 'modules' },
      {
        from: Path.resolve(__dirname, '../src/editor-themes-insert.scss'),
        to: 'editor-themes-insert.css',
        transform(content, path) {
          const result = SASS.renderSync({
            file: path
          });

          return result.css.toString();
        }
      }
    ]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html')
    })
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    },
    extensions: ['.js'],
    symlinks: true
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|webp)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
      {
        test: /\.(eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[folder]/[name].[ext]',
            outputPath: 'fonts'
          }
        }
      }
    ]
  }
};