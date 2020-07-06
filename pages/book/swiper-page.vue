<template>
    <view>
        <scroll-view class="scroll-view" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
                     :lower-threshold="100" @scrolltolower="onLower" @refresherrefresh="onRefresh"
                     refresher-background="transparent">
            <view v-for="item in articles" :key="item.id" class="item">
                <view class="top-info">
                    <view class="left">
                        <image class="poster" :lazy-load="true" :src="item.img"/>
                    </view>
                    <view class="middle">
                        <text class="title">{{item.title}}</text>
                        <text class="username">
                            {{item.userData.username}}
                            <user-level size="small" :level="item.userData.level" />
                        </text>
                        <view class="info">
                            <view class="presale">{{item.finishedAt | finished}} </view>
                            <text>{{item.lastSectionCount}} 小节</text>
                            <text>{{item.buyCount}}人已购买</text>
                        </view>
                    </view>
                    <view class="right">
                        <text class="price">￥{{item.price}}</text>
                    </view>
                </view>
            </view>
            <view v-show="!triggered" class="loading-more">
                <image v-if="hasMore" class="loading-icon" src="/static/svg/Rolling-1s-200px.svg"></image>
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
        filters: {
            finished(val) {
                return new Date(val).getTime() > Date.now() ? '预售' : ''
            }
        },
        data() {
            return {
                pageNum: 1,
                triggered: false,
                _freshing: false,
                hasMore: true, // 是否还有
                defaultAvatar: '/static/svg/default_avatar.svg',
                articles: []
            }
        },
        watch: {
            currentCateId: { // 监听分类id变化
                handler: 'currentCateIdChange',
                immediate: true
            }
        },
        methods: {
            nav2Article(node) { // 到文章详情页
                // 带查询参数，变成 /router1?plan=private
                this.$Router.push({name: 'article-detail', params: {postId: node.originalUrl.split('/').reverse()[0]}})
            },
            onLower(e) { // 上拉加载更多
                if (this.hasMore) {
                    this.getArticles()
                }
            },
            onRefresh() { // 下拉刷新
                this.hasMore = true
                this.pageNum = 1
                this.getArticles('init')
            },
            currentCateIdChange(cateId) { // 当前的分类id变化事件
                if (cateId == this.category && !this.articles.length) {
                    this.getArticles()
                }
            },
            async getArticles(type) { // 获取文章列表
                if (this._freshing) return;
                this._freshing = true;
                if (!this.triggered) this.triggered = true; //界面下拉触发，triggered可能不是true，要设为true

                let {userId, token, clientId} = this.userInfo

                let params = {
                    uid: userId,
                    client_id: clientId,
                    token,
                    src: 'web',
                    alias: this.category,
                    pageNum: this.pageNum++
                }

                // 获取文章列表
                let {data} = await this.$minApi.Xiaoce.getListByLastTime(params)

                console.log(data.d, '小册列表')

                // #ifdef MP-WEIXIN
                // #endif

                if (data.d.length === 0 || data.d.length < 20) this.hasMore = false

                data.d.forEach(item => item.img = this.getImage(item.img))

                if (type == 'init') {
                    this.articles = data.d
                } else {
                    this.articles.push(...data.d)
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
                    flex: 1;
                    display: flex;
                    align-items: center;

                    .poster {
                        width: 104rpx;
                        height: 144rpx;
                        margin-right: 6rpx;
                    }
                }

                .middle {
                    flex: 4;
                    display: flex;
                    flex-direction: column;
                    text-align: left;

                    .title {
                        font-size: 26rpx;
                        font-weight: 600;
                    }
                    .username {
                        font-size: 22rpx;
                        margin: 10rpx 0;
                    }

                    .info {
                        display: flex;
                        font-size: 22rpx;
                        > text {
                            &::after {
                                content: "·";
                                margin: 5px;
                            }

                            &:last-of-type::after {
                                content: none;
                            }
                        }
                        .presale {
                            color: #ed7b11;
                            &::after {
                                content: "·";
                                margin: 5px;
                            }
                            &:empty:after{
                                content: none;
                            }
                        }
                    }
                }

                .right {
                    flex: 1;
                    align-self: center;

                    .price{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 15px;
                        height: 30px;
                        border-radius: 15px;
                        background-color: #f0f7ff;
                        color: #07f;
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
