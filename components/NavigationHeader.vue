<template>
	<u-navbar :title="title" leftIcon="">
		<template slot="right">
			<view class="dropdown">
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
		</template>
	</u-navbar>
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
				visible: false
			};
		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
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
</style>