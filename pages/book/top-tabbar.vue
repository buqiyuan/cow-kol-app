<template>
	<view class="top-tabbar">
		<scroll-view :scroll-into-view="scrollInto" :scroll-x="true" :scroll="false">
			<view class="tab-list">
				<view @tap="tapTab(cateItem)" v-for="(cateItem, i) in categories" :key="cateItem.id" :id="`tab-${cateItem.alias}`" class="tab-item" :class="{active: currentCateAlias == cateItem.alias}">{{cateItem.name}}</view>
			</view>
		</scroll-view>
		<view class="tab-bar-line"></view>
		<swiper class="tab-view" v-if="categories.length" :current-item-id="currentCateAlias" @change="onswiperchange" @transition="onswiperscroll"
		 :duration="300">
			<swiper-item class="swiper-item" v-for="cateItem in categories" :item-id="cateItem.alias" :key="cateItem.id">
				<swiper-page :category="cateItem.alias" :current-cate-id="currentCateAlias"></swiper-page>
			</swiper-item>
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
				categories: [{
					alias: '',
					name: '全部'
				}], // 分类
				currentCateAlias: '',
				articles: {}, // 所有的文章
			}
		},
		mounted() {
			this.$nextTick(async () => {
				let {data} = await this.$minApi.Xiaoce.getNavList()
					this.categories.push(...data.d)
				console.log(this.categories, '小册分类')
			})
		},
		methods: {
			onswiperchange(e) {
				this.currentCateAlias = e.target.currentItemId || e.detail.currentItemId
				this.scrollInto = `tab-${this.currentCateAlias}`
			},
			onswiperscroll(e) {

			},
			tapTab(cateItem) {
				this.currentCateAlias = cateItem.alias
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
