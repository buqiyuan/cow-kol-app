import RequestConfig from '@/utils/RequestConfig.js'
import ApiDomains from '@/utils/apiDomains.js'

// 用户
export default class Portal {
	// 获取轮播图
	getBanners(data) {
		return RequestConfig.request({
			url: `${ApiDomains.eventStorage}/getEventList`,
			method: 'get',
			data
		})
	}
}
