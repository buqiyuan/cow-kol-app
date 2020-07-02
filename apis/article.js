import RequestConfig from '@/utils/RequestConfig.js'
import ApiDomains from '@/utils/apiDomains.js'

// 用户
export default class Article {
	// 文章分类
	getCategories(data) {
		return RequestConfig.request({
			url: `${ApiDomains.goldTag}/categories`,
			method: 'get',
			data
		})
	}
	getArticles(data) {
		return RequestConfig.request({
			url: `${ApiDomains.webApi}/query`,
			method: 'post',
			data
		})
	}
}
