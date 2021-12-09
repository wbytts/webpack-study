import _ from 'lodash';
import './style.css';
import './a.less';
import './b.scss';
import './c.styl';
import Pic from './zhongqiu.jpg';

function component() {
  const element = document.createElement('div');

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Pic;
  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());
