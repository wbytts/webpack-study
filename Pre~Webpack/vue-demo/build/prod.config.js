const uglifyjsPlugin = require('uglifyjs-webpack-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = webpackMerge(baseConfig, {
    plugins: [
        new uglifyjsPlugin() // 开发阶段不建议代码丑化
    ],
})

