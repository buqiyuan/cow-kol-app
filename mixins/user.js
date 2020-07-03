	import {
		mapState
	} from 'vuex'

export default {
	computed: {
		...mapState('user', {
			userInfo: state => state.userInfo
		})
	},
}