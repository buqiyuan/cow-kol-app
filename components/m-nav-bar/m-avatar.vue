<template>
	<view class="container">
		<view @tap="showDrawer = true" class="avatar-box">
			<image class="avatar" :src="userInfo.user.avatarHd || userInfo.user.avatarLarge"></image>
		</view>
		<m-drawer :width="280" :visible="showDrawer" mode="left" @close="showDrawer = false">
			<view class="drawer-box">
				<view class="top-bg">
					<image class="avatar" :src="userInfo.user.avatarHd || userInfo.user.avatarLarge"></image>
					<view class="username">
						{{userInfo.user.username}}
					</view>
					<view class="organization">
						{{`${userInfo.user.jobTitle} @ ${userInfo.user.company}` }}
					</view>
					<text class="iconfont icon-richscan_icon"></text>
				</view>
				<view class="menu-list">
					<view @click="handleEventName(item.eventName)" v-for="item in menuList" :key="item.icon" class="menu-item">
						<text class="iconfont" :class="[item.icon]" :style="{color: item.color}"></text>
						<text>{{item.text}}</text>
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
				menuList: [
					{
						text: '钱包',
						icon: 'icon-qianbao',
						color: '#3688ff',
						eventName: 'testTaobao'
					},
					{
						text: '收藏',
						icon: 'icon-shoucang',
						color: '#f7b52c',
						eventName: 'testTaobao'
					},
					{
						text: '添加朋友',
						icon: 'icon-tianjiahaoyou',
						color: '#0c90f8',
						eventName: 'testTaobao'
					},
					{
						text: '测试淘宝',
						icon: 'icon-shouji',
						color: '#2c49ff',
						eventName: 'testTaobao'
					}
				]
			}
		},
		methods:{
			handleEventName(eventName) {
				this[eventName](eventName)
			},
			testTaobao(eventName) {
				uni.navigateTo({
					url: '/pages/test/test-taobao'
				})
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

		.avatar-box {
			display: flex;
			.avatar {
				width: 78rpx;
				height: 78rpx;
				border-radius: 100%;
			}
		}

		.drawer-box {
			position: relative;
			padding: 30rpx;
			padding-top: var(--status-bar-height);

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				z-index: -10;
				height: calc(var(--status-bar-height) + 150px);
				background-image: url(http://image.biaobaiju.com/uploads/20190703/19/1562151838-ryluZHxFdc.jpeg);
				background-size: cover;
			}

			.top-bg {
				position: relative;
				padding-top: 20px;

				.avatar {
					width: 130rpx;
					height: 130rpx;
					border-radius: 100%;
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
				}
			}
			/* 菜单列表 */
			.menu-list {
				padding-top: 20px;
				.menu-item {
					padding: 10px 0;
					.iconfont {
						margin-right: 10px;
					}
				}
			}
		}
	}
</style>
