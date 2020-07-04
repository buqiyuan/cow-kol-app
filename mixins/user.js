	import {
		mapState
	} from 'vuex'

export default {
	computed: {
		...mapState('user', {
			userInfo: state => state.userInfo,
			isLogin: state => state.isLogin
		})
	},
	methods: {
		getImage(url){
			// 把现在的图片连接传进来，返回一个不受限制的路径
			if(url !== undefined){
				return url.replace(/^(http)[s]*(\:\/\/)/,'https://images.weserv.nl/?url=');
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
