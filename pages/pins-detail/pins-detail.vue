<template>
	<view class="article-detail">
		<m-nav-bar :navBarBorder="true" :showTitle="false" :showRight="false">
			<template v-slot:left>
				<view class="article-top">
					<text @click="back" class="icon-back iconfont"></text>
					<view :class="{switchTitle: isTop}" class="user-info">
						<view v-if="articleDetail.content" class="user">
							<image :src="authorAvatar" class="user-avatar"></image>
							<text class="username">{{author.username}}</text>
							<user-level :level="author.level" />
						</view>
						<text>沸点详情页</text>
					</view>
				</view>
			</template>
			<template v-slot:content>
				<!-- 文章内容区 -->
				<scroll-view @scroll="scroll" :upper-threshold="0" :scroll-y="true" class="article-content">
					<image v-if="!articleDetail.content" class="loading-icon" src="/static/svg/Rolling-1s-200px.svg"></image>
					<view class="content">
						<view class="article-title">{{articleDetail.title}}</view>
						<text class="content">{{articleDetail.content}}</text>
						<view class="pictures">
							<image v-for="picItem in articleDetail.pictures" class="picture-item" :key="picItem" :src="picItem"></image>
						</view>
					</view>
					<view class="split-line"></view>
					<view class="comment-list">
						<comment-item v-for="commentItem in comments" :key="commentItem.id" :comment-item="commentItem" />
					</view>
				</scroll-view>
			</template>
		</m-nav-bar>
		<view class="bottom-bar">
			<comment-action-bar :article-detail="articleDetail" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				comments: [], // 评论列表
				isTop: true,
				articleDetail: {}
			}
		},
		mounted() {
			this.getPinById()
		},
		computed: {
			author() {
				return this.articleDetail.user || {}
			},
			authorAvatar() {
				// #ifdef MP-WEIXIN
				return this.getImage(this.author.avatarLarge)
				// #endif
				return this.author.avatarLarge
			}
		},
		methods: {
			back() {
				this.$Router.back()
			},
			async getTopicComment(data = {}, msgId) { // 获取评论列表
				let {data: commentData} = await this.$minApi.Article.getTopicComment({}, msgId)
				this.comments = commentData.d.comments
			},
			async getPinById(type) {
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
					msgId: this.$Route.query.msgId,
				}
				let {data} = await this.$minApi.Article.getPinById(params)
				// #ifdef MP-WEIXIN
				data.d.forEach(item => {
					item.pictures.forEach((n,i) => item.pictures[i] = this.getImage(n))
				})
				// #endif
				this.articleDetail = data.d
				this.getTopicComment({}, params.msgId)
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
			padding-bottom: 10px;

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
				.pictures {
					display: flex;
					flex-wrap: wrap;
					.picture-item {
						flex: 1;
						max-width: 45%;
						min-width: 30%;
						max-height: 180px;
					}
				}
			}
		}

	}
</style>
