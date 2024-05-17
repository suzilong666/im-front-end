<template>
	<view class="container">
		<view class="friend-info">
			<u-avatar :src="formatUrl(friend.avatar)" shape="square" size="55" style="margin-right: 40rpx;"></u-avatar>

			<view v-if="friend.remark" class="">
				<view class="title">{{friend.remark}}</view>
				<view class="text">{{'昵称：' +friend.nickname}}</view>
				<view class="text">{{'账号：' + friend.username}}</view>
			</view>
			<view v-else class="">
				<view class="title">{{friend.nickname}}</view>
				<view class="text">{{'账号：' + friend.username}}</view>
			</view>
		</view>

		<uni-list>
			<template v-if="isFriend">
				<uni-list-item showArrow title="设置备注" clickable @click="$refs.inputDialog.open()" />
				<uni-list-item showArrow title="朋友圈" clickable :to="`/pages/moment/moment?friendId=${id}`" />
				<uni-list-item showArrow title="删除好友" clickable @click="isShowConfirmModal = true" />
				<!-- <uni-list-item showArrow title="朋友权限" />
				<u-gap height="10" bgColor="#eeeeee"></u-gap>
				<uni-list-item showArrow title="更多信息" /> -->
			</template>

			<u-gap height="10" bgColor="#eeeeee"></u-gap>

			<uni-list-item v-if="isFriend" :to="`/pages/chat/chat?id=${id}&type=1`" clickable>
				<template v-slot:body>
					<view class="send">
						<u-icon name="chat" color="#5f6690" size="28"></u-icon>
						<view style="margin-left: 14rpx;">发消息</view>
					</view>
				</template>
			</uni-list-item>
			<uni-list-item v-else :to="`/pages/ApplyToAddFriend/ApplyToAddFriend?id=${id}`" clickable>
				<template v-slot:body>
					<view class="send">添加到通讯录</view>
				</template>
			</uni-list-item>
		</uni-list>

		<!-- 修改名字 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="输入备注" placeholder="请输入备注" @confirm="updateRemark"></uni-popup-dialog>
		</uni-popup>

		<!-- 删除好友确认框 -->
		<u-modal :show="isShowConfirmModal" title="删除联系人" :content='`将联系人“${friend.remark || friend.nickname}”删除，将同时删除与该联系人的聊天记录`' showCancelButton confirmColor="red" :closeOnClickOverlay="true"
			@cancel="isShowConfirmModal = false" @confirm="deleteFriend" @close="isShowConfirmModal = false"></u-modal>
	</view>
</template>

<script>
	import {
		getUserInfo,
		updateFriendInfo,
		deleteFriend,
	} from '@/api/api';
	export default {
		data() {
			return {
				id: 0,
				isFriend: true,
				friend: {},
				isShowConfirmModal: false
			};
		},
		onLoad({
			id
		}) {
			this.id = id
			const friend = this.$store.getters.getFriend(this.id)
			if (friend) {
				this.friend = friend
			} else {
				this.getUserInfo()
				this.isFriend = false
			}
		},
		methods: {
			async getUserInfo() {
				const { data } = await getUserInfo({ id: this.id })
				this.friend = data
			},
			async updateRemark(remark) {
				if (!remark) return
				const { data } = await updateFriendInfo({ id: this.id, remark })
				this.friend.remark = remark
				this.$store.dispatch('getFriendList')
			},
			goChat() {
				uni.navigateTo({
					url: `/pages/chat/chat?id=${this.friendDetail.id}&type=1`
				})
			},
			async deleteFriend() {
				await deleteFriend({ id: this.id })
				this.isShowConfirmModal = false
				this.$store.dispatch('getFriendList')
				this.$store.dispatch('getChatList')
				this.$showToast('删除成功')
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/chats/chats'
					})
				}, 1000)
			}
		}
	}
</script>

<style>
	.uni-list-item__container {
		padding: 40rpx 30rpx;
	}
</style>
<style lang="scss" scoped>
	// page{
	// 	background-color: #ededed;
	// }
	.container {
		background-color: white;
	}

	.friend-info {
		display: flex;
		padding: 30rpx 30rpx 60rpx 30rpx;

		.title {
			font-weight: 600;
			font-size: 32rpx;
		}

		.text {
			font-size: 24rpx;
			color: #999;
			padding-top: 8rpx;
		}
	}

	.send {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #5f6690;
		padding: 15rpx 0;
	}
</style>