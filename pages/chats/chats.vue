<template>
	<view>
		<navigationHeader title="消息"></navigationHeader>

		<uni-list :border="true">
			<uni-list-chat v-for="item in $store.state.chatList" :title="item.title" :avatar="formatUrl(item.avatar)"
				:note="item.last_message" :time="item.last_message_time" clickable
				@click="navigateTo(`/pages/chat/chat?id=${item.type == 1 ? item.friend_id : item.group_id}&type=${item.type}`)"></uni-list-chat>
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
		},
		onShow() {
			this.$store.dispatch('getChatList')
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 100rpx;
	}
</style>