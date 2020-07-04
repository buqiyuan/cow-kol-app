<template>
	<view>
		<scroll-view class="scroll-view" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
		 :lower-threshold="100" @scrolltolower="onLower" @refresherrefresh="onRefresh" refresher-background="transparent">
			<view v-for="node in pinList.list" @click="nav2Article(node)" :key="node.objectId" class="item">
				<view class="top-info">
					<view class="left">
						<image class="user-avatar" :src="node.user.avatarLarge || defaultAvatar" />
						<view class="user-desc">
							<text>{{node.user.username}}</text>
							<view class="user-info">
								<text>{{node.user.jobTitle}}
									<text v-if="node.user.jobTitle">   @   </text>
									{{node.user.company}}
								</text>
								<text>{{node.createdAt | dateAgo}}</text>
							</view>
						</view>
					</view>
					<view class="right">
						<text class="tag-item" v-for="tagItem in node.tags" :key="tagItem.id">
							{{tagItem.title}}
						</text>
					</view>
				</view>
				<view class="middle-body">
					<view class="title">{{node.title}}</view>
					<view :class="{content: node.content}">
						<text class="text">{{node.content}}</text>
					</view>
					<view class="pictures">
						<image v-for="picItem in node.pictures" class="picture-item" :key="picItem" :src="picItem"></image>
					</view>
				</view>
				<view class="bottom-info">
					<view @tap="tapLike(node)" class="info-item">
						<image :src="`/static/svg/zan${node.isLiked ? '_active' : ''}.svg`" class="zan"></image>
						<text>{{node.likedCount}}</text>
					</view>
					<view class="info-item">
						<image src="/static/svg/comment.svg" class="comment"></image>
						<text>{{node.commentCount}}</text>
					</view>
					<view class="info-item">
						<image src="/static/svg/share.svg" class="share"></image>
						<text>分享</text>
					</view>
				</view>
			</view>
			<view v-show="!triggered" class="loading-more">
				<image v-if="hasNextPage" class="loading-icon" src="/static/svg/Rolling-1s-200px.svg"></image>
				<text v-else>没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			category: {
				type: Object,
				default: () => {}
			},
			currentCateId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				triggered: false,
				_freshing: false,
				defaultAvatar: '/static/svg/default_avatar.svg',
				pinList: { // 沸点列表
					list: [],
					page: 0,
					pageSize: 20,
					total: 21
				}
			}
		},
		watch: {
			currentCateId: { // 监听分类id变化
				handler: 'currentCateIdChange',
				immediate: true
			}
		},
		computed: {
			cateId() {
				return this.category.id
			},
			hasNextPage() {
				return this.pinList.page * this.pinList.pageSize < this.pinList.total
			}
		},
		// onLoad() {
		// 	this._freshing = false;
		// 	setTimeout(() => {
		// 		this.triggered = true;
		// 	}, 1000)
		// },
		methods: {
			nav2Article(node) { // 到文章详情页
				// 带查询参数，变成 /router1?plan=private
				this.$Router.push({
					name: 'article',
					params: {
						postId: node.originalUrl
					}
				})
			},
			onLower(e) { // 上拉加载更多
				if (this.hasNextPage) {
					this.getArticles()
				}
			},
			onRefresh() { // 下拉刷新
				this.pinList.page = 0
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
				if (cateId == this.category.id && !this.pinList.list.length) {
					console.log(this.category.id, '55what')
					console.log(cateId, 'what')
					this.getPinList()
				}
			},
			query() { // 查询推荐、关注、热门
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
							"id": preset.includes(this.category.type) ? this.category : '653b587c5c7c8a00ddf67fc66f989d42'
						}
					}
				}
			},
			async getPinList() { // 获取列表
				let {
					userId,
					clientId,
					token
				} = this.userInfo

				let params = {
					uid: userId,
					device_id: clientId,
					token: token,
					src: 'web',
					topicId: this.cateId,
					page: this.pinList.page,
					pageSize: this.pinList.pageSize,
					sortType: 'rank'
				}

				// 获取文章列表
				let {data: {d}} = await this.$minApi.Article.getPinList(params)

				// #ifdef MP-WEIXIN
				d.list.forEach(item => {
					item.user.avatarLarge = this.getImage(item.user.avatarLarge)
					item.pictures.forEach((n,i) => item.pictures[i] = this.getImage(n))
				})
				// #endif

				if (params.page) { // 如果不为空，则为加载更多
					this.pinList.list.push(...d.list)
				} else {
					this.pinList.list = d.list
				}
				this.pinList.total = d.total
				this.pinList.page++
			},
			async getArticles(data = {}) { // 获取文章列表
				if (this._freshing) return;
				this._freshing = true;
				if (!this.triggered) this.triggered = true; //界面下拉触发，triggered可能不是true，要设为true

				// 推荐                                        // 关注
				let preset = ['recommended', 'hot', 'following']

				if (preset.includes(this.category.type)) {

				} else {
					await this.getPinList()
				}

				this.triggered = false; //触发onRestore，并关闭刷新图标
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
			margin-bottom: 16rpx;

			.top-info {
				padding: 14rpx;
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;

				.left {
					display: flex;
					align-items: center;

					.user-avatar {
						width: 64rpx;
						height: 64rpx;
						border-radius: 64rpx;
						margin-right: 6rpx;
					}
					.user-desc {
						display: flex;
						flex-direction: column;
						.user-info {
							> text {
								margin-right: 4px;
							}
						}
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
				padding: 10rpx;

				.title {
					color: #333333;
					font-weight: 600;
					font-size: 28rpx;
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
				.content {
					display: flex;
					color: #909090;
					font-size: 24rpx;
					max-height: 90px;
					@include ellipsisMultiline(4);

					.text {
						flex: 3;
						margin-right: 12rpx;
					}

					.screenshot {
						flex: 1;
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
					flex: 1;
					height: 60rpx;
					justify-content: center;
					border-top: 1px solid #f5f5f5;

					.zan,.share,
					.comment {
						width: 32rpx;
						height: 32rpx;
						background-size: contain;
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
