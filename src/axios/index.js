'use strict';

import axios from 'axios';
import router from '../router/index';
// import store from "../store/store";
//  import Qs from 'qs'; // 用来处理参数，可不使用，若要使用，npm安装： npm install qs
axios.defaults.baseURL = process.env.API_ROOT; // 请求的默认域名
console.log(process.env.API_ROOT);
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.put['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;


// 添加一个请求拦截器
axios.interceptors.request.use(config => {
    config.withCredentials = true;
    if(config.headers['Content-Type']!=='multipart/form-data'){//如果为multipart/form-data不做处理
      config.data = JSON.stringify(config.data); //数据转化,也可以使用qs转换
      if (config.method.toUpperCase() === 'POST') {
        //POST请求，参数转化
        if (config.params && config.data === undefined) {
          const formData = new FormData();
          for (let mapKey in config.params) {
            if (config.params.hasOwnProperty(mapKey)) {
              formData.append(mapKey, config.params[mapKey]);
            }
          }
          config.data = formData;
          config.params = undefined;
        }
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
// 添加一个响应拦截器
axios.interceptors.response.use(res => {
  if (res.data && res.status === 200) {
    if (res.data.code===401){
      router.push({path: '/'});
    }
    return res.data
  }
  // 在这里对返回的数据进行处理
  // console.log('网络正常', res.data);
  return res.data;
}, err => {
  console.log('网络开了小差！请重试...');
  return Promise.reject(err);
});

export default axios;


