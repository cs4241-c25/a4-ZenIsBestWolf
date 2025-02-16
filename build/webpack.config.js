'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const { hostname } = require('os');

const dir = path.join(__dirname, '../');

module.exports = {
  context: path.join(dir, 'src/frontend'),
  devtool: 'source-map',
  entry: './index.tsx',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    symlinks: false,
  },
  output: {
    chunkFilename: '[name].[contenthash].js',
    filename: '[name].[contenthash].js',
    path: path.join(dir, 'dist/frontend'),
  },
  devServer: {
    allowedHosts: ['localhost', hostname().toLowerCase(), 'host.docker.internal'],
    headers: {
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    port: 8082,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:8081',
      },
    ],
    hot: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  module: {
    rules: [
      {
        loader: 'ts-loader',
        options: {
          experimentalFileCaching: true,
          transpileOnly: true,
        },
        test: /\.tsx?$/,
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader',
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader',
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
