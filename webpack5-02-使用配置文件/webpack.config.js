const path = require('path');

module.exports = {
  // 环境
  mode: 'development',
  // 打包的入口文件
  entry: './src/index.js',
  // 打包的输出
  output: {
    filename: 'main.js', // 打包输出的文件名
    path: path.resolve(__dirname, 'dist'), // 打包文件放的路径
  },
  // 模块配置
  module: {
    // Loader配置
    rules: []
  },
  // 开发服务器配置
  devServer: {
    port: 3000,
    static: 'public'
  },
};



