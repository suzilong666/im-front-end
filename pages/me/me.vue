<template>
	<view>
		<navigator class="user" url="/pages/info/info">
			<u-avatar :src="formatUrl(this.$store.state.userInfo.avatar)" shape="square" size="50"></u-avatar>

			<view style="margin-left: 40rpx;">
				<u--text :text="userInfo.nickname" bold size="18"></u--text>
				<u--text :text="'账号： ' + userInfo.username" size="14" color="#888"
					style="margin: 16rpx 0 0 0 ;"></u--text>
			</view>
		</navigator>

		<u-gap height="10" bgColor="#eeeeee"></u-gap>

		<uni-list>
			<uni-list-item title="设置" to="/pages/set/set" link />
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.user {
		display: flex;
		align-items: center;
		padding: 80rpx 40rpx 40rpx 40rpx;

		.nickname {}
	}
</style>