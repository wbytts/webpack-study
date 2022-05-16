/**
 * webpack打包的配置文件
 */
const path = require('path');


// html 打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 提取css为单独文件：npm install mini-css-extract-plugin -D
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // 模式
    mode: 'development', // production

    // 入口，指示webpack从何处开始打包
    entry: './src/index.js',

    // 输出：指示输出的位置和资源名字
    output: {
        // 输出文件名
        filename: 'main.js',
        // 输出路径
        // path: path.resolve(__dirname, 'dist'),
        path: `${__dirname}/dist`,
        publicPath: `${__dirname}/dist`,
    },

    // 模块的配置
    module: {
        // 配置 loader
        rules: [
            { // 处理 CSS 资源
                test: /\.css$/, // 匹配 .css 结尾的文件
                use: [
                    // 2. 创建 style 标签放到head中，将js中的样式字符串添加到标签中，使样式生效
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    // 1. 将 css 文件变为 commonjs 模块加载到js中，里面的内容就是样式字符串
                    'css-loader'
                ]
            },
            { // 处理 Less 资源
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 1. 将 less 文件变为 css 文件
                    'less-loader' // 需要 less 和 less-loader
                ]
            },
            { // 处理图片资源（需要 url-loader、file-loader）  // 默认处理不到html中的图片
                test: /\.(jpg|png|gif)$/,
                // 如果只使用了一个loader，可以不用use，而直接使用loader
                loader: 'url-loader',
                options: { // 只有当直接使用loader时，才能直接在外面写 options
                    // 图片小于8KB时，就会被当做base64处理
                    limit: 8 * 1024,
                    // url-loader 默认使用ES6模块解析，html-loader引入的图片是commonjs
                    // 解决方式，关闭es6模块化解析，使用commonjs
                    esModule: false,
                    // 指定图片文件名，默认是很长的一串哈希值
                    // hash:10 取图片哈希值的前10位
                    // ext：取图片的原拓展名
                    name: '[name].[hash:8].[ext]',
                    output: 'imgs'
                }
            },
            { // 处理HTML中的图片（负责引入img（使用commonjs规范），使之能被 url-loader 解析）
                test: /\.html$/,
                use: 'html-loader'
            },
            { // 语法检查：eslint、eslint-loader
                // 在 package.json 的 eslintConfig 中设置检查规则，推荐使用 airbnb 的规则
                test: /\.js$/,
                // 排除第三方模块的检查
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
            { // 打包其他资源（不需要做处理的资源，直接输出即可）
                // 通过 exclude 去排除也可以
                // 如字体图标资源
                test: /\.(svg|eof|fft)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[hash:8].[ext]',
                    output: 'assert'
                }
            }
        ]
    },

    // 插件的配置
    plugins: [
        // HTML 打包插件
        new HtmlWebpackPlugin({
            // 会自动复制这个文件到打包路径，并引入打包输出的资源
            template: './src/index.html',
            minify: { // 压缩HTML代码配置
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true,
            }
        }),
        // 抽取css为单独文件
        new MiniCssExtractPlugin({
            filename: 'css/style[hash:10].css',
        }),
    ],

    // source-map：写法：
    // [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
    // source-map：错误代码的准确信息，和源代码的错误位置
    // inline-source-map：内联，嵌套到js文件中。内联构建速度更快。只生成一个source-map。也提供错误代码的准确信息，和源代码的错误位置
    // hidden-source-map：外部生成source-map文件。提供错误代码的问题，但是错误代码的位置有问题，不能追踪到源代码的错误。
    // eval-source-map：内联。每一个文件都声称一个对应的 source-map。错误代码的信息，和源代码的错误位置
    // nosources-source-map：外部。错误代码的信息，但是没有源代码的信息。
    // cheap-source-map：外部。错误代码信息，有源代码的位置。错误位置提示的不精确（只能精确到行）
    // cheap-module-source-map：外部。错误代码信息，有源代码的位置。错误位置提示的不精确（只能精确到行）。module会将loader的source-map也加入进来
    // ......
    /*
        选择方式：
            开发环境：速度快，调试友好
                速度：eval > inline > cheap。(eval-cheap-source-map ，eval-source-map)
                调试友好：source-map > cheap-module-source-map > cheap-source-map
            生产环境：代码是否要隐藏，调试要不要友好
                inline：内联会让代码体积变大，所以生产环境不用内联
     */
    devtool: 'source-map',


    // 开发服务器配置
    // 启动：npx webpack serve
    // 如果是："webpack-cli": "^3.3.12", 3版本，还是使用 webpack-dev-server 启动
    devServer: {
        // 上下文路径
        contentBase: `${__dirname}/dist`, // path.resolve(__dirname, "dist"),
        // gzip 压缩，使代码体积更小，速度更快
        compress: true,
        // 进度条
        progress: true,
        // 开发服务端口
        port: 3000,
        // 是否自动打开浏览器，默认为 false，可配置具体的浏览器
        open: 'msedge',
        // 是否开启模块热切换，module上会挂一个 hot: true 的属性
        hot: true,

    }

};
