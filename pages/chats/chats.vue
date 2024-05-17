<template>
	<view>
		<navigationHeader title="消息"></navigationHeader>

		<uni-list :border="true">
			<uni-list-chat v-for="item in $store.state.chatList" :title="item.title" :avatar="item.type == 1 ? formatUrl(item.avatar) : '../../static/img/common/chat.png'" :note="item.last_message"
				:time="item.last_message_time" :show-badge="true" :badge-text="item.unread_quantity" badgePositon="left" clickable
				@click="navigateTo(`/pages/chat/chat?id=${item.type == 1 ? item.friend_id : item.group_id}&type=${item.type}`)"></uni-list-chat>
		</uni-list>

		<u-empty v-if="$store.state.chatList.length == 0" icon="/static/img/empty/message.png" text="快去找好友聊天吧"></u-empty>
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
		computed: {
			chatsUnreadQuantity() {
				return this.$store.getters.chatsUnreadQuantity
			}
		},
		watch: {
			chatsUnreadQuantity(val) {
				console.log(val);
			}
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