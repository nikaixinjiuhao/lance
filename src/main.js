// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router";
import router from './router'
import axios from './axios/index'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);
// Vue.prototype.axios = axios;
Vue.config.productionTip = false
Vue.prototype.$axios = axios
import store from "./store";

import $ from 'jquery'
import ElementUi from 'element-ui';
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/css/bootstrap.css"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/css/monitor-bootstrap.css"
import "./assets/css/prism.css"
import VueDragResize from 'vue-drag-resize';
import layer from "layui-layer";

Vue.use(VueRouter)
Vue.use(ElementUi)
Vue.component('vue-drag-resize',VueDragResize)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
