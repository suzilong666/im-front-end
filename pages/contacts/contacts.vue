<template>
	<view>
		<uni-list>
			<uni-list-item :show-extra-icon="true" title="新的朋友" to="/pages/newFriend/newFriend" />
			<uni-list-item v-for="item in friendList" :show-extra-icon="true" :title="item.nickname"
				:to="`/pages/friendDetail/friendDetail?id=${item.id}`" />
		</uni-list>
	</view>
</template>

<script>
	import {
		getFriendList
	} from '@/api/api';
	export default {
		data() {
			return {
				friendList: [],
			};
		},
		onLoad() {
			this.getFriendList()
		},
		methods: {
			getFriendList() {
				getFriendList().then(({
					data
				}) => {
					this.friendList = data
				})
			},
		}
	}
</script>

<style lang="scss">

</style>