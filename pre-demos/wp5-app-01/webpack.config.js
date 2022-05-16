
/*
    此配置文件基于 webpack 5
    webpack.config.js：webpack的配置文件
    作用：指示webpack打包时遵循的规则
    所有基于nodejs平台运行的构建工具，模块化默认采用的都是commonjs
 */

// node内置模块，处理路径问题
const path = require('path');
// 处理HTML资源：npm install html-webpack-plugin -D
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 提取css为单独文件：npm install mini-css-extract-plugin -D
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css插件：npm install optimize-css-assets-webpack-plugin -D
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// PWA：渐进式网络开发应用程序（离线可访问）
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

// 定义 nodejs 环境变量，从而决定 browserslist使用哪个配置
process.env.NODE_ENV = 'development';

// 抽取公共的 css 相关 loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: () => [
                    require('postcss-preset-env')()
                ]
            }
        }
    },
];

module.exports = {
    // 入口起点，单入口
    entry: './src/index.js',
    // 多入口
    // entry: {
    //     index: './src/index.js',
    //     test: './src/test.js',
    // },
    // 输出
    output: {
        // 输出的文件名
        filename: '[contenthash:10].js',
        // [name] 多入口时
        // filename: '[name].[contenthash:10].js',

        // 输出的路径（要求是绝对路径）
        // __dirname 表示当前文件所在的绝对路径
        path: path.resolve(__dirname, 'build'),
    },
    // loader 的配置
    module: {
        // 解析规则配置
        rules: [
            { // 匹配所有的css文件（style-loader css-loader）
                test: /\.css$/,
                // 对匹配到的文件应用下面的loader
                // use可以使用：字符串(简单)、对象(可配置)
                use: [ // loader的执行顺序：从后往前依次执行
                    //'style-loader', // 创建style标签，将js中的css样式资源插入进去，添加到页面的head中生效
                    MiniCssExtractPlugin.loader, // 将CSS样式抽取为CSS文件，然后引入到html中
                    // 将css文件编程commonjs模块加载到js中，里面的内容是样式字符串
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            // ident: 'postcss',
                            postcssOptions: {
                                plugins: () => [
                                    // postcss的插件
                                    // 帮助postcss找到package.json中browserslist中的配置，通过配置加载指定的css兼容性样式
                                    require('postcss-preset-env')()
                                ]
                            }
                        }
                    },
                ],
            },
            { // 匹配 LESS 文件（less less-loader）
                test: /\.less$/,
                use: [
                    ...commonCssLoader,
                    'less-loader'
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
                    name: '[hash:10].[ext]'
                }
            },
            { // 处理HTML中的图片（负责引入img（使用commonjs规范），使之能被 url-loader 解析）
                test: /\.html$/,
                use: 'html-loader'
            },
            // { // eslint 语法检查
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: "eslint-loader",
            //     options: {
            //         // 自动修复
            //         fix: true,
            //     }
            // },
            { // js兼容性处理，babel
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // 预设：指示babel怎样做兼容性处理
                    presets: [
                        [
                            '@babel/preset-env',
                            { // 按需加载，需要 corejs
                                useBuiltIns: 'usage',
                                corejs: { // 指定 corejs 的版本
                                    version: 3
                                },
                                // 指定具体的兼容性做到哪个浏览器
                                targets: {
                                    chrome: '60',
                                    firefox: '60',
                                    ie: '9',
                                    safari: '10',
                                    edge: '17'
                                }
                            }
                        ],
                    ],
                    // 开启babel缓存
                    // 第二次构建时，会读取之前的缓存
                    cacheDirectory: true,
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            { // 打包其他资源（不需要做处理的资源，直接输出即可）
                // 通过 exclude 去排除也可以
                // 如字体图标资源
                test: /\.(svg|eof|fft)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                }
            }
        ]
    },
    // plugin 配置，插件的配置
    plugins: [
        // 默认会创建一个HTML文件，自动引入打包输出的所有资源(无配置时）
        new HtmlWebpackPlugin({ // html-webpack-plugin
            // 使用指定的html文件作为基础模板(不要手动再引入资源了)，不再创建一个新的文件
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
        // 压缩css
        new optimizeCssAssetsWebpackPlugin(),
        // PWA
        new WorkboxWebpackPlugin.GenerateSW({
            /*
               1. 帮助 serviceworker 快速启动
               2. 删除旧的 serviceworker
               生成一个 serviceworker 配置文件
               在入口js文件中注册 serviceworker
             */
            clientsClaim: true,
            skipWaiting: true,
        })
    ],

    resolve: {
        // 引入的时候，这几个文件的后缀名，可以省略不写！
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            // 让 @ 作为 src 目录路径的别名
            '@': path.join(__dirname, 'src')
        }
    },

    // 模式：开发模式 development，生产模式 production
    //mode: 'development',
    // 和nodejs环境保持一致
    mode: process.env.NODE_ENV,

    // 优化
    optimization: {
        // 切分代码块
        splitChunks: {
            // 可以将node_modules中的代码单独打包成一个 chunk 最终输出
            // 还会自动分析多入口文件中有没有公共的文件，如果有，会抽取称为一个单独的chunk（如果很小，则不会抽取，默认大小自己查）
            chunks: "all"
        }
    },

    externals: {
        // 忽略库名，以及对应的 npm 包名。具体使用可以通过cdn进行引入
        jquery: 'jquery',
    },

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

    // 开发服务器配置（"webpack-dev-server": "^3.11.2"，"webpack-cli": "^4.6.0"）
    // 启动：npx webpack serve
    // 如果是："webpack-cli": "^3.3.12", 3版本，还是使用 webpack-dev-server 启动
    devServer: {
        // 上下文路径
        contentBase: path.resolve(__dirname, "build"),
        // gzip 压缩
        compress: true,
        // 进度条
        progress: true,
        // 服务端口
        port: 3000,
        // 是否自动打开浏览器
        open: 'msedge',
        // 是否开启模块热切换，module上会挂一个 hot: true 的属性
        hot: true,

    }
}
