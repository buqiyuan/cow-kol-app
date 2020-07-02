<script>
	import {
		mapState
	} from 'vuex'

	export default {
		globalData: {},
		computed: {
			...mapState('user', ['forcedLogin', 'hasLogin', 'userName'])
		},
		async created() {
			// let res = await this.$minApi.user.getInfo()
			// console.log(res, '是')
		}
	}
</script>

<style>
	@import url("./static/iconfont/iconfont.css");

	* {
		box-sizing: border-box;
	}
	body {
		font-size: 16px;
		height: 100vh;
		overflow: hidden;
		--scroll-view-height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - 44px - 50px);
	}
</style>
