const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const uglifyjsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        // path: './dist', // 不能写相对路径，需要动态获取
        path: path.resolve(__dirname, 'dist'),
        filename: 'bytc.js',
        // publicPath: 'dist/'
    },
    resolve: {
        extensions: ['.js', '.css', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new webpack.BannerPlugin('最终版权归bytc所有'),
        new htmlWebpackPlugin({
            template: 'index.html'
        }),
        // new uglifyjsPlugin() // 开发阶段不建议代码丑化
    ],
    // 真正发布时不需要
    devServer: {
        port: 8888,
        contentBase: './dist',
        inline: true
    },
    module: {
        rules: [
            { // 打包CSS文件的配置
                test: /\.css$/,
                // 也可以直接写 use: ['style-loader', 'css-loader]
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            { // 打包LESS文件的配置
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            { // 打包SCSS文件的配置
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            { // 打包图片资源
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 当图片小于limit时，会被编译成base64字符串形式
                            // 当图片大于limit时，需要使用file-loader模块进行加载
                            // limit默认是 8196
                            limit: 8186,
                            name: 'images/[name]-[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            { // ES6语法转换为ES2015版本
                // test: /\.m?js$/,
                // exclude: /(node_modules|brower_components)/,
                // use: {
                //     loader: 'babel-loader',
                //     options: {
                //         pressets: ['es2015']
                //     }
                // }
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
        ]
    }
}
