	import {
		mapState
	} from 'vuex'

export default {
	computed: {
		...mapState('user', {
			userInfo: state => state.userInfo
		})
	},
	methods: {
		getImage(url){
			// 把现在的图片连接传进来，返回一个不受限制的路径
			if(url !== undefined){
				return url.replace(/^(http)[s]*(\:\/\/)/,'https://images.weserv.nl/?url=');
			}
		},
	}
}
