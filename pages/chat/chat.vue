<template>
	<view class="container">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" :style="{height: `${scrollViewHeight}px`}" @scroll="scroll" @tap="closeBottom">
			<!-- 群通知 -->
			<u-notice-bar v-if="type == 2 && notice" :text="notice" mode="closable" class="notice"></u-notice-bar>

			<view class="chat-history-list" id="chat-history-list">
				<template v-for="(item,index) in chatHistory">
					<!-- 时间 -->
					<view v-if="index === 0 || new Date(item.create_time).getTime() - new Date(chatHistory[index-1].create_time).getTime() > 1000 * 60 * 10" class="datetime">
						{{item.create_time}}
					</view>

					<!-- 消息 -->
					<view v-if="item.is_withdraw == 0" :class="[item.sender_id == userInfo.id ? 'right' : 'left', 'item']" @longtap="onLongtap(item)">
						<u-avatar :src="formatUrl(getAvatar(item))" shape="square" size="35" @tap="toFriendDetail(item)"></u-avatar>
						<view v-if="item.type == 1" class="message">{{item.message}}</view>
						<image v-else-if="item.type == 2" :src="formatUrl(item.message)" mode="widthFix" class="image"></image>
						<video v-else-if="item.type == 3" :src="formatUrl(item.message)" class="video"></video>
					</view>

					<!-- 撤销 -->
					<view class="withdraw" v-else>
						{{item.sender_id==userInfo.id?'你':($store.getters.getNameByUid(id) || '')}}撤回了一条消息
					</view>
				</template>
			</view>
		</scroll-view>
		<view class="bottom" id="bottom">
			<view class="input-box">
				<u--textarea v-model="message" autoHeight @confirm="send" @focus="closeBottom"></u--textarea>
				<svg @tap="showEmojiList" style="width: 56rpx; height: 56rpx;" t="1716193861197" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3557"
					width="256" height="256">
					<path
						d="M933.87 505.928c10.165-233.804-172.811-426.945-406.615-437.111-81.323-5.082-162.646 20.331-233.804 60.993-15.248 10.165-20.331 25.413-10.165 40.662 5.082 10.165 25.413 15.248 35.578 10.165 66.074-40.662 137.232-60.993 208.389-55.909 203.308 5.082 360.87 177.893 350.705 381.201-5.082 203.308-177.893 360.87-381.201 350.705-198.224-5.083-360.87-177.893-350.705-381.201 0-71.158 25.413-142.315 71.158-198.224 5.082-15.248 5.082-30.496-10.165-40.662-10.165-10.165-25.413-5.082-35.578 5.083-50.827 71.158-76.239 147.397-81.323 233.804-10.165 233.804 172.811 426.945 406.615 437.111 233.804 10.165 426.945-172.811 437.111-406.614zM303.617 536.423c-15.248 5.082-20.331 20.331-15.248 35.578 35.578 96.571 127.067 157.564 228.72 157.564 101.653 0 193.142-60.993 223.639-157.563 5.082-15.247 0-30.496-15.248-35.578-15.248-5.082-30.496 5.082-35.578 15.247-25.413 76.239-96.571 127.067-172.811 127.067-81.323 0-152.481-50.828-177.893-127.067-5.082-10.165-20.331-20.331-35.578-15.247zM694.984 363.611c0-30.496-25.413-55.909-55.909-55.909s-50.828 25.413-50.828 55.909c0 30.496 20.331 50.828 50.828 50.828 30.496 0 55.909-20.331 55.909-50.828zM390.023 414.439c30.496 0 50.828-20.331 50.828-50.828s-20.331-55.909-50.828-55.909c-30.496 0-55.909 25.413-55.909 55.909 0 30.496 25.413 50.828 55.909 50.828z"
						p-id="3558" fill="#2c2c2c"></path>
				</svg>
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
		upload,
		withdraw,
		groupChatWithdraw
	} from '@/api/api';

	export default {
		data() {
			return {
				id: 0,
				type: 1,
				notice: '',
				message: '',
				scrollViewHeight: 0,
				scrollTop: 0,
				isShowFunctionList: false,
				isShowEmojiList: false,
				group: {},
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
			},
			groupChatNotice() {
				const { type, id } = this
				if (type == 1) return ''
				const group = this.$store.getters.getGroupChat(id)
				return group?.notice || ''
			}
		},
		watch: {
			chatHistoryLength() {
				this.scrollBottom()
			},
			groupChatNotice(newVal) {
				this.notice = newVal
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
				uni.$on('withdraw', this.onWithdraw)
			} else {
				// 群聊
				const group = this.$store.getters.getGroupChat(id)
				if (group) {
					uni.setNavigationBarTitle({
						title: group.name
					})
					this.group = group
				}
				this.$store.dispatch('getGroupChatHistory', id)
				this.$store.dispatch('getGroupChatMemberList', id)
				uni.$on('groupChatWithdraw', this.onWithdraw)
			}
		},
		onUnload() {
			this.read()
			this.$off(['withdraw', 'groupChatWithdraw'])
		},
		onReady() {
			this.getScrollViewHeight()
			this.scrollBottom()
		},
		onShow() {
			const { id, type } = this
			if (type == 2) {
				this.notice = ''
				const group = this.$store.getters.getGroupChat(id)
				this.$nextTick(() => {
					this.notice = group?.notice || ''
				})
			}
		},
		onNavigationBarButtonTap(e) {
			console.log(e);
			if (this.type == 1) {
				uni.navigateTo({
					url: `/pages/friendDetail/friendDetail?id=${this.id}`
				})
			} else {
				uni.navigateTo({
					url: `/pages/groupInfo/groupInfo?id=${this.id}`
				})
			}
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
			},
			onLongtap(data) {
				const { sender_id } = data
				const itemList = ['复制']
				if (sender_id == this.userInfo.id) {
					itemList.push('撤回')
				}
				uni.showActionSheet({
					itemList,
					success: ({ tapIndex }) => {
						switch (tapIndex) {
							case 0:
								this.copy(data)

								break;
							case 1:
								this.withdraw(data)
								break;
						}
					}
				});
			},
			async withdraw(data) {
				const { id } = data
				const { type } = this
				if (type == 1) {
					await withdraw({ id })
				} else {
					await groupChatWithdraw({ id })
				}
				data.is_withdraw = 1
				data.message = ''
			},
			copy({ type, message }) {
				if (type != 1) return
				uni.setClipboardData({
					data: message,
					showToast: true
				})
			},
			onWithdraw({ id }) {
				const history = this.chatHistory.find(item => item.id == id)
				if (history) {
					history.message = ''
					history.is_withdraw = 1
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.notice {
		position: fixed;
		top: 88rpx;
		left: 16rpx;
		right: 16rpx;
		z-index: 99;
	}



	.chat-history-list {
		padding: 16rpx;
		position: relative;

		.datetime {
			text-align: center;
			font-size: 26rpx;
			color: #999;
			padding: 30rpx 0;
		}

		.withdraw {
			text-align: center;
			font-size: 26rpx;
			color: #999;
			padding: 30rpx 0;
		}

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
				position: relative;
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

		.left {
			.message::after {
				content: ' ';
				position: absolute;
				left: -20rpx;
				top: 26rpx;
				width: 0;
				border-width: 10rpx;
				border-style: solid;
				border-color: transparent #fff transparent transparent;
			}
		}

		.right {
			flex-direction: row-reverse;

			.message {
				background-color: #95ec69;
				margin: 0 20rpx 0 70rpx;
			}

			.message::after {
				content: ' ';
				position: absolute;
				right: -20rpx;
				top: 26rpx;
				width: 0;
				border-width: 10rpx;
				border-style: solid;
				border-color: transparent transparent transparent #95ec69;
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
			align-items: center;
			padding: 10rpx 20rpx;
			box-sizing: border-box;

			svg {
				margin: 0 10rpx;
			}

			.u-icon {
				margin-left: 6rpx;
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