<template>
	<view>
		<navigationHeader title="消息"></navigationHeader>

		<view class="list">
			<view class="item" v-for="item in $store.state.chatList" :key="item.id" :style="{backgroundColor: item.top ? '#ededed' : ''}"
				@click="navigateTo(`/pages/chat/chat?id=${item.type == 1 ? item.friend_id : item.group_id}&type=${item.type}`)" @longtap="onLongtap(item)">
				<view style="position: relative;">
					<u-avatar :src="item.type == 1 ? formatUrl(item.avatar) : '../../static/img/common/chat.png'" shape="square" size="45"></u-avatar>
					<u-badge absolute :offset="[-5, 5]" type="error" max="99" :value="item.unread_quantity"></u-badge>
				</view>
				<view class="">
					<view class="title">{{item.title}}</view>
					<view class="last-message">{{item.last_message}}</view>
				</view>
				<view class="date">{{item.last_message_time}}</view>
			</view>
		</view>

		<u-empty v-if="$store.state.chatList.length == 0" icon="/static/img/empty/message.png" text="快去找好友聊天吧"></u-empty>
	</view>
</template>

<script>
	import navigationHeader from '@/components/navigationHeader.vue'
	import {
		topping,
		deleteChat
	} from '@/api/api';
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
			},
			onLongtap(data) {
				const topText = data.top == 0 ? '置顶' : '取消置顶'
				uni.showActionSheet({
					itemList: [topText, '删除'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								this.topping(data)
								break;
							case 1:
								this.deleteChat(data)
								break;
							default:
								break;
						}
					}
				});
			},
			async topping(data) {
				await topping({ id: data.id })
				this.$store.dispatch('getChatList')
			},
			async deleteChat(data) {
				await deleteChat({ id: data.id })
				this.$store.dispatch('getChatList')
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 100rpx;
	}

	.list {
		.item {
			padding: 20rpx 30rpx;
			display: flex;
			color: #999;
			font-size: 24rpx;
			border-bottom: #f4f4f5 solid 1rpx;

			.u-avatar {
				margin-right: 20rpx;
			}

			.title {
				font-size: 32rpx;
				color: #3b4144;
			}

			.last-message {
				line-height: 2;
			}

			.date {
				margin-left: auto;

			}
		}
	}
</style>