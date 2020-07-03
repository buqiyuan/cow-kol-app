<template>
	<view class="content">
		<m-nav-bar>
			<template v-slot:title>话题</template>
			<template v-slot:right>
				<text class="iconfont icon-search"></text>
				<text class="iconfont icon-tianjia"></text>
			</template>
		</m-nav-bar>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {
			}
		},
		created() {
			// this.$minApi.user.login({
			// 	"username": "莫变机构",
			// 	"password": "ax2657585",
			// })
		},
		mounted() {},
		computed: {
			...mapState('user', ['userInfo'])
		},
		methods: {
			...mapActions('user', ['Login']),
		}
	}
</script>

<style lang="scss" scoped>
	.content {
	}
</style>
