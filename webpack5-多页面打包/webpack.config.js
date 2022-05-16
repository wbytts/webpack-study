const path = require('path');
const webpack = require('webpack');
// npm install glob -D
const glob = require('glob');
// npm install html-webpack-plugin -D
const htmlWebpackPlugin = require('html-webpack-plugin');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  // 如果路径中有中文的话，匹配好像会出错
  // const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  const entryFiles = glob.sync('./src/*/index.js');
  Object.keys(entryFiles).map(index => {
    const entryFile = entryFiles[index];
    const matchResult = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = matchResult && matchResult[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(new htmlWebpackPlugin({
      template: path.join(__dirname, `./src/${pageName}/index.html`),
      filename: `${pageName}.html`,
      chunks: [pageName],
      inject: true,
      miniify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
      },
    }));
  });

  return {entry, htmlWebpackPlugins};
}

const {entry, htmlWebpackPlugins} = setMPA();

module.exports = {
  mode: 'none',
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  module: {
    rules: []
  },
  plugins: [
    ...htmlWebpackPlugins,
  ]
}

