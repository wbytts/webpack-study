// 引入js资源
import $ from 'jquery';
// 引入样式
import './index.less';

$('#title').click(() => {
   $('body').css('background-color', 'deeppink');
});
