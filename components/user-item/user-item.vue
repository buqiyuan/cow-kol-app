<template>
    <view class="user-item">
        <view class="user-desc">
            <view class="left">
                <image class="user-avatar" :src="avatar || defaultAvatar" />
                <view class="user-desc">
                    <view class="user-flag">
                        <text class="username">
                            {{user.username}}
                        </text>
                        <user-level v-if="showLevel" :level="user.level" />
                    </view>
                    <view class="user-info">
                        <text>{{user.jobTitle}}
                            <text v-if="user.jobTitle">   @   </text>
                            {{user.company}}
                        </text>
                        <text>{{data.createdAt | dateAgo}}</text>
                    </view>
                </view>
            </view>
            <view class="right">
                <slot name="action"></slot>
            </view>
        </view>

        <view class="user-comment">
            <slot name="comment" />
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => {}
            },
            showLevel: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                defaultAvatar: '/static/svg/default_avatar.svg',
            }
        },
        computed: {
            user() {
                return this.data.user || this.data.userInfo || {}
            },
			avatar() {
				// #ifdef MP-WEIXIN
				if(!this.user.avatarLarge.includes('weserv')) {
					return this.getImage(this.user.avatarLarge)
				}
				// #endif
				return this.user.avatarLarge
			}
        }
    }
</script>

<style scoped lang="scss">
.user-item {
    width: 100%;

    .user-desc {
        width: 100%;
        display: flex;
        flex-shrink: 0;

        .left {
            flex: 5;
            display: flex;
            .user-avatar {
                width: 64rpx;
                height: 64rpx;
                border-radius: 64rpx;
                margin-right: 12rpx;
                flex-shrink: 0;
            }
            .user-desc {
                display: flex;
                flex-direction: column;
                flex: auto;
                .username {
                    font-size: 30rpx;
                    font-weight: 700;
                    line-height: 1.2;
                }
                .user-info {
                    font-size: 24rpx;
                    color: #aaa;
                    @include ellipsisMultiline(1);

                    > text {
                        margin-right: 4px;
                    }
                }
            }
        }
        .right {
            flex: 2.2;
            display: flex;
            justify-content: flex-end;
        }
    }
    .user-comment {
        padding-left: 76rpx;
    }
}
</style>

