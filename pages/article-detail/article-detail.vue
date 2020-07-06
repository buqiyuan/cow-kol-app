<template>
	<view class="article-detail">
		<m-nav-bar :navBarBorder="true" :showTitle="false" :showRight="false">
			<template v-slot:left>
				<view class="article-top">
					<text @tap="back" class="icon-back iconfont"></text>
					<view :class="{switchTitle: isTop && articleDetail.content}" class="user-info">
						<view v-if="articleDetail.content" class="user">
							<image :src="authorAvatar" class="user-avatar"></image>
							<text class="username">{{author.username}}</text>
							<user-level :level="author.level" />
						</view>
						<text>文章详情页</text>
					</view>
				</view>
			</template>
			<template v-slot:content>
				<!-- 文章内容区 -->
				<scroll-view @scroll="scroll" :scroll-into-view="scrollInto" :upper-threshold="0" :scroll-y="true" class="article-content">
					<image v-if="!articleDetail.content" class="loading-icon" src="/static/svg/Rolling-1s-200px.svg"></image>
					<view class="content">
						<view class="article-title">{{articleDetail.title}}</view>
						<view class="content" v-html="articleDetail.content"></view>
					</view>
					<view class="split-line"></view>
					<view id="comment-area" class="comment-list">
						<comment-item v-for="commentItem in comments" :key="commentItem.id" :comment-item="commentItem" />
					</view>
				</scroll-view>
			</template>
		</m-nav-bar>
		<view class="bottom-bar">
			<comment-action-bar @scrollToComment="scrollToComment" :article-detail="articleDetail" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollInto: '',
				comments: [], // 评论列表
				isTop: true,
				articleDetail: {}
			}
		},
		mounted() {
			this.getDetailData()
		},
		computed: {
			author() {
				return this.articleDetail.user || {}
			},
			authorAvatar() {
				return this.getImage(this.author.avatarLarge)
			}
		},
		methods: {
			back() {
				this.$Router.back()
			},
			scrollToComment() { // 滚动到评论区
				this.scrollInto = ''
				setTimeout(() => this.scrollInto = 'comment-area', 100)
			},
			async getComment(data = {}, objectId) { // 获取文章评论列表
				let {data: commentData} = await this.$minApi.Article.getComment({}, objectId)
				this.comments = commentData.d.comments
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
				 this.getComment({}, this.articleDetail.objectId)
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
					postId: this.$Route.query.postId,
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
			}

			.comment-list {

			}
		}
	}
</style>
