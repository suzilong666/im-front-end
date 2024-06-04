<template>
	<view>
		<view class="member-list f">
			<view class="item" v-for="item in memberList">
				<u-avatar :src="formatUrl(item.avatar)" shape="square" size="40" @tap="toFriendDetail(item)"></u-avatar>
				<view class="nickname">{{item.nickname}}</view>
			</view>

			<view class="action f-c-c">
				<u-icon name="plus" labelColor="#999"></u-icon>
			</view>
			<view class="action f-c-c">
				<u-icon name="minus" labelColor="#999"></u-icon>
			</view>
		</view>

		<uni-list>
			<uni-list-item title="群聊名称" :rightText="this.group.name" clickable link @click="$refs.inputDialog.open()"></uni-list-item>
			<uni-list-item title="群公告" :rightText="this.group.notice" clickable link @click="$refs.noticeDialog.open()"></uni-list-item>

			<uni-list-item clickable @click="exitGroupChat">
				<template v-slot:body>
					<view style="width: 100%; text-align: center;">退出群聊</view>
				</template>
			</uni-list-item>
		</uni-list>

		<!-- 修改名字 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="修改群聊名称" placeholder="请输入名称" @confirm="updateGroupName"></uni-popup-dialog>
		</uni-popup>

		<!-- 群通知 -->
		<uni-popup ref="noticeDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="群通知" placeholder="请输入群通知" @confirm="setGroupChatNotice"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		updateGroupChat,
		setGroupChatNotice
	} from '@/api/api';
	export default {
		data() {
			return {
				id: 0,
				group: {},
				memberList: [],
			};
		},
		onLoad({ id }) {
			this.id = id
			this.group = this.$store.getters.getGroupChat(id)
			this.memberList = this.$store.getters.getGroupChatMemberList(id)

			uni.setNavigationBarTitle({
				title: `群聊信息(${this.memberList.length})`
			})
		},
		methods: {
			toFriendDetail({ sender_id }) {
				if (sender_id == this.userInfo.id) return
				uni.navigateTo({
					url: `/pages/friendDetail/friendDetail?id=${sender_id}`
				})
			},
			async updateGroupName(name) {
				if (!name) return
				const { id } = this
				await updateGroupChat({ id, name })
				this.group.name = name
				const { groupChatList } = this.$store.state
				const group = groupChatList.find(item => item.id == id)
				group.name = name
				this.$store.commit('set', {
					key: 'groupChatList',
					value: groupChatList
				})
			},
			async setGroupChatNotice(notice) {
				if (!notice) return
				const { id } = this
				await setGroupChatNotice({ id, notice })
				this.group.notice = notice
				const { groupChatList } = this.$store.state
				const group = groupChatList.find(item => item.id == id)
				group.notice = notice
				this.$store.commit('set', {
					key: 'groupChatList',
					value: groupChatList
				})
			},
			exitGroupChat() {}
		}
	}
</script>

<style lang="scss">
	.member-list {
		padding: 20rpx;

		.item {
			padding: 20rpx;
			text-align: center;
			font-size: 24rpx;
			color: #999;

			.nickname {
				padding-top: 8rpx;
			}
		}

		.action {
			width: 80rpx;
			height: 80rpx;
			border: #999 1px dashed;
			border-radius: 8rpx;
			margin: 20rpx;
		}
	}
</style>