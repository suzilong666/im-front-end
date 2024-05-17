<template>
	<view>
		<u-empty v-if="$store.state.groupChatList.length == 0" icon="/static/img/empty/comment.png" text="快去创建群聊吧"></u-empty>
		<u-list>
			<u-list-item>
				<navigator v-for="item in $store.state.groupChatList" :url="`/pages/chat/chat?id=${item.id}&type=2`">
					<u-cell :title="item.name">
						<u-avatar slot="icon" src="../../static/img/common/chat.png" shape="square" size="35" customStyle="margin: -3px 5px -3px 0"></u-avatar>
					</u-cell>
				</navigator>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">

</style>