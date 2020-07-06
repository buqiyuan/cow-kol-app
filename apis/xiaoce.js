import RequestConfig from '@/utils/RequestConfig.js'
import ApiDomains from '@/utils/apiDomains.js'

// 用户
export default class Xiaoce {
	// 获取获取小册分类导航
	getNavList(data) {
		return RequestConfig.request({
			url: `${ApiDomains.xiaoceTimeline}/getNavList`,
			method: 'get',
			data
		})
	}
	// 获取获取小册列表
	getListByLastTime(data) {
		return RequestConfig.request({
			url: `${ApiDomains.xiaoceTimeline}/getListByLastTime`,
			method: 'get',
			data
		})
	}
}
