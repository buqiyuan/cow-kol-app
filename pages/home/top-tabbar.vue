<template>
	<view class="top-tabbar">
		<scroll-view :scroll-into-view="scrollInto" :scroll-x="true" :scroll="false">
			<view class="tab-list">
				<template v-for="(cateItem, i) in categories">
					<view @tap="tapTab(cateItem)" :key="cateItem.id" :id="`tab-${cateItem.id}`" class="tab-item" :class="{active: currentCateId == cateItem.id}">{{cateItem.name}}</view>
				</template>
			</view>
		</scroll-view>
		<view class="tab-bar-line"></view>
		<swiper class="tab-view" v-if="categories.length" :current-item-id="currentCateId" @change="onswiperchange" @transition="onswiperscroll"
		 :duration="300">
			<template v-for="cateItem in categories">
				<swiper-item class="swiper-item" :item-id="cateItem.id" :key="cateItem.id">
					<swiper-page :category="cateItem.id" :current-cate-id="currentCateId"></swiper-page>
				</swiper-item>
			</template>
		</swiper>
	</view>
</template>

<script>
	import SwiperPage from './swiper-page'
	import {mapState} from 'vuex'

	export default {
		components: {
			SwiperPage
		},
		data() {
			return {
				scrollInto: '',
				currentIndex: 1,
				categories: [], // 分类
				currentCateId: '21207e9ddb1de777adeaca7a2fb38030',
				articles: {}, // 所有的文章
			}
		},
		watch: {
			isLogin(val) {
					if (!val) {
						this.categories = this.categories.filter(item => item.id !== '504f6ca050625a4270ba11eebe696b3c')
						console.log(this.categories, '登出去了')
						if (this.currentCateId == '504f6ca050625a4270ba11eebe696b3c') this.currentCateId = this.categories[0].id
					} else {
						let index = this.categories.findIndex(item => item.id == '504f6ca050625a4270ba11eebe696b3c')
						if (index == -1) {
							this.categories.splice(1, 0 ,{name: '关注', id: '504f6ca050625a4270ba11eebe696b3c'})
							this.$forceUpdate()
						}
					}
				}
		},
		mounted() {
			this.$nextTick(async () => {
				let result = await this.$minApi.Article.getCategories()
				if (result.statusCode === 200) {
					let preset = [{name: '推荐', id: '21207e9ddb1de777adeaca7a2fb38030'}]
					if(this.isLogin) {
						preset.push({name: '关注', id: '504f6ca050625a4270ba11eebe696b3c'})
					}
					// 21207e9ddb1de777adeaca7a2fb38030 // 推荐
					// 504f6ca050625a4270ba11eebe696b3c // 关注
					result.data.d.categoryList.unshift(...preset)
					this.categories = result.data.d.categoryList
					this.currentCateId = this.categories[0].id
				}
			})
		},
		methods: {
			onswiperchange(e) {
				this.currentCateId = e.target.currentItemId || e.detail.currentItemId
				this.scrollInto = `tab-${this.currentCateId}`
			},
			onswiperscroll(e) {

			},
			tapTab(cateItem) {
				console.log(cateItem, '为啥')
				this.currentCateId = cateItem.id
			},

		}
	}
</script>

<style lang="scss" scoped>
	.top-tabbar {
		width: 100%;

		.tab-list {
			width: 750rpx;
			height: 80rpx;
			flex-direction: row;
			display: flex;
			white-space: nowrap;
			flex-wrap: nowrap;

			.tab-item {
				display: flex;
				align-items: center;
				position: relative;
				padding-left: 34rpx;
				padding-right: 34rpx;
				font-size: 32rpx;

				&.active::after {
					content: '';
					position: absolute;
					left: 0;
					right: 0;
					height: 6rpx;
					bottom: -1px;
					background-color: blue;
				}
			}

		}

		.tab-view {
			height: var(--scroll-view-height);
		}

		.scroll-view-indicator {
			position: relative;
			height: 2px;
			background-color: transparent;
		}

		.scroll-view-underline {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 0;
			background-color: #007AFF;
		}

		.scroll-view-animation {
			transition-duration: 0.2s;
			transition-property: left;
		}

		.tab-bar-line {
			height: 1upx;
			background-color: #cccccc;
		}
	}
</style>
