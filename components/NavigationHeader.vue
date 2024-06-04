<template>
	<view class="">
		<view :style="{height: `${statusBarHeight}px`}"></view>
		<view class="navigation-header">
			<view class="navigation-header-fixed f-b-c" :style="{top: `${statusBarHeight}px`}">
				<view class="left"></view>
				<view class="center">{{title}}</view>
				<view class="right dropdown">
					<u-icon name="plus-circle" size="25" @tap="visible = true"></u-icon>

					<view v-if="visible" class="menu-container" @tap="visible = false">
						<view class="menu">
							<navigator url="/pages/initiateGroupChat/initiateGroupChat" class="item f--c">
								<u-icon name="chat-fill" color="#fff" size="25"></u-icon>
								<text>发起群聊</text>
							</navigator>
							<navigator url="/pages/newFriend/newFriend" class="item f--c">
								<u-icon name="man-add-fill" color="#fff" size="25"></u-icon>
								<text>添加好友</text>
							</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "NavigationHeader",
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				visible: false,
				statusBarHeight: 0
			};
		},
		mounted() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
	.navigation-header {
		height: 88rpx;

		.navigation-header-fixed {
			height: 88rpx;
			width: 100vw;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;

			.left,
			.right {
				width: 88rpx;
			}

			.dropdown {
				position: relative;

				.menu-container {
					position: fixed;
					top: 0;
					left: 0;
					width: 100vw;
					height: 100vw;

					.menu {
						position: absolute;
						top: 100rpx;
						right: 20rpx;
						background-color: #4c4c4c;
						border-radius: 8rpx;
						color: #fff;
						font-size: 26rpx;

						.item {
							.u-icon {
								margin: 0 30rpx;
							}

							text {
								padding: 30rpx 60rpx 30rpx 0rpx;
								border-bottom: solid 1px #636363;
							}
						}

						.item:last-child>text {
							border: none;
						}
					}

					.menu::after {
						content: ' ';
						position: absolute;
						top: -20rpx;
						right: 20rpx;
						width: 0;
						border-width: 10rpx;
						border-style: solid;
						border-color: transparent transparent #4c4c4c transparent;
					}
				}
			}
		}
	}
</style>