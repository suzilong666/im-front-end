<template>
	<view>
		<uni-list>
			<uni-list-item :show-extra-icon="true" title="新的朋友" to="/pages/newFriend/newFriend" />
			<uni-list-item :show-extra-icon="true" title="群聊" to="/pages/newFriend/newFriend" />
		</uni-list>
		
		<uni-list>
			<uni-list-item v-for="item in $store.state.friendList" :show-extra-icon="true" :title="item.nickname"
				:to="`/pages/friendDetail/friendDetail?id=${item.id}`" />
		</uni-list>
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
	}
</script>

<style lang="scss">

</style>