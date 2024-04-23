<template>
	<view class="container">
		<view class="left"></view>

		<view class="title">{{title}}</view>

		<view class="right">
			<view class="dropdown">
				<u-icon name="plus-circle" size="25"></u-icon>
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

			};
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;

		width: 100vw;
		height: 100rpx;
		background-color: #e2eade;

		display: flex;
		justify-content: space-between;
		align-items: center;

		.right {
			display: flex;
			justify-content: center;
			align-items: center;

			.dropdown {
				position: relative;

				.menu {
					z-index: 99;
					position: absolute;

				}
			}
		}
	}
</style>