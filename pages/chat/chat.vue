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
		getChatHistory
	} from '@/api/api';

	export default {
		data() {
			return {
				id: undefined,
				message: '',
				chatHistory: []
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		onLoad({
			id
		}) {
			this.id = id
			this.getChatHistory()
		},
		methods: {
			getChatHistory() {
				getChatHistory({
					id: this.id
				}).then(({
					data
				}) => {
					this.$set(this, 'chatHistory', data)
					this.$forceUpdate()
				})
			},
			send() {
				const {
					id,
					message
				} = this
				send({
					receiver_id: id,
					message
				}).then(() => {
					getChatHistory();
				})
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