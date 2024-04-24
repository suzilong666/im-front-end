<template>
	<view>
		<u-list>
			<u-list-item>
				<u-cell title="新的朋友" @tap="navigateTo('/pages/newFriend/newFriend')">
					<u-avatar slot="icon" shape="square" size="35" customStyle="margin: -3px 5px -3px 0"></u-avatar>
				</u-cell>
				<u-cell title="群聊" @tap="navigateTo('/pages/newFriend/newFriend')">
					<u-avatar slot="icon" shape="square" size="35" customStyle="margin: -3px 5px -3px 0"></u-avatar>
				</u-cell>
				<u-cell v-for="item in $store.state.friendList" :title="item.nickname"
					@tap="navigateTo(`/pages/friendDetail/friendDetail?id=${item.id}`)">
					<u-avatar slot="icon" shape="square" size="35" customStyle="margin: -3px 5px -3px 0"></u-avatar>
				</u-cell>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {
			this.$store.dispatch('getFriendList')
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				});
			}
		},
	}
</script>

<style lang="scss">

</style>