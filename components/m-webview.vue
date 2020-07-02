<template>
	<view>
		<web-view :src="url" @message="getMessage"></web-view>
	</view>
</template>

<script>
	export default {
		name: 'm-webview',
		props: {
			url: {
				type: String,
				default: ''
			},
			scriptFilePaths: {
				type: Array,
				default: () => []
			},
			cssFilePaths: {
				type: Array,
				default: () => []
			},
			styleOptions: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {

			}
		},
		mounted() {
			this.initWebviewEvent()
		},
		methods: {
			initWebviewEvent() {
				// #ifdef APP-PLUS
				// let currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
				const currentWebview = this.$mp.page.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
				const wv = currentWebview.children()[0]
				wv.setStyle({
					top: uni.getSystemInfoSync().statusBarHeight + 44,
					bottom: uni.getSystemInfoSync().statusBarHeight,
					...this.styleOptions
				})
				wv.appendJsFile('static/scripts/uni.webview.1.5.2.js')
				this.scriptFilePaths.forEach(item => wv.appendJsFile(item))
				this.cssFilePaths.forEach(item => wv.setCssFile(item))
				wv.addEventListener('loaded', () => {
					wv.setStyle({
						scalable: true
					})
					console.log(wv.getStyle())
				})
				// #endif	
			},
			getMessage(event) {
				uni.showModal({
					content: JSON.stringify(event.detail),
					showCancel: false
				});
			}
		}
	}
</script>

<style>

</style>
