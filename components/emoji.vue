<template>
	<scroll-view :scroll-y="true" class="emoji-container">
		<view class="emoji-list">
			<view class="emoji-item" v-for="(item) in emojiList" @tap="change(item)">{{ item }}</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name: "emoji",
		data() {
			return {
				emojiList: ['😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😌', '😍', '😏', '😒', '😓', '😔', '😖', '😘', '😚', '😜', '😝', '😞', '😠', '😡', '😢', '😣', '😤', '😥', '😨', '😩',
					'😪', '😫', '😭', '😰', '😱', '😲', '😳', '😵', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀', '🙅', '🙆', '🙇', '🙈', '🙉', '🙊', '🙋', '🙌', '🙍', '🙎', '🙏'
				],
			};
		},
		methods: {
			change(data) {
				this.$emit('change', data)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.emoji-container {
		height: 400rpx;
		background-color: #f7f7f7;

		.emoji-list {
			display: flex;
			flex-wrap: wrap;

			.emoji-item {
				font-size: 44rpx;
				width: 93rpx;
				height: 93rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>