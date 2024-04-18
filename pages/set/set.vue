<template>
	<view>
		<button type="button" @tap="logout">退出</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			logout() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">

</style>