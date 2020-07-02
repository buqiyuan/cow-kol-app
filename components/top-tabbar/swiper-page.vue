<template>
	<view>
		<scroll-view class="scroll-view" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
		 :lower-threshold="100" @scrolltolower="onLower" @refresherrefresh="onRefresh" refresher-background="transparent">
			<view v-for="{node} in articles.edges" :key="node.id" class="item">
				<view class="top-info">
					<view class="left">
						<image class="user-avatar" :src="node.user.avatarLarge || defaultAvatar" />
						<text>{{node.user.username}}</text>
					</view>
					<view class="right">
						<text class="tag-item" v-for="tagItem in node.tags" :key="tagItem.id">
							{{tagItem.title}}
						</text>
					</view>
				</view>
				<view class="middle-body">
					<view class="title">{{node.title}}</view>
					<view class="content">{{node.content}}</view>
				</view>
				<view class="bottom-info">
					<view @tap="tapLike(node)" class="info-item" :class="{'is-like': node.viewerHasLiked}">
						<view class="zan"></view>
						<text>{{node.likeCount}}</text>
					</view>
					<view class="info-item">
						<view class="comment"></view>
						<text>{{node.commentsCount}}</text>
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
				defaultAvatar: 'https://juejin.im/static/img/default-avatar.e30559a.svg',
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
			// 图片防盗链问题解决
			attachImageUrl() {
				this.defaultAvatar = this.defaultAvatar.replace(/http\w{0,1}:\/\/p/g, 'https://images.weserv.nl/?url=p')
			},
			currentCateIdChange(cateId) { // 当前的分类id变化事件
				if (cateId == this.category && !this.articles.edges.length) {
					this.getArticles()
				}
			},
			async getArticles(data = {}) { // 获取文章列表
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
						...data
					},
					"extensions": {
						"query": {
							"id": preset.includes(this.category) ? this.category : '653b587c5c7c8a00ddf67fc66f989d42'
						}
					}
				}
				// 获取文章列表
				let result = await this.$minApi.Article.getArticles(params)
				
				let items = []
				
				if (this.category === '504f6ca050625a4270ba11eebe696b3c') { // 如果分类id为关注
					result?.data.data?.followingArticleFeed?.items?.edges?.forEach(n => {
							n.node = {
								...n.node,
								...n.node.targets[0]
							}
					}) ?? []
					items = result?.data.data?.followingArticleFeed?.items || []
				} else {
					items = result?.data.data?.articleFeed?.items || []
				}
				
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

				.title {
					color: #333333;
					font-weight: 600;
					font-size: 28rpx;
				}

				.content {
					color: #909090;
					font-size: 24rpx;
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
					}

					.zan {
						background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg);
					}

					.comment {
						background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg);
					}

					&.is-like {
						color: #6cbd45;

						.zan {
							background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/zan-active.930baa2.svg);
						}
					}
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
