import axios from 'axios';
import querystring from 'querystring';
import eventbus from '@/module/common/EventBus';
import { MessageBox } from 'mint-ui';

// 超时时间
axios.defaults.timeout = 5000;

axios.interceptors.request.use(config => {
  // element ui Loading方法
  eventbus.broadcast('loading-start');
  return config;
}, error => {
  eventbus.broadcast('loading-close');
  return Promise.reject(error);
});
// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
  eventbus.broadcast('loading-close');
  if (data && data.data === '请登录') {
    return MessageBox({
      title: '哎呀，登录态丢失了~~~',
      confirmButtonText: '去登录'
    }).then(() => {
      location.hash = '#/login';
    });
  }
  return data;
}, error => {
  eventbus.broadcast('loading-close');
  return Promise.reject(error);
});
const querySymble = (url, qs = {}) => {
  if (JSON.stringify(qs) === '{}') {
    return '';
  }
  if (url.indexOf('?') > -1) {
    return '&';
  }
  return '?';
};

export const fetch = (url, options) => {
  const {
    method = 'get',
    body = {},
    query = {}
  } = options;
  const qs = Object.assign({}, query);
  const fetchUrl = url + querySymble(url, qs) + querystring.encode(qs);
  const data = Object.assign({}, body, options.data);
  return axios(fetchUrl, {
    method: method.toUpperCase(),
    data
  });
};