<template>
	<view>
		<navigator class="user" url="/pages/info/info">
			<u-avatar :src="formatUrl(this.$store.state.userInfo.avatar)" shape="square" size="50"></u-avatar>

			<view style="margin-left: 40rpx;">
				<u--text :text="userInfo.nickname" bold size="18"></u--text>
				<u--text :text="'账号： ' + userInfo.username" size="14" color="#888" style="margin: 16rpx 0 0 0 ;"></u--text>
			</view>

			<!-- <u-icon name="arrow-right" size="15" style="margin-left: auto;"></u-icon> -->
		</navigator>

		<u-gap height="10" bgColor="#eeeeee"></u-gap>

		<uni-list>
			<uni-list-item clickable link to="/pages/info/info" title="个人信息"></uni-list-item>
			<uni-list-item clickable link to="" title="账号与安全"></uni-list-item>
			<uni-list-item clickable link :to="`/pages/moment/moment?friendId=${userInfo.id}`" title="朋友圈"></uni-list-item>
			<u-gap height="10" bgColor="#eeeeee"></u-gap>
			<uni-list-item clickable @click="logout">
				<template v-slot:body>
					<view style="width: 100%; text-align: center;">退出</view>
				</template>
			</uni-list-item>
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
			logout() {
				this.$store.commit('logout')
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
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