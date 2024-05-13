// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store'

import '@/static/fonts/iconfont.css'

import mixin from './mixin/index.js'
Vue.mixin(mixin)

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.prototype.$store = store
Vue.prototype.$showToast = (title, icon = 'none') => {
	uni.showToast({
		title,
		icon
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif