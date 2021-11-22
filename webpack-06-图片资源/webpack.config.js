const path = require('path');

// npm install --save-dev style-loader
// npm install --save-dev css-loader
// npm install less less-loader --save-dev
// npm install sass-loader sass webpack --save-dev
// npm install stylus stylus-loader --save-dev
/*
  MiniCssExtractPlugin
  文档：https://webpack.docschina.org/plugins/mini-css-extract-plugin/
  npm install --save-dev mini-css-extract-plugin
    1. new MiniCssExtractPlugin() 加入 plugins
    2. 用 MiniCssExtractPlugin.loader 替换 style-loader
*/
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/*
  CssMinimizerPlugin
    1. npm install css-minimizer-webpack-plugin --save-dev
    2. new CssMinimizerPlugin(),
*/
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// npm install --save-dev url-loader file-loader
// npm install --save-dev html-loader

const MiniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: '/dist/css/',
  },
};

module.exports = {
  // 模式
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
        // 所有以 .css 结尾的文件，都将被提供给 style-loader 和 css-loader
        test: /\.css$/i,
        // 注意：css-loader 在后，style-loader 在前
        // css-loader：
        // style-loader：含有 CSS 字符串的 <style> 标签，将被插入到 html 文件的 <head> 中
        use: [MiniCssExtractPluginLoader, 'css-loader'],
      },

      // 处理 less 资源
      {
        test: /\.less$/i,
        // use: ['style-loader', 'css-loader', 'less-loader'],
        // loader除了直接写字符串，还可以使用对象的模式
        use: [
          MiniCssExtractPluginLoader,
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
          MiniCssExtractPluginLoader,
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      // 处理 stylus资源
      {
        test: /\.styl$/,
        loader: 'stylus-loader', // 将 Stylus 文件编译为 CSS
      },
      // 处理图片资源（需要 url-loader、file-loader）
      {
        // 默认处理不到html中的图片
        test: /\.(jpg|png|gif)$/,
        // 当使用use来加载loader的时候，不能添加options选项
        // 因为use往往是使用多个loader，你无法对多个loader同时配置。
        // 所以这里不用use
        loader: 'url-loader',
        options: {
          // 图片小于8KB时，就会被当做base64处理
          limit: 8 * 1024,
          // url-loader 默认使用ES6模块解析，html-loader引入的图片是commonjs
          // 解决方式，关闭es6模块化解析，使用commonjs
          esModule: false,
          // 指定图片文件名，默认是很长的一串哈希值
          // hash:10 取图片哈希值的前10位
          // ext：取图片的原拓展名
          name: '[hash:10].[ext]',
        },
      },
      // 处理HTML中的图片（负责引入img（使用commonjs规范），使之能被 url-loader 解析）
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },

  // 配置插件
  plugins: [
    new MiniCssExtractPlugin({
      // 类似于 webpackOptions.output 中的选项
      // 所有选项都是可选的
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],

  optimization: {
    // 如果还想在开发环境下启用 CSS 优化，请将 optimization.minimize 设置为 true
    minimize: true,
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      new CssMinimizerPlugin({
        // 类型：String|RegExp|Array<String|RegExp>
        // test: /\.css(\?.*)?$/i, // 默认值 /\.css(\?.*)?$/i
        // include: '', // 要包含的文件
        // exclude: '', // 要排除的文件
        /*
           parallel：使用多进程并发执行，提升构建速度。 运行时默认的并发数：os.cpus().length - 1。
              Boolean类型：启用/禁用多进程并发执行
              Number类型：启用多进程并发执行且设置并发数

           注：并行化可以显著提升构建速度，所以强烈建议使用。
                如果启用了并行化，minimizerOptions 中的包必须通过字符串引入（packageName 或者 require.resolve(packageName)）
         */
        parallel: true,
        // minify：Function|Array<Function>
        // 允许覆盖默认的 minify 函数。 默认情况下，插件使用 cssnano 包。 对于使用和测试未发布或版本衍生版本很有用。
        // 如果 minify 配置项传入一个数组，minimizerOptions 也必须是个数组
        // minify: CssMinimizerPlugin.cleanCssMinify,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true, // 移除所有注释（包括以 /*! 开头的注释）
              },
            },
          ],
        },
      }),
    ],
  },
};
