<template>
	<view>
		<uni-list>
			<uni-list-item title="头像" clickable @click="uploadAvatar">
				<template slot="header">
					<image :src="this.$store.state.userInfo.avatar" style="width: 50px;height: 50px;"></image>
				</template>
			</uni-list-item>
		</uni-list>
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
			uploadAvatar() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const file = chooseImageRes.tempFilePaths[0];
						upload(file).then(({
							data
						}) => {
							const {
								url,
								fullUrl
							} = data
							console.log(data);
							updateUserInfo({
								avatar: url
							}).then(() => {
								// this.$store.commit('set', {
								// 	key: 'userInfo',
								// 	value: {
								// 		...this.$store.state.userInfo,
								// 		avatar: fullUrl
								// 	}
								// })
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