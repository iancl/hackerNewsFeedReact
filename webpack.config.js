const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: {
        main: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.html$/,
            exclude: /node_modules/,
            loader: "html-loader",
            options: { minimize: true }
        },
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [ 'style-loader', 'css-loader' ]
        },
        {
            test: /\.json$/,
            type: 'javascript/auto',
            exclude: /node_modules/,
            use: [{
                loader: 'file-loader',
                options: {},
            }],
            include: /\.\/config/
        }
      ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html"
        })
    ]
  };
  