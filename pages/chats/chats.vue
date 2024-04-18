<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		onLoad() {
			this.$store.dispatch('getChatList')
		}
	}
</script>

<style lang="scss">

</style>