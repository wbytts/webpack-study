// 入口文件 index.js
/*
    运行指令：
        开发环境：webpack ./src/index.js -o ./build --mode=development
        生产环境：webpack ./src/index.js -o ./build --mode=production
            生产环境当前比开发环境多了一个压缩js代码，别的暂看不出
 */

//import './index.css';

function add(x, y) {
    return x + y;
}

console.log(add(3, 4));

