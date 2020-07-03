<template>
	<view class="article-detail">
		<m-nav-bar :navBarBorder="true" :showTitle="false" :showRight="false">
			<template v-slot:left>
				<view class="article-top">
					<text @click="back" class="icon-back iconfont"></text>
					<view :class="{switchTitle: isTop}" class="user-info">
						<view v-if="articleDetail.content" class="user">
							<image :src="author.avatarLarge" class="user-avatar"></image>
							<text class="username">{{author.username}}</text>
							<image class="user-level" :src="`/static/img/level/ic_user_lv${author.level}.png`"></image>
						</view>
						<text>文章详情页</text>
					</view>
				</view>
			</template>
			<template v-slot:content>
				<!-- 文章内容区 -->
				<scroll-view @scroll="scroll" :upper-threshold="0" :scroll-y="true" class="article-content">
					<image v-if="!articleDetail.content" class="loading-icon" src="/static/svg/Rolling-1s-200px.svg"></image>
					<view class="content">
						<view class="article-title">{{articleDetail.title}}</view>
						<view class="content" v-html="articleDetail.content"></view>
					</view>
				</scroll-view>
			</template>
		</m-nav-bar>
		<view class="bottom-bar">
			<view class="bottom-item">
				<image src="/static/svg/zan.svg"></image>
				{{articleDetail.collectionCount}}
			</view>
			<view class="bottom-item">
				<image src="/static/svg/comment.svg"></image>
				{{articleDetail.commentsCount}}
			</view>
			<view class="bottom-item">
				<image src="/static/svg/star.svg"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTop: true,
				articleDetail: {}
			}
		},
		beforeMount() {
			this.getDetailData()
		},
		computed: {
			author() {
				return this.articleDetail.user || {}
			}
		},
		methods: {
			back() {
				this.$Router.back()
			},
			async getDetailData() {
				let {
					data: data1
				} = await this.getDetailDataByType('entry')
				this.articleDetail = data1.d
				let {
					data: data2
				} = await this.getDetailDataByType('entryView')
				console.log(data2, '第二段')
				this.articleDetail.content = data1.d.content + data2.d.content
			},
			getDetailDataByType(type) {
				let {
					userId,
					clientId,
					token
				} = this.userInfo
				let params = {
					type,
					uid: userId,
					device_id: clientId,
					token: token,
					src: 'web',
					postId: this.$Route.query.postId.split('/').reverse()[0],
				}
				return this.$minApi.Article.getDetailData(params)
			},
			scroll(e) {
				this.isTop = e.detail.scrollTop < 20
			}
		}
	}
</script>

<style scoped lang="scss">
	.article-detail {
		.bottom-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 16rpx 0;
			display: flex;
			justify-content: space-evenly;
			border-top: 1px solid #ebebeb;
			background-color: white;

			image {
				width: 46rpx;
				height: 46rpx;
			}

			.bottom-item {
				position: relative;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;

				&:not(:last-of-type)::after {
					position: absolute;
					right: 0;
					content: '';
					width: 2rpx;
					height: 80%;
					background-color: #ebebeb;
				}
			}
		}

		.article-top {
			display: flex;
			position: relative;
			overflow: hidden;

			.user-info {
				position: absolute;
				margin-left: 80rpx;
				transition: transform .2s;

				&.switchTitle {
					transform: translateY(-42px);
				}

				.user {
					display: flex;
					align-items: center;

					.user-avatar {
						width: 50rpx;
						height: 50rpx;
						border-radius: 100%;
					}

					.user-level {
						width: 46rpx;
						height: 28rpx;
						margin-left: 10rpx;
					}

					.username {
						margin-left: 12rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}

			}
		}

		.article-content {
			position: relative;
			height: var(--scroll-view-height);

			.loading-icon {
				position: absolute;
				top: 20rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 50rpx;
				height: 50rpx;
			}

			.content {
				padding: 14rpx;

				.article-title {
					font-size: 48rpx;
					font-weight: 700;
					margin: 20rpx;
				}
			}
		}

	}
</style>
