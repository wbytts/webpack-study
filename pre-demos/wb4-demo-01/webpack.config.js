const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    // 入口
    entry: "./src/index.js",
    // 出口
    output: {
        // 打包后的文件名
        filename: "bundle.[hash].js",
        // 打包后的路径，必须是一个绝对路径
        path: path.resolve(__dirname, "dist"),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true,
            minify: {
                // 删除属性的双引号
                removeAttributeQuotes: true,
                // 折叠空白
                collapseWhitespace: true,
            },
        }),
        // 抽离css
        new MiniCssExtractPlugin({
            filename: 'main.css'
        })
    ],

    // 优化项
    optimization: {
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },

    // 模块
    module: {
        rules: [
            { // 解析CSS
                test: /\.css$/,
                // css-loader 解析css样式
                // style-loader 把样式应用到页面中
                // loader的解析顺序，默认是从右向左执行
                // 如果只有一个 loader，可以写成字符串
                // loader 还可以写成数组、对象等 [{loader: xxx}, {loader: xxx}]
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            { // 解析LESS
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            { // 解析SASS， node-sass、sass-loader
                test: /\.sass$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-transform-runtime'
                            ],
                        }
                    }
                ],
                include: ['./src'],
                exclude: ['./node_modules'],
            }
        ]
    },

    // 模式 production、development
    mode: "development",

    // 开发服务器配置
    devServer: {
        // 服务端口
        port: 3000,
        // 进度条
        progress: true,
        // 路径
        contentBase: "./dist",
        // 压缩
        compress: true,
    }
};
