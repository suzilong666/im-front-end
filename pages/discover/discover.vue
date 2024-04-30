<template>
	<view>
		<navigationHeader title="发现"></navigationHeader>
		<uni-list>
			<uni-list-item title="朋友圈" thumb="../../static/img/common/moment.png" to="/pages/moment/moment" link />
		</uni-list>
	</view>
</template>

<script>
	import navigationHeader from '@/components/navigationHeader.vue'
	export default {
		components: {
			navigationHeader
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 100rpx;
	}
</style>