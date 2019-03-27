import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

require("./assets/js/Bmob-1.6.7.min.js");
Bmob.initialize(
  "b693220fd79aa6692aea45eb7eb96c2f",
  "f6d61dad8f043f92bdf0cc6eec3ae9ff"
);
Vue.prototype.$Bmob = Bmob;


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
