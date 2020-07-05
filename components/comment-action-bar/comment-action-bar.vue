<template>
    <view :style="{ '--softinput-height': softInputHeight + 'px'}" class="comment-action-bar">
        <template v-if="!isFocus">
            <view class="bottom-item">
                <input @focus="focus" @blur="blur" :adjust-position="false" placeholder="评论千万条，友善第一条" class="input" />
            </view>
            <view class="bottom-item">
                <image src="/static/svg/zan.svg"></image>
                {{articleDetail.collectionCount || articleDetail.likedCount}}
            </view>
            <view class="bottom-item">
                <image src="/static/svg/comment.svg"></image>
                {{articleDetail.commentsCount || articleDetail.commentCount}}
            </view>
        </template>
        <template v-else>
            <view class="bottom-item">
                <image src="/static/svg/picture.svg"></image>
                <image src="/static/svg/smile.svg"></image>
            </view>
            <view class="bottom-item">
                <textarea v-model="comment" @focus="focus" @blur="blur" :auto-height="true" :focus="true" :adjust-position="false" placeholder="添加评论..." class="textarea" />
            </view>
            <view class="bottom-item">
                <image v-show="!comment" src="/static/svg/send.svg"></image>
                <image v-show="comment" src="/static/svg/send_active.svg"></image>
            </view>
        </template>
    </view>
</template>

<script>
    export default {
        props: {
            articleDetail: {
                type: Object,
                default: () => {}
            }
        },
        data() {
          return {
              isFocus: false,
              comment: '', // 评论内容
          }
        },
        methods: {
            focus(e) {
                this.isFocus = true
			},
            blur() {
                this.isFocus = false
            }
        }
    }
</script>

<style scoped lang="scss">
.comment-action-bar {
    position: fixed;
    bottom: var(--softinput-height);
    left: 0;
    right: 0;
    padding: 16rpx 0;
    display: flex;
    justify-content: space-evenly;
    border-top: 1px solid #ebebeb;
    background-color: white;

    image {
        width: 46rpx;
        height: 46rpx;
        margin-right: 10rpx;
    }

    .bottom-item {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        &:first-of-type {
            flex: 3;
        }
        .input {
            width: 400rpx;
            height: 60rpx;
            padding-left: 40rpx;
            border-radius: 50rpx;
            background-color: #ddd;
            .input-placeholder {
                /*text-align: center;*/
            }
        }
    }
}
</style>
