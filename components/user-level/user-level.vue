<template>
    <image class="user-level" :class="[size]" v-if="level" :src="`/static/img/level/ic_user_lv${level}.png`"></image>
</template>

<script>
    export default {
        props: ['level', 'size']
    }
</script>

<style scoped lang="scss">
    .user-level {
        width: 46rpx;
        height: 28rpx;
        margin-left: 10rpx;
        &.small {
            width: 38rpx;
            height: 20rpx;
        }
    }
</style>
