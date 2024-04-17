<template>
	<view>
		{{friendDetail}}
		<button type="primary" @tap="goChat">去聊天</button>
	</view>
</template>

<script>
	import {
		getFriendDetail
	} from '@/api/api';
	export default {
		data() {
			return {
				friendDetail: {},
			};
		},
		onLoad({
			id
		}) {
			this.getFriendDetail(id)
		},
		methods: {
			getFriendDetail(id) {
				getFriendDetail({
					id
				}).then(({
					data
				}) => {
					this.friendDetail = data
				})
			},
			goChat() {
				uni.navigateTo({
					url: `/pages/chat/chat?id=${this.friendDetail.id}`
				})
			}
		}
	}
</script>

<style lang="scss">

</style>