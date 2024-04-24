<template>
	<view>
		<friendList @change="change"></friendList>

		<view class="bottom">
			<u-button size="mini" text="完成" @click="createGroupChat"></u-button>
		</view>
	</view>
</template>

<script>
	import {
		createGroupChat
	} from '@/api/api';
	import friendList from '@/components/friendList.vue'
	export default {
		components: {
			friendList
		},
		data() {
			return {
				selectFriend: []
			};
		},
		methods: {
			change(selectFriend) {
				this.selectFriend = selectFriend
			},
			createGroupChat() {
				const {
					selectFriend
				} = this
				createGroupChat({
					groupMembers: selectFriend
				}).then(({
					data
				}) => {
					
				})
			}
		},
	}
</script>

<style lang="scss">

</style>