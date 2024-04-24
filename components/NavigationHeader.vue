<template>
	<view class="container" @click="clickHandel">
		<view class="left"></view>

		<view class="title">{{title}}</view>

		<view class="right">
			<navigator url="/pages/initiateGroupChat/initiateGroupChat">
				<view class="dropdown">
					<u-icon name="plus-circle" size="25"></u-icon>
				</view>
			</navigator>
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
		},
		methods: {
			clickHandel() {
				console.log(1);
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 100rpx;
	}

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