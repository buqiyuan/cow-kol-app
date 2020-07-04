import Api from '@/utils/api.js'
import common from '@/mixins/user.js'
const localAuth = uni.getStorageSync('auth') || {}
const userInfo = uni.getStorageSync('userInfo') || {}

const user = {
	namespaced: true,
	state: {
		isLogin: userInfo?.token ? true : false, // 是否登录
		forcedLogin: true, //是否需要强制登录
		userInfo: { // 用户信息
			...userInfo
		},
	},

	mutations: {
		setUserData: (state, data) => { // 登录或注册成功后设置相应的数据
			state.userInfo = data
			state.isLogin = true
			uni.setStorage({
				key: 'userInfo',
				data: data
			})
		},
		setUserAvatar(state, url) { // 设置用户头像
			state.userInfo.user.avatarLarge = url
		}
	},

	actions: {
		// 手机号码登录
		LoginByAccount({
			commit,
			dispatch,
			state
		}, userInfo) {
			return new Promise((resolve, reject) => {
				Api.user.login(userInfo).then(async res => {
					console.log(res, '请求结果')
					if (res.statusCode === 200) { // 登录成功！
						let url = await common.methods.urlToBase64(res.data.user.avatarLarge)
						res.data.user.avatarLarge = url
						res.data.user.password = userInfo.password
						commit('setUserData', res.data)
					}
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},

		LoginByEmail({
			commit,
			state
		}, data) { // 验证码登录
			return new Promise((resolve, reject) => {
				Api.user.phoneLogin({ ...data
				}).then( res => {
					console.log(res, '登录结果')
					if (res.code === 0) { // 登录成功
						commit('setUserData', res)
					}
					resolve(res)
				}).catch(error => reject(error))
			})
		},

		Register({
			commit,
			dispatch,
			state
		}, registerParams) {
			return new Promise((resolve, reject) => {
				Api.user.register(registerParams).then(res => {
					console.log(res, '注册结果')
					if (res.code === 0) {
						commit('setUserData', res)
					}
					resolve(res)
					this.$Message.error(res.msg)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 获取用户信息
		GetInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				Api.user.getUserInfo(state.token).then(response => {
					const data = response.data
					if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
						commit('SET_ROLES', data.roles)
					} else {
						reject('getInfo: roles must be a non-null array !')
					}
					commit('SET_NAME', data.name)
					commit('SET_AVATAR', data.avatar)
					resolve(response)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 登出
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				Api.user.logout().then(res => {
					commit('SET_TOKEN', '')
					commit('SET_ROLES', [])
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 前端 登出
		FedLogOut({
			commit
		}) {
			return new Promise(resolve => {
				commit('SET_TOKEN', '')
				resolve()
			})
		}
	},
	getters: {
		userInfo: state => ({ ...state
		})
	}
}

export default user
