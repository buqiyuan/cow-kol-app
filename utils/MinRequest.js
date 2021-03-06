const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')

class MinRequest {
	[config] = {
		baseURL: '',
		header: {
			'content-type': 'application/json'
		},
		method: 'GET',
		dataType: 'json',
		responseType: 'text'
	}

	interceptors = {
		request: (func) => {
			if (func) {
				MinRequest[requestBefore] = func
			} else {
				MinRequest[requestBefore] = (request) => request
			}

		},
		response: (func) => {
			if (func) {
				MinRequest[requestAfter] = func
			} else {
				MinRequest[requestAfter] = (response) => response
			}
		}
	}

	static[requestBefore](config) {
		return config
	}

	static[requestAfter](response) {
		return response
	}

	static[isCompleteURL](url) {
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	setConfig(func) {
		this[config] = func(this[config])
	}

	request(options = {}) {
		options.baseURL = options.baseURL || this[config].baseURL
		options.dataType = options.dataType || this[config].dataType
		// #ifdef MP-WEIXIN
		if (options.data) {
			let newData = {}
			Object.keys(options.data).forEach(key => {
				if (options.data[key] != undefined) {
					newData[key] = options.data[key]
				}
			})
			options.data = newData
		}
		// #endif
		options.header = {
			...options.header,
			...this[config].header
		}
		options.method = options.method.toUpperCase() || this[config].method.toUpperCase()

		options = {
			...options,
			...MinRequest[requestBefore](options)
		}
		options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)

		return new Promise((resolve, reject) => {
			options.success = function(res) {
				resolve(MinRequest[requestAfter](res))
			}
			options.fail = function(err) {
				reject(MinRequest[requestAfter](err))
			}
			uni.request(options)
		})
	}

	get(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	}

	post(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}

	put(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	}

	delete(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}

MinRequest.install = function(Vue) {
	Vue.mixin({
		beforeCreate: function() {
			if (this.$options.api) {
				Vue._minRequest = this.$options.api
			}
		}
	})
	Object.defineProperty(Vue.prototype, '$minApi', {
		get: function() {
			return Vue._minRequest
		}
	})
}

export default MinRequest
