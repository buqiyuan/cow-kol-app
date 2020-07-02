<template>
	<view :style="{'--navbar-height': navbarHeight}" class="content">
		<m-nav-bar @getNavbarHeight="getNavbarHeight">
			<template v-slot:title>消息列表</template>
			<template v-slot:right>
				<text class="iconfont icon-search"></text>
				<text class="iconfont icon-tianjia"></text>
			</template>
		</m-nav-bar>
		<top-tabbar></top-tabbar>
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
				navbarHeight: 0
			}
		},
		mounted() {},
		computed: {
			...mapState('user', ['userInfo'])
		},
		methods: {
			...mapActions('user', ['Login']),
			getNavbarHeight(val) {
				this.navbarHeight = val
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-top: calc(var(--status-bar-height) + var(--navbar-height));
	}
</style>
