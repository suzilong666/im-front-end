<template>
	<view class="container">
		<view class="chat-history-list">
			<template v-for="item in chatHistory">
				<view v-if="item.sender_id==userInfo.id" class="item right">
					<u-avatar :src="$store.state.userInfo.avatar" shape="square" size="30"></u-avatar>
					<view class="">
						{{item.message}}
					</view>
				</view>
				<view v-else class="item">
					{{item.sender_id}}:{{item.message}}
				</view>
			</template>
		</view>
		<view class="bottom">
			<input v-model="message" />
			<button size="mini" @tap="send()">发送</button>
		</view>
	</view>
</template>

<script>
	import {
		send,
		sendToGroup,
		getChatHistory
	} from '@/api/api';

	export default {
		data() {
			return {
				id: 0,
				type: 1,
				message: '',
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			chatHistory() {
				const {
					id,
					type = 1
				} = this
				const {
					getFriendHistory,
					getGroupChatHistory
				} = this.$store.getters
				return type == 1 ? getFriendHistory(id) : getGroupChatHistory(id)
			}
		},
		onLoad({
			id,
			type
		}) {
			this.id = id
			this.type = type

			if (type == 1) {
				// 私聊
				const friend = this.$store.getters.getFriend(id)
				if (friend) {
					uni.setNavigationBarTitle({
						title: friend.nickname || friend.username
					})
				}
				this.$store.dispatch('getChatHistory', id)
			} else {
				// 群聊
				const group = this.$store.getters.getGroupChat(id)
				if (group) {
					uni.setNavigationBarTitle({
						title: group.name
					})
				}
				this.$store.dispatch('getGroupChatHistory', id)
			}
		},
		methods: {
			send() {
				const {
					id,
					type,
					message
				} = this
				if (type == 1) {
					send({
						receiver_id: id,
						message
					}).then(({
						data
					}) => {
						this.$store.dispatch('updateMessage', data)
					})
				} else {
					sendToGroup({
						group_id: id,
						message
					}).then(({
						data
					}) => {
						// this.$store.dispatch('updateGroupMessage', data)
					})
				}

				this.message = ''
			}
		}
	}
</script>

<style lang="scss">
	.chat-history-list {
		padding: 0 16rpx;
		
		.item {
			display: flex;
		}

		.right {
			flex-direction: row-reverse;

		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 50px;
		background-color: #efeff4;

		display: flex;
		align-items: center;
	}
</style>