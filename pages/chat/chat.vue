<template>
	<view class="container">
		<view class="chat-history-list">
			<view class="item" :class="[item.sender_id==userInfo.id?'right':'left']" v-for="item in chatHistory"
				:key="item.id">
				{{item.sender_id}}:{{item.message}}
			</view>
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
					type
				} = this
				const chat = this.$store.state.chatList.find(item => type == 1 ? item.friend_id : item.group_id == id)
				if (chat && Array.isArray(chat.history)) return chat.history
				return []
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
				const friend = this.$store.getters.getFriendById(id)
				if (friend) {
					uni.setNavigationBarTitle({
						title: friend.nickname || friend.username
					})
				}
				this.$store.dispatch('getChatHistory', id)
			} else {
				// 群聊
				const group = this.$store.getters.getGroupChatById(id)
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
					}) => {})
				} else {
					sendToGroup({
						group_id: id,
						message
					}).then(({
						data
					}) => {})
				}

				this.message = ''
			}
		}
	}
</script>

<style lang="scss">
	.chat-history-list {

		.right {
			text-align: right;
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