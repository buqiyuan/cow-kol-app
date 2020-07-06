<template>
    <view class="hot-article">
        <view class="top">
            <image class="hot-icon" src="/static/img/hot.png"></image>
            <text>热门文章</text>
        </view>
        <view class="article-list">
            <view v-for="item in articles.edges" @tap="nav2Article(item.node)" :key="item.node.id" class="article-item">
                <view class="left">
                    <text class="title">{{item.node.title}}</text>
                    <view class="desc">
                        <text>{{item.node.likeCount}}赞</text>
                        <text>{{item.node.user.username}}</text>
                        <text>{{item.node.createdAt | dateAgo}}</text>
                    </view>
                </view>
                <view v-if="item.node.screenshot" class="right">
                    <image class="screenshot" :lazy-load="true" :src="item.node.screenshot" mode="aspectFill"></image>
                </view>
            </view>
            <view v-show="isShowLoading" class="loading-more">
                <image v-if="articles.pageInfo && articles.pageInfo.hasNextPage" class="loading-icon" src="/static/svg/Rolling-1s-200px.svg"></image>
                <text v-else>没有更多了</text>
            </view>
        </view>
    </view>
</template>

<script>
    import article from "../../apis/article";

    export default {
        data() {
          return {
              isShowLoading: false,
              articles: { // 文章
                  isShowLoading: false,
                  edges: []
              },
          }
        },
        mounted() {
            this.getHotArticles()
        },
        methods: {
            onLower(e) { // 上拉加载更多
                if (this.articles?.pageInfo?.hasNextPage) {
                    this.getHotArticles()
                }
            },
            nav2Article(node) { // 到文章详情页
                // 带查询参数，变成 /router1?plan=private
                this.$Router.push({ name: 'article-detail', params: { postId: node.originalUrl.split('/').reverse()[0] }})
            },
           async getHotArticles() {
                this.isShowLoading = true
                let params = {
                    "operationName": "",
                    "query": "",
                    "variables": {"first": 20, "after": this.articles?.pageInfo?.endCursor ?? "", "order": "POPULAR"},
                    "extensions": {"query": {"id": "21207e9ddb1de777adeaca7a2fb38030"}}
                }
                let {data} = await this.$minApi.Article.getArticles(params)
               let items = data.data.articleFeed.items

               // #ifdef MP-WEIXIN
               items.edges.forEach(n => {
                   n.node.screenshot = this.getImage(n.node.screenshot)
                   n.node.user.avatarLarge = this.getImage(n.node.user.avatarLarge)
               })
               // #endif

               if (this.articles.edges.length) {
                   this.articles.edges.push(...items.edges)
                   this.articles.pageInfo = items.pageInfo
               } else {
                   this.articles = items
               }
               this.isShowLoading = false
            }
        }
    }
</script>

<style scoped lang="scss">
    $borderColor: #efefef;
    .hot-article {
        .top {
            padding: 18rpx 16rpx;
            font-size: 28rpx;
            border-bottom: 1px solid $borderColor;

            .hot-icon {
                width: 24rpx;
                height: 24rpx;
            }
        }
        .article-list {
            .article-item {
                display: flex;
                flex-shrink: 0;
                padding: 18rpx 16rpx;
                height: 200rpx;
                border-bottom: 1px solid $borderColor;
                .left {
                    flex: 3;
                    .title {
                        font-size: 30rpx;
                        font-weight: 600;
                    }
                    .desc {
                        margin-top: 14rpx;
                        font-size: 28rpx;
                        color: #aaa;
                        > text {
                            margin-right: 10rpx;
                            &::after {
                                content: '·';
                                margin-left: 10rpx;
                            }
                            &:last-of-type::after {
                                content: none;
                            }
                        }
                    }
                }
                .right {
                    flex: 1;
                    .screenshot {
                        width: 100%;
                        height: 140rpx;
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
    }
</style>
