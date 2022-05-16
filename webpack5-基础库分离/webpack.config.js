const webpack = require('webpack');
const path = require('path');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 预设：指示babel怎样做兼容性处理
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // 按需加载，需要 corejs
                    useBuiltIns: 'usage',
                    corejs: {
                      // 指定 corejs 的版本
                      version: 3,
                    },
                    // 指定具体的兼容性做到哪个浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17',
                    },
                  },
                ],
                ['@babel/preset-react'],
              ],
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['vendors', 'index']
    }),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       // 这里的入口可以是一个 CDN
    //       entry: 'https://cdn.bootcdn.net/ajax/libs/react/18.1.0/umd/react.development.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://cdn.bootcdn.net/ajax/libs/react-dom/18.1.0/umd/react-dom.development.js',
    //       global: 'ReactDOM',
    //     },
    //   ],
    // }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
