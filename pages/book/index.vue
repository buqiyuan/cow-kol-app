<template>
		<m-nav-bar>
			<template v-slot:title>小册</template>
			<template v-slot:right>
				<text class="iconfont icon-search"></text>
				<text class="iconfont icon-tianjia"></text>
			</template>
			<template v-slot:content>
				<top-tabbar></top-tabbar>
			</template>
		</m-nav-bar>
</template>

<script>
	import TopTabbar from './top-tabbar.vue'

	import {
		mapState,
		mapActions
	} from 'vuex'

	export default {
		components: {TopTabbar},
		data() {
			return {

			}
		},
		mounted() {
			this.$nextTick(() => {
				uni.preloadPage({url: "/pages/pins/index"})
				uni.preloadPage({url: "/pages/topic/index"})
			})
		},
		computed: {
			...mapState('user', ['userInfo'])
		},
		methods: {
			...mapActions('user', ['Login'])
		}
	}
</script>

<style lang="scss" scoped>

</style>
