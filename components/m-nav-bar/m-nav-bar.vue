<template>
	<view class="nav-bar">
		<view class="wrapper">
			<view class="left">
				<slot name="left">
					<m-avatar />
				</slot>
			</view>
			<view class="title">
				<slot name="title"></slot>
			</view>
			<view class="right">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	import MAvatar from './m-avatar.vue'
	export default {
		name: 'm-nav-bar',
		components: {
			MAvatar
		},
		data() {
			return {
				height: 0
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (res) => { // res - 各种参数
					console.log(res.windowHeight); // 屏幕的宽度 
					const query = uni.createSelectorQuery().in(this);
					query.select(".nav-bar").boundingClientRect((data) => { //data - 各种参数
						this.height = data.height // 获取元素高度
						this.height = this.height + 'px'
						console.log(this.height, '元素高度')
						this.$emit('getNavbarHeight', this.height)
					}).exec()
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		margin-top: var(--status-bar-height);
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 999;

		.wrapper {
			display: flex;
			padding: 12rpx 30rpx;

			> view {
				line-height: 78rpx;
			}

			.left {
				flex: 1;
				text-align: left;
			}

			.title {
				flex: 1;
				text-align: center;
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
</style>
