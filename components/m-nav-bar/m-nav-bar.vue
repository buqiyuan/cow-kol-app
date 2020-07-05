<template>
	<view :style="{'--navbar-height': navbarHeight}" class="content">
		<view class="nav-bar" :class="{border: navBarBorder}">
			<view class="wrapper">
				<view class="left">
					<slot name="left">
						<m-avatar />
					</slot>
				</view>
				<view v-if="showTitle" class="title">
					<slot name="title"></slot>
				</view>
				<view v-if="showRight" class="right">
					<!-- #ifdef APP-PLUS || H5 -->
					<slot name="right"></slot>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<view class="body">
			<view v-show="loading" class="loading-box">
				<image class="loading-image" src="/static/svg/loading.svg"></image>
			</view>
			<slot v-show="!loading" name="content"></slot>
		</view>
	</view>
</template>

<script>
	import MAvatar from './m-avatar.vue'
	export default {
		name: 'm-nav-bar',
		props:{
			navBarBorder: { // 是否显示导航栏底部
				type: Boolean,
				default: false
			},
			showTitle: { // 是否显示标题
				type: Boolean,
				default: true
			},
			showRight: { // 是否显示右侧操作
				type: Boolean,
				default: true
			}
		},
		components: {
			MAvatar
		},
		data() {
			return {
				loading:true,
				navbarHeight: 0
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (res) => { // res - 各种参数
					console.log(res.windowHeight); // 屏幕的宽度
					const query = uni.createSelectorQuery().in(this);
					query.select(".nav-bar").boundingClientRect((data) => { //data - 各种参数
						let height = data.height // 获取元素高度
						this.navbarHeight = height + 'px'
					}).exec()
					setTimeout(() => this.loading = false, 1200)
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-top: calc(var(--status-bar-height) + var(--navbar-height));

		.nav-bar {
			margin-top: var(--status-bar-height);
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 999;
			&.border {
				border-bottom: 1px solid #ebebeb;
			}

			.wrapper {
				display: flex;
				padding: 12rpx 30rpx;

				>view {
					line-height: 78rpx;
				}

				.left {
					flex: 1;
					text-align: left;
				}

				.title {
					flex: 1;
					text-align: center;
					font-size: 40rpx;
				}

				::v-deep .right {
					flex: 1;
					text-align: right;

					text,
					view {
						margin-left: 12px;
					}
				}
			}
		}
		.body {
			.loading-box {
				width: 100vw;
				height: 100vh;
				position: fixed;
				z-index: 999;
				background-color: #fff;

				.loading-image {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}
	}
</style>
