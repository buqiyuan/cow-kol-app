import MinRequest from './MinRequest'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
	const userInfo = uni.getStorageSync('userInfo')
	if (userInfo) {
		// 全局 token
		request.header.token = userInfo.token
	}
	if (request.contentType == 'fd') {
		request.header['Content-Type'] = 'multipart/form-data'
		const fd = new FormData()
		Object.keys(request.data).forEach(key => fd.append(key, request.data[key]))
		request.data = fd
	} else if (request.contentType == 'fd') {
		request.header['Content-Type'] = 'multipart/form-data'
	}

	request.header['X-Juejin-Src'] = 'web'
	request.header["X-Legacy-Token"] = userInfo.token || ""
	request.header["X-Legacy-Uid"] = userInfo.userId || ""
	request.header["X-Legacy-Device-Id"] = userInfo.clientId || ""
	request.header["X-Agent"] = "Juejin/Web"
	request.header["X-Juejin-Uid"] = userInfo.userId || ""
	request.header["X-Juejin-Client"] = userInfo.clientId || ""
	request.header["X-Juejin-Token"] = userInfo.token || ""
	
	return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	if (response.statusCode == 401) {
		uni.showModal({
			showCancel: false,
			content: response.data.msg,
			success: (res) => {
				if (res.confirm) {
					uni.redirectTo({
						url: '/pages/login/index'
					})
				}
			}
		})
	}
	return response
})

// 设置默认配置
minRequest.setConfig((config) => {
	// config.baseURL = 'http://192.168.1.157:9000/v1'
	config.baseURL = 'http://47.102.196.128:8084/v1'
	return config
})

export default minRequest
