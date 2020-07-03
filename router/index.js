import Vue from 'vue'
//这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import Router from 'uni-simple-router'

Vue.use(Router)
//初始化
const router = new Router({
    routes:ROUTES //路由表
});

// 忽略验证的路由
let ignoreRoutes = ['forgotPassword', 'login', 'register']

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// let token = uni.getStorageSync('userInfo').token
 //  //登录拦截
 //    if(!token && !ignoreRoutes.includes(to.name)) {
 //  		next({
 //  			path: '/pages/login/index',
 //  			NAVTYPE: 'push'
 //  		});
 //  	} else {
  		next();
 //  	}
})
// 全局路由后置守卫
router.afterEach((to, from) => {
})
export default router;