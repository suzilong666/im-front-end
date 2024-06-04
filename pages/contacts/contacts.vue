<template>
	<view>
		<navigationHeader title="通讯录"></navigationHeader>
		<u-list style="height: auto!important;">
			<u-list-item>
				<u-cell title="新的朋友" @tap="navigateTo('/pages/newFriend/newFriend')">
					<view slot="icon" style="position: relative;">
						<u-badge type="error" absolute :offset="[-10,-5]" max="99" :value="$store.state.contactsUnreadQuantity" style="z-index: 99;"></u-badge>
						<u-avatar src="../../static/img/common/add-friend.png" shape="square" size="35" customStyle="margin: -3px 5px -3px 0"></u-avatar>
					</view>
				</u-cell>
				<u-cell title="群聊" @tap="navigateTo('/pages/groupChat/groupChat')">
					<u-avatar src="../../static/img/common/chat.png" slot="icon" shape="square" size="35" customStyle="margin: -3px 5px -3px 0"></u-avatar>
				</u-cell>
			</u-list-item>
		</u-list>
		<friendList @clickItem="toFriendDetail"></friendList>
	</view>
</template>

<script>
	import navigationHeader from '@/components/navigationHeader.vue'
	import friendList from '@/components/friendList.vue'
	export default {
		components: {
			navigationHeader,
			friendList
		},
		data() {
			return {};
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				});
			},
			toFriendDetail({ id }) {
				uni.navigateTo({
					url: `/pages/friendDetail/friendDetail?id=${id}`
				})
			}
		},
	}
</script>

<style lang="scss">

</style>