<template>
	<view>
		<m-webview :url="tabaoUrl" :scriptFilePaths="scriptFilePaths" :cssFilePaths="cssFilePaths" />
	</view>
</template>

<script>
	import MWebview from '@/components/m-webview.vue'
	export default {
		components: {
			MWebview,
		},
		data() {
			return {
				tabaoUrl: 'https://login.taobao.com/member/login.jhtml?sub=true&style=miniall&newMini2=true&full_redirect=true&css_style=we&minipara=1,1,1&redirectURL=http%3A%2F%2Fwe.taobao.com%2F',
				cssFilePaths: ['static/scripts/preload.css'],
				scriptFilePaths: ['static/scripts/preload.js']
			}
		},
	}
</script>

<style>
</style>
