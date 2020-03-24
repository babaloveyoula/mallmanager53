// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/css/reset.css"
import "./assets/fonts/iconfont.css"
import axios from "axios"
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$http=axios
// 设置公共基准地址
axios.defaults.baseURL="https://www.liulongbin.top:8888/api/private/v1/"
// 设置http请求授权
axios.interceptors.request.use(config=>{
  
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
