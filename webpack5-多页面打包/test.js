const glob = require('glob');
const path = require('path');

const filename = './src/home/index.js';

const matchResult = filename.match(/src\/(.*)\/index\.js/)
console.log(matchResult);

