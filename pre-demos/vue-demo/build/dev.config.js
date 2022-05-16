const webpackMerge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = webpackMerge(baseConfig, {
    // 真正发布时不需要
    devServer: {
        port: 8888,
        contentBase: './dist',
        inline: true
    }
})