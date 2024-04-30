<template>
	<view class="container">
		<view class="friend-info">
			<u-avatar :src="formatUrl(friend.avatar)" shape="square" size="70" style="margin-right: 40rpx;"></u-avatar>
			
			<view v-if="friend.remark" class="">
				<view class="title">{{friend.remark}}</view>
				<view class="text">{{friend.nickname}}</view>
				<view class="text">{{friend.username}}</view>
			</view>
			<view v-else class="">
				<u--text :text="friend.nickname" bold size="18" customStyle="margin-bottom: 15rpx;"></u--text>
				<u--text :text="'账号：' + friend.username" size="16" color="#999"></u--text>
			</view>
		</view>
		
		<uni-list>
			<uni-list-item showArrow title="设置备注"/>
			<uni-list-item showArrow title="朋友权限"/>
			<u-gap height="10" bgColor="#eeeeee"></u-gap>
			<uni-list-item showArrow title="朋友圈" />
			<uni-list-item showArrow title="更多信息" />
			<u-gap height="10" bgColor="#eeeeee"></u-gap>
			<uni-list-item :to="`/pages/chat/chat?id=${id}&type=1`" clickable>
				<template v-slot:body>
					<view class="send">
						<u-icon name="chat" color="#5f6690" size="28"></u-icon>
						<view style="margin-left: 14rpx;">发消息</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
			};
		},
		computed:{
			friend() {
				return this.$store.getters.getFriend(this.id) || {}
			}
		},
		onLoad({
			id
		}) {
			this.id = id
		},
		methods: {
			goChat() {
				uni.navigateTo({
					url: `/pages/chat/chat?id=${this.friendDetail.id}&type=1`
				})
			}
		}
	}
</script>

<style>
	.uni-list-item__container{
		padding: 40rpx 30rpx;
	}
</style>
<style lang="scss" scoped>
// page{
// 	background-color: #ededed;
// }
.container{
	background-color: white;
}
.friend-info{
	display: flex;
	padding: 30rpx 30rpx 60rpx 30rpx;
	
	.title{
	}
	
}
.send{
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #5f6690;
	padding: 15rpx 0;
}
</style>