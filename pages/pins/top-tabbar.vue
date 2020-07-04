<template>
	<view class="top-tabbar">
		<scroll-view :scroll-into-view="scrollInto" :scroll-x="true" :scroll="false">
			<view class="tab-list">
				<view @tap="tapTab(cateItem)" v-for="(cateItem, i) in pinCategoryList" :key="cateItem.id" :id="`tab-${cateItem.id}`"
				 class="tab-item" :class="{active: currentCateId == cateItem.id}">{{cateItem.title}}</view>
			</view>
		</scroll-view>
		<view class="tab-bar-line"></view>
		<swiper class="tab-view" :current-item-id="currentCateId" @change="onswiperchange" @transition="onswiperscroll"
		 :duration="300">
			<swiper-item class="swiper-item" v-for="cateItem in pinCategoryList" :item-id="cateItem.id" :key="cateItem.id">
				<swiper-page :category="cateItem" :current-cate-id="currentCateId"></swiper-page>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import SwiperPage from './swiper-page'
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			SwiperPage
		},
		data() {
			return {
				scrollInto: '',
				currentIndex: 1,
				pinCategoryList: [
				// 	{ // 沸点分类
				// 	type: "recommended",
				// 	name: "recommended",
				// 	title: "推荐 ",
				// 	id: "249431a8e4d85e459f6c29eb808e76d0"
				// }, {
				// 	type: "hot",
				// 	name: "hot",
				// 	title: "热门 ",
				// 	id: "f0a2fbbc03d4d46266e40762139c414c"
				// }, {
				// 	type: "following",
				// 	name: "following",
				// 	title: "关注 ",
				// 	id: "648c28f5213f7d3601f4d5efa7fa3826"
				// },
				{
					type: "topic",
					name: "opensource",
					title: "开源推荐 ",
					id: "5c09ea2b092dcb42c740fe73"
				}, {
					type: "topic",
					name: "recruitment",
					title: "内推招聘",
					id: "5abb61e1092dcb4620ca3322"
				}, {
					type: "topic",
					name: "dating",
					title: "掘金相亲",
					id: "5abcaa67092dcb4620ca335c"
				}, {
					type: "topic",
					name: "slacking",
					title: "上班摸鱼",
					id: "5c106be9092dcb2cc5de7257"
				}, {
					type: "topic",
					name: "app",
					title: "应用安利",
					id: "5b514af1092dcb61bd72800d"
				}, {
					type: "topic",
					name: "tool",
					title: "开发工具",
					id: "5abb67d2092dcb4620ca3324"
				}, {
					type: "topic",
					name: "news",
					title: "New资讯",
					id: "5c46a17f092dcb4737217152"
				}],
				currentCateId: '5c09ea2b092dcb42c740fe73',
				articles: {}, // 所有的文章
			}
		},
		methods: {
			onswiperchange(e) {
				this.currentCateId = e.target.currentItemId || e.detail.currentItemId
				this.scrollInto = `tab-${this.currentCateId}`
			},
			onswiperscroll(e) {

			},
			tapTab(cateItem) {
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
