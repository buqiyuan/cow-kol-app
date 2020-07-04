<template>
    <view class="comment-action-bar">
        <view class="bottom-item">
            <image src="/static/svg/zan.svg"></image>
            {{articleDetail.collectionCount}}
        </view>
        <view class="bottom-item">
            <image src="/static/svg/comment.svg"></image>
            {{articleDetail.commentsCount}}
        </view>
        <view class="bottom-item">
            <image src="/static/svg/star.svg"></image>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            articleDetail: {
                type: Object,
                default: () => {}
            }
        }
    }
</script>

<style scoped lang="scss">
.comment-action-bar {
    position: fixed;
    bottom: 0;
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
    }

    .bottom-item {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        &:not(:last-of-type)::after {
            position: absolute;
            right: 0;
            content: '';
            width: 2rpx;
            height: 80%;
            background-color: #ebebeb;
        }
    }
}
</style>
