
const path = require('path');

module.exports = {
  // 开发服务器配置（"webpack-dev-server": "^3.11.2"，"webpack-cli": "^4.6.0"）
  // 启动：npx webpack serve
  // 如果是："webpack-cli": "^3.3.12", 3版本，还是使用 webpack-dev-server 启动
  devServer: {
    // 上下文路径
    contentBase: path.resolve(__dirname, "src/pages"),
    // gzip 压缩
    compress: true,
    // 进度条
    progress: true,
    // 服务端口
    port: 3000,
    // 是否自动打开浏览器
    open: 'Chrome',
    // 是否开启模块热切换，module上会挂一个 hot: true 的属性
    hot: true,

    // 配置服务器代理
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',  // 192.168.111.230
        pathRewrite: { '^/api': '' },
      },
    },
  }
}
