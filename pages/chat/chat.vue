<template>
	<view class="container">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" :style="{height: `${scrollViewHeight}px`}" @scroll="scroll" @tap="closeBottom">
			<view class="chat-history-list" id="chat-history-list">
				<view v-for="item in chatHistory" :class="[item.sender_id == userInfo.id ? 'right' : '', 'item']">
					<u-avatar :src="formatUrl(getAvatar(item))" shape="square" size="35" @tap="toFriendDetail(item)"></u-avatar>
					<view v-if="item.type == 1" class="message">
						{{item.message}}
					</view>
					<image v-else-if="item.type == 2" :src="formatUrl(item.message)" mode="widthFix" class="image"></image>
					<video v-else-if="item.type == 3" :src="formatUrl(item.message)" class="video"></video>
				</view>
			</view>
		</scroll-view>

		<view class="bottom" id="bottom">
			<view class="input-box">
				<u--textarea v-model="message" autoHeight @confirm="send" @focus="closeBottom"></u--textarea>
				<u-icon name="plus-circle" color="#000" size="28" @tap="showEmojiList"></u-icon>
				<u-icon name="plus-circle" color="#000" size="28" @tap="showFunctionList"></u-icon>
			</view>

			<scroll-view v-if="isShowEmojiList" :scroll-y="true" class="emoji-container">
				<view class="emoji-list">
					<view class="emoji-item" v-for="(item) in emojiList" @tap="message+=item">{{ item }}</view>
				</view>
			</scroll-view>

			<view v-if="isShowFunctionList" class="function-list">
				<view class="item" @tap="sendImage">
					<view class="icon-box">
						<u-icon name="photo-fill" color="#000" size="40"></u-icon>
					</view>
					<view class="text">相册</view>
				</view>
				<view class="item" @tap="sendVideo">
					<view class="icon-box">
						<u-icon name="photo-fill" color="#000" size="40"></u-icon>
					</view>
					<view class="text">视频</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		send,
		read,
		sendToGroup,
		getChatHistory,
		upload
	} from '@/api/api';

	export default {
		data() {
			return {
				id: 0,
				type: 1,
				message: '',
				scrollViewHeight: 0,
				scrollTop: 0,
				isShowFunctionList: false,
				isShowEmojiList: false,
				emojiList: ['😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😌', '😍', '😏', '😒', '😓', '😔', '😖', '😘', '😚', '😜', '😝', '😞', '😠', '😡', '😢', '😣', '😤', '😥', '😨', '😩',
					'😪', '😫', '😭', '😰', '😱', '😲', '😳', '😵', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀', '🙅', '🙆', '🙇', '🙈', '🙉', '🙊', '🙋', '🙌', '🙍', '🙎', '🙏'
				],
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			groupChatMemberList() {
				return this.type == 2 ? this.$store.getters.getGroupChatMemberList(this.id) : []
			},
			chatHistory() {
				const {
					id,
					type
				} = this
				return type == 1 ? this.$store.getters.getFriendHistory(id) : this.$store.getters.getGroupChatHistory(id)
			},
			chatHistoryLength() {
				return this.chatHistory.length
			}
		},
		watch: {
			chatHistoryLength() {
				this.scrollBottom()
			}
		},
		onLoad({
			id,
			type
		}) {
			this.id = id
			this.type = type
			this.read()
			if (type == 1) {
				// 私聊
				uni.setNavigationBarTitle({
					title: this.$store.getters.getNameByUid(id)
				})
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
				this.$store.dispatch('getGroupChatMemberList', id)
			}
		},
		onUnload() {
			this.read()
		},
		onReady() {
			this.getScrollViewHeight()
			this.scrollBottom()
		},
		methods: {
			async read() {
				if (this.type == 1) {
					await read({ friend_id: this.id })
					const { chatList } = this.$store.state
					const chat = chatList.find(item => item.friend_id == this.id)
					if (chat) chat.unread_quantity = 0
					this.$store.commit('set', {
						key: 'chatList',
						value: chatList
					})
				}
			},
			scroll(e) {
				// this.isShowEmojiList = false
				// this.isShowFunctionList = false
			},
			closeBottom() {
				this.isShowEmojiList = false
				this.isShowFunctionList = false
				this.getScrollViewHeight()
			},
			showFunctionList() {
				this.isShowFunctionList = !this.isShowFunctionList
				this.isShowEmojiList = false
				this.getScrollViewHeight()
				this.scrollBottom()
			},
			showEmojiList() {
				this.isShowEmojiList = !this.isShowEmojiList
				this.isShowFunctionList = false
				this.getScrollViewHeight()
				this.scrollBottom()
			},
			scrollBottom() {
				this.$nextTick(() => {
					uni.createSelectorQuery().select("#chat-history-list").boundingClientRect(({ height }) => {
						if (this.scrollTop == height) return this.scrollTop = height - 1
						this.scrollTop = height
					}).exec();
				})
			},
			getScrollViewHeight() {
				this.$nextTick(() => {
					uni.createSelectorQuery().select("#bottom").boundingClientRect(({ height }) => {
						const { windowHeight } = uni.getSystemInfoSync()
						this.scrollViewHeight = windowHeight - height
					}).exec();
				})
			},
			send(message, messageType = 1) {
				message = message || this.message
				if (message == '') return
				if (this.type == 1) {
					send({
						receiver_id: this.id,
						message,
						type: messageType
					}).then(({
						data
					}) => {
						this.$store.dispatch('updateMessage', data)
					})
				} else {
					sendToGroup({
						group_id: this.id,
						message,
						type: messageType
					}).then(({
						data
					}) => {})
				}

				this.message = ''
			},
			sendImage() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const file = chooseImageRes.tempFilePaths[0];
						upload(file).then(({
							data
						}) => {
							this.send(data, 2)
						})
					}
				});
			},
			sendVideo() {
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: (res) => {
						upload(res.tempFilePath).then(({
							data
						}) => {
							this.send(data, 3)
						})
					}
				});
			},
			getAvatar({
				sender_id
			}) {
				const { id, avatar } = this.userInfo
				if (sender_id == id) return avatar
				if (this.type == 1) {
					return this.$store.getters.getFriend(this.id)?.avatar || ''
				} else {
					const { groupChatMemberList } = this
					const user = groupChatMemberList.find(item => item.id == sender_id)
					return user ? user.avatar : ''
				}
			},
			toFriendDetail({ sender_id }) {
				if (sender_id == this.userInfo.id) return
				uni.navigateTo({
					url: `/pages/friendDetail/friendDetail?id=${sender_id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.chat-history-list {
		padding: 16rpx;

		.item {
			display: flex;
			margin-bottom: 16rpx;

			.message {
				max-width: calc(100% - 200rpx);
				padding: 18rpx 20rpx;
				border-radius: 8rpx;
				background-color: #fff;
				margin: 0 70rpx 0 20rpx;
				font-size: 28rpx;
				letter-spacing: 2rpx;
				word-wrap: break-word;
			}

			.image {
				margin: 0 20rpx;
				width: 30vw;
				border-radius: 8rpx;
			}

			.video {
				margin: 0 20rpx;
				width: 50vw;
				height: 50vw;
				border-radius: 8rpx;
			}

		}

		.item:last-child {
			margin-bottom: 0rpx;
		}

		.right {
			flex-direction: row-reverse;

			.message {
				background-color: #95ec69;
				margin: 0 20rpx 0 70rpx;
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		width: 100vw;


		.input-box {
			background-color: #f7f7f7;
			display: flex;
			padding: 10rpx 20rpx;
			box-sizing: border-box;

			.u-icon {
				margin-left: 10rpx;
			}

			.u-textarea {
				flex: 1;
				border: none !important;
			}
		}

		.emoji-container {
			height: 400rpx;

			.emoji-list {
				display: flex;
				flex-wrap: wrap;

				.emoji-item {
					font-size: 44rpx;
					width: 93rpx;
					height: 93rpx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
				}
			}
		}

		.function-list {
			display: flex;
			flex-wrap: wrap;
			padding: 40rpx;
			background-color: #f7f7f7;

			.item {
				width: 25%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.icon-box {
					width: 120rpx;
					height: 120rpx;
					background-color: white;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.text {
					font-size: 24rpx;
					text-align: center;
					color: #6b6b6b;
					padding: 4rpx;
				}
			}
		}

	}
</style>