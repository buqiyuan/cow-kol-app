<template>
	<view>
		<scroll-view class="scroll-view" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
		 :lower-threshold="100" @scrolltolower="onLower" @refresherrefresh="onRefresh" refresher-background="transparent">
			<view v-for="item in articles.edges" @click="nav2Article(item.node)" :key="item.node.id" class="item">
				<view class="top-info">
					<view class="left">
						<image class="user-avatar" :src="item.node.user.avatarLarge || defaultAvatar" />
						<text>{{item.node.user.username}}</text>
					</view>
					<view class="right">
						<text class="tag-item" v-for="tagItem in item.node.tags" :key="tagItem.id">
							{{tagItem.title}}
						</text>
					</view>
				</view>
				<view class="middle-body">
					<view :class="{content: item.node.content}">
						<view class="info">
							<text class="title">{{item.node.title}}</text><br />
							<text class="text">{{item.node.content}}</text>
						</view>
						<image mode="aspectFill" class="screenshot" v-if="item.node.content && item.node.screenshot" :src="item.node.screenshot"></image>
					</view>
				</view>
				<view class="bottom-info">
					<view @tap.stop="tapLike(item.node)" class="info-item">
						<image :src="`/static/svg/zan${item.node.viewerHasLiked ? '_active' : ''}.svg`" class="zan"></image>
						<text>{{item.node.likeCount}}</text>
					</view>
					<view class="info-item">
						<image src="/static/svg/comment.svg" class="comment"></image>
						<text>{{item.node.commentsCount}}</text>
					</view>
				</view>
			</view>
			<view v-show="!triggered" class="loading-more">
				<image v-if="articles.pageInfo && articles.pageInfo.hasNextPage" class="loading-icon" src="/static/svg/Rolling-1s-200px.svg"></image>
				<text v-else>没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			category: {
				type: String,
				default: ''
			},
			currentCateId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				triggered: false,
				_freshing: false ,
				defaultAvatar: '/static/svg/default_avatar.svg',
				articles: {
					edges: []
				}
			}
		},
		watch: {
			currentCateId: { // 监听分类id变化
				handler: 'currentCateIdChange',
				immediate: true
			}
		},
		created() {
			// this.attachImageUrl()
		},
		onLoad() {
			this._freshing = false;
			setTimeout(() => {
				this.triggered = true;
			}, 1000)
		},
		methods: {
			nav2Article(node) { // 到文章详情页
				// 带查询参数，变成 /router1?plan=private
				this.$Router.push({ name: 'article', params: { postId: node.originalUrl.split('/').reverse()[0] }})
			},
			onLower(e) { // 上拉加载更多
				if(this.articles.pageInfo.hasNextPage) {
					let data = {
						after: this.articles.pageInfo.endCursor
					}
					this.getArticles(data)
				}
			},
			onRefresh() { // 下拉刷新
				 this.getArticles()
			},
			tapLike(target) { // 点赞或取消点赞
				let {
					node
				} = this.articles.edges.find(item => item.node.id == target.id)
				node.viewerHasLiked ? this.$minApi.user.delUserLike(node.id) : this.$minApi.user.putUserLike(node.id)
				node.likeCount = node.viewerHasLiked ? --node.likeCount : ++node.likeCount
				node.viewerHasLiked = !node.viewerHasLiked
			},
			currentCateIdChange(cateId) { // 当前的分类id变化事件
				if (cateId == this.category && !this.articles?.edges?.length) {
					this.getArticles()
				}
			},
			async getArticles(variables = {}) { // 获取文章列表
			if (this._freshing) return;
			this._freshing = true;
			if (!this.triggered) this.triggered = true; //界面下拉触发，triggered可能不是true，要设为true

				// 推荐                                        // 关注
				let preset = ['21207e9ddb1de777adeaca7a2fb38030', '504f6ca050625a4270ba11eebe696b3c']

				let params = {
					"operationName": "",
					"query": "",
					"variables": {
						"tags": [],
						"category": this.category,
						"first": 20,
						type: "ARTICLE",
						"after": "",
						"order": "POPULAR",
						...variables
					},
					"extensions": {
						"query": {
							"id": preset.includes(this.category) ? this.category : '653b587c5c7c8a00ddf67fc66f989d42'
						}
					}
				}
				// 获取文章列表
				let {data: {data}} = await this.$minApi.Article.getArticles(params)

				let items = []

				if (this.category === '504f6ca050625a4270ba11eebe696b3c') { // 如果分类id为关注
					data?.followingArticleFeed?.items?.edges?.forEach(n => {
						n.node = {
							...n.node,
							...n.node.targets[0]
						}
					}) ?? []
					items = data?.followingArticleFeed?.items || []
				} else {
					items = data?.articleFeed?.items || []
				}

				// #ifdef MP-WEIXIN
				items.edges.forEach(n => {
					n.node.screenshot = this.getImage(n.node.screenshot)
					n.node.user.avatarLarge = this.getImage(n.node.user.avatarLarge)
				})
				// #endif

				if(params.variables.after) { // 如果不为空，则为加载更多
					this.articles.edges.push(...items.edges)
					this.articles.pageInfo = items.pageInfo
				} else {
					this.articles = items
				}

				this.triggered = false;//触发onRestore，并关闭刷新图标
				this._freshing = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-view {
		height: var(--scroll-view-height);
		background-color: #f5f5f5;

		.item {
			display: flex;
			flex-direction: column;
			background-color: white;
			padding: 14rpx;
			margin-bottom: 16rpx;

			.top-info {
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;

				.left {
					display: flex;
					align-items: center;

					.user-avatar {
						width: 44rpx;
						height: 44rpx;
						border-radius: 44rpx;
						margin-right: 6rpx;
					}
				}

				.right {
					color: #b2bac2;

					.tag-item {
						&::after {
							content: ' / ';
						}

						&:last-of-type::after {
							content: '';
						}
					}
				}
			}

			.middle-body {
				padding: 10rpx 0;

				.content {
					display: flex;
					color: #909090;
					font-size: 24rpx;
					max-height: 80px;
					.info {
						flex: 5;
						margin-right: 12rpx;
						max-height: 100%;
						@include ellipsisMultiline(4);

						.title {
							color: #333333;
							font-weight: 600;
							font-size: 28rpx;
						}
						.text {

						}
					}
					.screenshot {
						flex: 2;
						width: auto;
						height: auto;
					}
				}
			}

			.bottom-info {
				display: flex;
				font-size: 14px;
				color: #b2bac2;

				.info-item {
					display: flex;
					align-items: center;
					margin-right: 10rpx;

					.zan,
					.comment {
						width: 32rpx;
						height: 32rpx;
						background-size: contain;
					}

					/*.zan {*/
					/*	background-image: url('/static/svg/zan.svg');*/
					/*}*/

					/*.comment {*/
					/*	background-image: url('/static/svg/comment.svg');*/
					/*}*/

					/*&.is-like {*/
					/*	color: #6cbd45;*/

					/*	.zan {*/
					/*		background-image: url('/static/svg/zan_active.svg');*/
					/*	}*/
					/*}*/
				}
			}
		}
		.loading-more {
			position: relative;
			width: 100vw;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.loading-icon {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
</style>
