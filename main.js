import Vue from 'vue'
import App from './App'

import { RouterMount } from 'uni-simple-router'
import router from './router/index.js'
import mina from './components/min-a.vue'
import MinCache from './utils/MinCache'
import MinRequest from './utils/MinRequest'
import MinRouter from './utils/MinRouter'
import api from './utils/api'
import user from './mixins/user.js'

import store from './store'

Vue.mixin(user)

Vue.config.productionTip = false

// 注册缓存器
Vue.use(MinCache)
// 设置默认缓存时间
// Vue.use(MinCache, {timeout: 600})

// 注册请求
Vue.use(MinRequest)
//  跳转标签组件
Vue.component('min-a', mina)

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App,
	MinRouter,
	api
})
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,'#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif