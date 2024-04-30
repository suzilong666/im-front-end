<template>
	<view>
		<u-navbar title="" :autoBack="true" fixed rightIcon="camera-fill" bgColor="transparent" @rightClick="postMoment"></u-navbar>
		<view class="top">
			<image src="../../static/img/common/moment.jpg" mode="aspectFill"></image>

			<view class="avatar">
				<view class="nickname">{{$store.state.userInfo.nickname}}</view>
				<u-avatar :src="formatUrl(this.$store.state.userInfo.avatar)" shape="square" size="60"></u-avatar>
			</view>
		</view>
		<view class="comment-list">
			<view v-for="item in momentList" class="item">
				<u-avatar :src="formatUrl(item.avatar)" shape="square" size="40"></u-avatar>

				<view class="content">
					<view class="name">{{item.name}}</view>
					<view v-if="item.content.text" class="text">{{item.content.text}}</view>
					<u-album v-if="item.content.image.length > 0" :urls="item.content.image.map(item => formatUrl(item))" rowCount="3" multipleSize="24.5vw" style="padding: 12rpx 0;"></u-album>
					<video v-if="item.content.video" :src="formatUrl(item.content.video)" class="video"></video>

					<view class="bottom">
						<view class="">{{item.create_time}}</view>
						<view class="icon" @tap="showPopup(item)">
							<view class="popup" v-if="item.isShowPopup">
								<view class="left">
									<u-icon name="heart" color="#fff"></u-icon>
									<view class="">赞</view>
								</view>
								<view class="right">
									<u-icon name="chat" color="#fff"></u-icon>
									<view class="">评论</view>
								</view>

							</view>
							<u-icon name="more-dot-fill"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMomentList
	} from '@/api/api';
	export default {
		data() {
			return {
				momentList: [],
				total: 0,
				page: 1,
			};
		},
		onShow() {
			this.getMomentList()
		},
		onPageScroll() {
			this.momentList.forEach(item => {
				this.$set(item, 'isShowPopup', false)
			})
		},
		methods: {
			showPopup(item) {
				this.$set(item, 'isShowPopup', !item.isShowPopup)
			},
			async getMomentList() {
				const { data } = await getMomentList({ page: this.page })
				this.total = data.total
				this.momentList = data.data.map(item => {
					const { content, uid } = item
					try {
						item.content = JSON.parse(content)
					} catch (e) {
						console.error(e)
					}
					if (uid == this.$store.state.userInfo.id) {
						item.name = this.$store.state.userInfo.nickname
						item.avatar = this.$store.state.userInfo.avatar
					} else {
						const friend = this.$store.getters.getFriend(uid)
						item.name = friend ? (friend.remark || friend.nickname) : ''
						item.avatar = friend ? friend.avatar : ''
					}
					return item
				})
			},
			postMoment() {
				uni.navigateTo({
					url: '/pages/postMoment/postMoment'
				})
			}
		}
	}
</script>

<style lang="scss">
	.top {
		width: 100vw;
		height: 70vw;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.avatar {
			display: flex;
			position: absolute;
			right: 30rpx;
			bottom: -60rpx;

			.nickname {
				color: #fff;
				font-size: 36rpx;
				font-weight: 500;
				padding-right: 20rpx;
			}
		}
	}

	.comment-list {
		padding: 100rpx 0 0 0;

		.item {
			display: flex;
			padding: 30rpx;
			border-bottom: 2rpx solid #99999930;

			.content {
				flex: 1;
				padding-left: 20rpx;

				.name {
					color: #4e5390;
				}

				.text {}

				.video {
					width: 100%;
					margin-top: 15rpx;
					border-radius: 8rpx;
				}

				.bottom {
					display: flex;
					justify-content: space-between;
					font-size: 24rpx;
					color: #999999;
					padding-top: 20rpx;

					.icon {
						background-color: #00000010;
						padding: 0rpx 10rpx;
						border-radius: 8rpx;
						position: relative;

						.popup {
							width: 260rpx;
							height: 60rpx;
							position: absolute;
							top: -12rpx;
							left: -270rpx;
							display: flex;

							white-space: nowrap;
							background-color: #4c4c4c;
							border-radius: 8rpx;
							color: #fff;

							.left,
							.right {
								width: 50%;
								height: 100%;
								display: flex;
								justify-content: center;
								align-items: center;

								.u-icon {
									margin-right: 10rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>