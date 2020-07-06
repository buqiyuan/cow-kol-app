<template>
    <view class="content">
        <m-nav-bar>
            <template v-slot:title>话题</template>
            <template v-slot:right>
                <text class="iconfont icon-search"></text>
                <text class="iconfont icon-tianjia"></text>
            </template>
            <template v-slot:content>
                <scroll-view class="scroll-view" scroll-y="true"
                             :lower-threshold="100" @scrolltolower="() => $refs.hotArticle.onLower()">
                <swiper class="banner-swiper" :indicator-dots="true" autoplay>
                    <swiper-item v-for="banner in bannerList" :key="banner._id">
                        <view class="swiper-item uni-bg-red">
                            <image :src="banner.screenshot" mode="aspectFill" class="banner-image"></image>
                        </view>
                    </swiper-item>
                </swiper>
                <view class="menu-list">
                    <view v-for="menuItem in menuList" :key="menuItem.name" class="menu-item">
                        <image :src="menuItem.src" mode="aspectFit"></image>
                        <text>{{menuItem.name}}</text>
                    </view>
                </view>
                <view class="split-line"></view>
                <hot-article ref="hotArticle" />
                </scroll-view>
            </template>
        </m-nav-bar>
    </view>
</template>

<script>
import HotArticle from './hot-article'
    export default {
    components: {HotArticle},
        data() {
            return {
                bannerList: [], // 轮播图列表
                menuList: [
                    {
                        name: '文章榜',
                        src: '/static/img/article-top.png'
                    },
                    {
                        name: '作者榜',
                        src: '/static/img/author-top.png'
                    },
                    {
                        name: '看一看',
                        src: '/static/img/lookat.png'
                    },
                    {
                        name: '话题广场',
                        src: '/static/img/topic_active.png'
                    },
                    {
                        name: '活动',
                        src: '/static/img/broadcast.png'
                    }
                ]
            }
        },
        mounted() {
        	this.getBanner()
        },
        methods: {
            async getBanner() {
                let {userId, token, clientId} = this.userInfo
                let params = {
                    uid: userId,
                    token,
                    client_id: clientId,
                    src: 'web',
                    orderType: 'startTime',
                    bannerStartTime: new Date().toISOString(),
                    pageNum: 1,
                    pageSize: 20,
                    showBanner: 1,
                }
                let {data} = await this.$minApi.Portal.getBanners(params)
                data.d.forEach(item => item.screenshot = this.getImage(item.screenshot))
                this.bannerList = data.d
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content {
        .banner-swiper {
            .banner-image {
                width: 100%;
                height: 150px;
            }
        }
        .menu-list {
            width: 100%;
            padding: 16rpx 0;
            display: flex;
            justify-content: space-around;
            .menu-item {
                display: flex;
                flex-direction: column;
                image {
                    width: auto;
                    height: 64rpx;
                }
                text {
                    font-size: 28rpx;
                }
            }
        }
        .scroll-view {
            height: calc(var(--scroll-view-height) + 50px);
            background-color: #f5f5f5;
        }
    }
</style>
