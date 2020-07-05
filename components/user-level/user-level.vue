<template>
    <image class="user-level" :src="`/static/img/level/ic_user_lv${level}.png`"></image>
</template>

<script>
    export default {
        props: ['level']
    }
</script>

<style scoped>
    .user-level {
        width: 46rpx;
        height: 28rpx;
        margin-left: 10rpx;
    }
</style>
