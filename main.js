import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import store from './store/index.js'
Vue.use(uView)
import {myRequest} from "api/api.js"
Vue.config.productionTip = false
Vue.prototype.$http=myRequest
// import uView from '@/uni_modules/uview-ui'
// Vue.use(uView)
App.mpType = 'app'
const app = new Vue({
	store,
    ...App,
})
app.$mount()
