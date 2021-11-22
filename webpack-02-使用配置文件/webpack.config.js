const path = require('path');

module.exports = {
  // 入口
  entry: './src/index.js',

  // 输出
  output: {
    filename: 'main.js', // 打包之后的文件名
    path: path.resolve(__dirname, 'dist'), // 打包文件放的路径
  },
};
