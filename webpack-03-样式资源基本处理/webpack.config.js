const path = require('path');

// npm install --save-dev style-loader
// npm install --save-dev css-loader
// npm install less less-loader --save-dev
// npm install sass sass-loader webpack --save-dev
// npm install stylus stylus-loader --save-dev

module.exports = {
  mode: 'development',
  // 入口
  entry: './src/index.js',
  // 输出
  output: {
    filename: 'bundle.js', // 打包之后的文件名
    path: path.resolve(__dirname, 'dist'), // 打包文件放的路径
  },
  module: {
    // 配置模块处理的规则
    rules: [
      // 处理css资源
      {
        // webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader
        // 所有以 .css 结尾的文件，都将被提供给 style-loader 和 css-loader
        test: /\.css$/i,
        // 注意：css-loader 在后，style-loader 在前
        // css-loader：
        // style-loader：含有 CSS 字符串的 <style> 标签，将被插入到 html 文件的 <head> 中
        use: ['style-loader', 'css-loader'],
      },

      // 处理 less 资源
      {
        test: /\.less$/i,
        // use: ['style-loader', 'css-loader', 'less-loader'],
        // loader除了直接写字符串，还可以使用对象的模式
        use: [
          {
            loader: 'style-loader', // 从 JS 中创建样式节点
          },
          {
            loader: 'css-loader', // 转化 CSS 为 CommonJS
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader', // 编译 Less 为 CSS
            // 使用对象（Object）的形式传递 options 给 Less
            options: {
              lessOptions: {
                strictMath: true, // 现在这个选项被 math选项替代了，默认在所有情况下执行数学
              },
              // 默认生成的 source map 取决于 compiler.devtool 的值。除了值等于 eval 和 false 外，其他值都能生成 source map
              sourceMap: true,
              // 启用/禁用 webpack 默认的 importer
              // 在某些情况下，这样做可以提高性能，但是请慎用，因为可能会使得 aliases 和以 ~ 开头的 @import 规则失效。
              webpackImporter: false,
              // 在实际入口文件的起始位置添加 Less 代码。 这种情况下，less-loader 只会追加并不会覆盖文件内容。
              // 当你的 Less 变量依赖环境变量时这个属性将非常有用
              // additionalData: `@env: ${process.env.NODE_ENV};`,
            },
          },
        ],
      },

      // 处理 sass资源
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      // 处理 stylus资源
      {
        test: /\.styl$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Stylus 文件编译为 CSS
          'stylus-loader',
        ],
      },
    ],
  },
};
