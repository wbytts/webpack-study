
/*
    webpack.config.js：webpack的配置文件
    作用：指示webpack打包时遵循的规则

    所有基于nodejs平台运行的构建工具，模块化默认采用的都是commonjs
 */

const path = require('path');

// 处理HTML资源：npm install html-webpack-plugin -D
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口起点
    entry: './src/index.js',
    // 输出
    output: {
        // 输出的文件名
        filename: 'built.js',
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
                    // 创建style标签，将js中的css样式资源插入进去，添加到页面的head中生效
                    'style-loader',
                    // 将css文件编程commonjs模块加载到js中，里面的内容是样式字符串
                    'css-loader',
                ],
            },
            { // 匹配 LESS 文件（less less-loader）
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            { // 处理图片资源（需要 url-loader、file-loader）
                // 默认处理不到html中的图片
                test: /\.(jpg|png|gif)$/,
                use: 'url-loader',
                options: {
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
            
        ]
    },
    // plugin 配置，插件的配置
    plugins: [
        // 默认会创建一个HTML文件，自动引入打包输出的所有资源(无配置时）
        new HtmlWebpackPlugin({ // html-webpack-plugin
            // 使用指定的html文件作为基础模板(不要手动再引入资源了)，不再创建一个新的文件
            template: './src/index.html'
        }),
    ],

    // 模式：开发模式 development，生产模式 production
    mode: 'development',

}
