<template>
	<view>
		<uni-list :border="true">
			<uni-list-chat v-for="item in $store.state.chatList" :title="item.nickname" :avatar="item.avatar"
				:note="item.last_message" :time="item.last_message_time"
				:to="`/pages/chat/chat?id=${item.friend_id}`"></uni-list-chat>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		onShow() {
			this.$store.dispatch('getChatList')
		}
	}
</script>

<style lang="scss">

</style>