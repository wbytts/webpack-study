import './index.css'; // eslint-disable-next-line
import './a.ts';
import './test.js';


console.log('hello');


// 注册 serviceworker
// 处理兼容性问题，不支持就不用啦
/*
    sw代码必须运行在服务器上：
        npm i serve -g
        serve -s build 启动服务器，将build目录下的资源作为静态资源暴露出去
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => {
                console.log('sw注册成功了~');
            })
            .catch(() => {
                console.log('sw注册失败了~');
            });
    });
}
