<template>
    <view class="comment-item">
        <user-item :data="commentItem" :show-level="true">
            <template v-slot:comment>
                <view class="comment">
                    {{commentItem.content}}
                    <view v-if="commentItem.topComment && commentItem.topComment.length" class="reply-content">
                        <view v-for="replyItem in commentItem.topComment" class="reply-item">
                           <text>{{replyItem.userInfo.username}}</text>
                            <template v-if="replyItem.respComment != commentItem.id">
                                <user-level :level="replyItem.userInfo.level"></user-level>
                                <text> 回复 {{replyItem.respUserInfo.username}}</text>
                            </template>
                            <user-level :level="replyItem.userInfo.level"></user-level>：
                            <text>{{replyItem.content + '\n'}}</text>
                        </view>
                    </view>
                </view>
            </template>
            <template v-slot:action>
                <view class="actions">
                    <view class="action-item">
                        <image src="/static/svg/zan.svg"></image>
                        {{commentItem.likesCount}}
                    </view>
                    <view class="action-item">
                        <image src="/static/svg/comment.svg"></image>
                    </view>
                </view>
            </template>
        </user-item>
    </view>
</template>

<script>
    export default {
        props: {
            commentItem: {
                type: Object,
                default: () => {
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .comment-item {
        padding: 14rpx;
        border-bottom: 1px solid #efefef;
        &:last-of-type{
            border-bottom: none;
        }
        .comment {
            line-height: 1.6;
            .reply-content {
                padding: 14rpx;
                background-color: #ddd;
            }
        }
        .actions {
            display: flex;
            justify-content: space-evenly;
            .action-item {
                margin-left: 10px;
                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
        }
    }
</style>
