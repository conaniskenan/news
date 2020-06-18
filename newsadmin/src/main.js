import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import ElementUI from "element-ui" //引入js

import "element-ui/lib/theme-chalk/index.css" //引入css
import "./assets/css/global.css"
import axios from "axios"

axios.defaults.headers.post["Content-Type"] = "application/json"
// axios.defaults.headers.common["token"] = localStorage.getItem("token")
axios.interceptors.request.use(
  (config) => {
    // * 判断是否存在token，如果存在的话，则每个http header都加上token
    // * token会在登录之后存储在本地
    if (localStorage.token) {
      config.headers["Authorization"] = localStorage.token
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
