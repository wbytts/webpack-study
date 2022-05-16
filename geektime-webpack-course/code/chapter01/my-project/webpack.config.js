'use strict';

const path = require('path');

module.exports = {
  // 环境
  mode: 'production',
  // 打包的入口文件
  entry: './src/index.js',
  // 打包的输出
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
