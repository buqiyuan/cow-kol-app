import RequestConfig from '@/utils/RequestConfig.js'
import ApiDomains from '@/utils/apiDomains.js'

// 用户
export default class User {
	// 登录
	login(data) {
		return RequestConfig.request({
			url: `${ApiDomains.base}/auth/type/phoneNumber`,
			method: 'post',
			data
		})
	}
	getUserInfo() {
		return RequestConfig.request({
			url: `${ApiDomains.user}/getUserInfo`,
			method: 'post'
		})
	}
	putUserLike(id) { // 用户点赞
		return RequestConfig.request({
			url: `${ApiDomains.userLike}/user/like/entry/${id}`,
			method: 'put',
		})
	}
	delUserLike(id) { // 用户取消点赞
		return RequestConfig.request({
			url: `${ApiDomains.userLike}/user/like/entry/${id}`,
			method: 'DELETE',
		})
	}
}
