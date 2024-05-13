<template>
	<view style="padding-top: 88rpx;">
		<u-navbar title="发起群聊" :autoBack="true">
			<template slot="right">
				<u-button :disabled="selectFriend.length < 2" type="success" size="mini" text="完成" @tap="createGroupChat"></u-button>
			</template>
		</u-navbar>
		<friendList :isShowCheckbox="true" @change="change"></friendList>
	</view>
</template>

<script>
	import {
		createGroupChat
	} from '@/api/api';
	import friendList from '@/components/friendList.vue'
	export default {
		components: {
			friendList
		},
		data() {
			return {
				selectFriend: []
			};
		},
		methods: {
			change(selectFriend) {
				this.selectFriend = selectFriend
			},
			async createGroupChat() {
				const {
					selectFriend
				} = this
				const { data } = await createGroupChat({ groupMembers: selectFriend })
				const { groupChatList } = this.$store.state
				groupChatList.push(data)
				this.$store.commit('set', {
					key: 'groupChatList',
					value: groupChatList
				})
				uni.redirectTo({
					url: `/pages/chat/chat?id=${data.id}&type=2`
				})
			}
		},
	}
</script>

<style lang="scss">

</style>