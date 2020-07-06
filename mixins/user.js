	import {
		mapState, mapMutations
	} from 'vuex'

export default {
	computed: {
		...mapState('user', {
			userInfo: state => state.userInfo,
			isLogin: state => state.isLogin
		}),
		...mapState('common', ['softInputHeight'])
	},
	methods: {
		...mapMutations('common', ['setSoftInputHeight']),
		toLogin() { // 去登陆
			this.$Router.push({name: 'login'})
		},
		isNeedToLogin() { // 是否需要去登陆
			if (!this.isLogin) this.toLogin()
			return this.isLogin
		},
		getImage(url){
			// 把现在的图片连接传进来，返回一个不受限制的路径
			if(url !== undefined){
				// #ifdef MP-WEIXIN
				return url.includes('images.weserv') ? url : url.replace(/^(http)[s]*(\:\/\/)/,'https://images.weserv.nl/?url=')
				// #endif
				return url;
			}
		},
		// 图片url地址转base64
		urlToBase64(url) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: url,
					method: 'GET',
					responseType: 'arraybuffer',
					fail: error => {
						reject(error);
					},
					success: async res => {
						let base64 = uni.arrayBufferToBase64(res.data);
						base64 = 'data:image/jpeg;base64,' + base64;
						resolve(base64);
					}
				})
			})
		}
	}
}
