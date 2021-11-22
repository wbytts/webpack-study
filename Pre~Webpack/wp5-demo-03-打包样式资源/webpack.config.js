
/*
    webpack.config.js：webpack的配置文件
    作用：指示webpack打包时遵循的规则

    所有基于nodejs平台运行的构建工具，模块化默认采用的都是commonjs
 */

const path = require('path');

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
            { // 匹配所有的css文件
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
            { // 匹配 LESS 文件
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    // plugin 配置，插件的配置
    plugins: [],

    // 模式：开发模式 development，生产模式 production
    mode: 'development',

}
