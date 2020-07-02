<template>
	<view class="content">
		<m-nav-bar>
			<template v-slot:title>云盘</template>
			<template v-slot:right>
				<text class="iconfont icon-search"></text>
				<text class="iconfont icon-tianjia"></text>
			</template>
		</m-nav-bar>
		<view style="margin-top: 90px;" class="btn-row">
			<button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
			<button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		computed: {
			...mapState(['hasLogin', 'forcedLogin'])
		},
		methods: {
			...mapMutations(['logout']),
			bindLogin() {
				uni.navigateTo({
					url: '../login/index',
				});
			},
			bindLogout() {
				this.logout();
				/**
				 * 如果需要强制登录跳转回登录页面
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../login/index',
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.content {
}
</style>
