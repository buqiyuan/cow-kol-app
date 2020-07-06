<template>
	<view class="container">
		<view @tap="showDrawer = true" class="avatar-box">
			<image class="avatar" :src="userAvatar"></image>
		</view>
		<m-drawer :width="280" :visible="showDrawer" mode="left" @close="showDrawer = false">
			<view class="drawer-box">
				<image class="user-bg" src="/static/img/user-bg.jpg"></image>
				<view @tap="hasLogin" class="top-bg">
					<image class="avatar" :src="userAvatar"></image>
					<view class="username">
						{{userName}}
					</view>
					<view v-if="isLogin" class="organization">
						{{ `${userInfo.user.jobTitle} @ ${userInfo.user.company}` }}
					</view>
					<text class="iconfont icon-richscan_icon"></text>
				</view>
				<view class="menu-list">
					<view @tap="handleEventName(item.eventName)" v-for="item in menuList" :key="item.icon" class="menu-item">
						<image class="icon" :src="item.icon"></image>
						<text>{{item.text}}</text>
					</view>
					<view @tap="logout" v-if="isLogin" class="bottom-row menu-item">
						<image class="icon" src="/static/img/drawer/logout.png"></image>
						退出登录
					</view>
				</view>
			</view>
		</m-drawer>
	</view>
</template>

<script>
	import MDrawer from './m-drawer.vue'

	export default {
		name: 'm-avatar',
		components: { MDrawer },
		data() {
			return {
				showDrawer: false,
				defaultAvatar: '/static/svg/default_avatar.svg',
				menuList: [
					{
						text: '消息中心',
						icon: '/static/img/drawer/notice.png',
						eventName: 'testTaobao'
					},
					{
						text: '我赞过的',
						icon: '/static/svg/zan_active.svg',
						eventName: 'testTaobao'
					},
					{
						text: '收藏集',
						icon: '/static/img/drawer/collect.png',
						eventName: 'testTaobao'
					},
					{
						text: '已购小册',
						icon: '/static/img/drawer/shopping-bag.png',
						eventName: 'testTaobao'
					}
				]
			}
		},
		computed:{
			userAvatar() { // 用户头像
				return this.userInfo.user?.avatarHd || this.userInfo.user?.avatarLarge || this.defaultAvatar
			},
			userName() {
				if(this.isLogin) {
					return this.userInfo.user.username
				} else {
					return '点击登陆'
				}
			}
		},
		methods:{
			logout() {
				uni.showModal({
					title:'提示',
					content:'确定退出登录吗？',
					success: (e) => {
						if (e.confirm) {
							uni.clearStorage()
							console.log(this.$store)
							this.$store.commit('user/LogOut')
							uni.showToast({
								title:'登出成功！'
							})
						}
					}
				})
			},
			handleEventName(eventName) {
				this[eventName](eventName)
			},
			testTaobao(eventName) {

			},
			hasLogin() {
				if (!this.isLogin) this.$Router.push({name: 'login'})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		position: relative;
		top: 0;
		z-index: 999;
		line-height: 1.4;

		.avatar-box {
			display: flex;
			.avatar {
				width: 78rpx;
				height: 78rpx;
				border-radius: 100%;
			}
		}

		.drawer-box {
			height: 100%;
			display: flex;
			flex-direction: column;
			position: relative;
			padding: 30rpx;
			padding-top: var(--status-bar-height);

			.user-bg {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				z-index: -10;
				width: 100%;
				height: calc(var(--status-bar-height) + 150px);
			}

			.top-bg {
				position: relative;
				padding-top: 20px;
				color: white;

				.avatar {
					width: 130rpx;
					height: 130rpx;
					border-radius: 100%;
					border: 1px solid #fff;
					background-color: white;
				}

				.username {
					font-size: 36rpx;
					margin-bottom: 8rpx;
				}

				.organization {
					font-size: 30rpx;
				}

				.icon-richscan_icon {
					position: absolute;
					top: 45rpx;
					right: 15rpx;
					color: black;
				}
			}
			/* 菜单列表 */
			.menu-list {
				position: relative;
				padding-top: 20px;
				height: 100%;
				.menu-item {
					display: flex;
					align-items: center;
					padding: 10px 0;
					.icon {
						width: 32rpx;
						height: 32rpx;
						margin-right: 16rpx;
					}
				}
				/*.bottom-row {
					position: absolute;
					bottom: -10rpx;
					border-top: 1px solid #efefef;
				}*/
			}
		}
	}
</style>
