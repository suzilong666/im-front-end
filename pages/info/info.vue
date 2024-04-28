<template>
	<view>
		<uni-list>
			<uni-list-item clickable link @click="uploadAvatar">
				<template slot="header">
					<view class="uni-list-item__content-title" style="line-height: 80rpx;">
						头像
					</view>
				</template>
				<template slot="footer">
					<u-avatar :src="formatUrl(this.$store.state.userInfo.avatar)" shape="square"></u-avatar>
				</template>
			</uni-list-item>

			<uni-list-item title="名字" :rightText="$store.state.userInfo.nickname" clickable link
				@click="$refs.inputDialog.open()"></uni-list-item>

			<uni-list-item title="二维码名片" clickable link></uni-list-item>
		</uni-list>

		<!-- 修改名字 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="输入名字" placeholder="请输入名字"
				@confirm="updateNickname"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		upload,
		updateUserInfo
	} from '@/api/api';
	
	export default {
		data() {
			return {

			};
		},
		methods: {
			updateNickname(nickname) {
				if (!nickname) return
				updateUserInfo({
					nickname
				}).then(() => {
					this.$store.dispatch('getUserInfo')
				})
			},
			uploadAvatar() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const file = chooseImageRes.tempFilePaths[0];
						upload(file).then(({
							data
						}) => {
							updateUserInfo({
								avatar: data
							}).then(() => {
								this.$store.dispatch('getUserInfo')
							})
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>