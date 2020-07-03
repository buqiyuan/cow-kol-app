<template>
	<article-detail></article-detail>
</template>

<script>
	export default {
		created() {
			console.log(this.$Route.query, '嘿嘿嘿')
		}
	}
</script>

<style>
</style>
