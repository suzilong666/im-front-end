<template>
	<view class="container">
		<u-navbar title="" :autoBack="true" fixed style="height: 100rpx;">
			<u-button slot="right" type="success" text="发布" size="mini" style="height: 52rpx;" @click="post"></u-button>
		</u-navbar>

		<u--textarea v-model="text" placeholder="这一刻的想法..." border="none"></u--textarea>

		<view class="file-list">
			<view v-if="video" class="video">
				<video :src="formatUrl(video)" style="width: 100%;"></video>
				<u-icon class="icon" name="trash" size="40" color="#fff" @click="video = ''"></u-icon>
			</view>
			<view v-for="(item,index) in image" class="image-box">
				<image :src="formatUrl(item)" mode="" class="image"></image>
				<u-icon class="icon" name="trash" size="25" color="#fff" @click="image.splice(index, 1)"></u-icon>
			</view>

			<view v-if="!video && image.length < 9" class="plus" @tap="upload">
				<u-icon name="plus" size="30"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		upload,
		batchUpload,
		postMoment
	} from '@/api/api';
	export default {
		data() {
			return {
				text: '',
				image: [],
				video: '',
			};
		},
		methods: {
			upload() {
				if (this.image.length > 0) return this.updateImage()
				uni.showActionSheet({
					itemList: ['图片', '视频'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								this.updateImage()
								break;
							case 1:
								this.updateVideo()
								break;
							default:
								break;
						}
					}
				});
			},
			updateImage() {
				uni.chooseImage({
					count: 9 - this.image.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: ({ tempFilePaths }) => {
						batchUpload(tempFilePaths).then((urlList) => {
							this.image = this.image.concat(urlList)
						})
					}
				});
			},
			updateVideo() {
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: ({ tempFilePath }) => {
						upload(tempFilePath).then(({ data }) => {
							this.video = data
						})
					}
				});
			},
			post() {
				const { text, image, video } = this
				if (!text && image.length == 0 && !video) return
				postMoment({ content: JSON.stringify({ text, image, video }) }).then(() => {
					uni.navigateBack()
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0 30rpx;

		.file-list {
			display: flex;
			flex-wrap: wrap;

			.video {
				width: 100%;
				position: relative;

				.icon {
					position: absolute;
					right: 0;
					top: 0;
					z-index: 99;
					background-color: #ffffff70;
					border-radius: 8rpx;
				}
			}

			.image-box {
				width: 28vw;
				height: 28vw;
				margin: 0 6rpx 6rpx 0;
				position: relative;

				.image {
					width: 100%;
					height: 100%;
				}

				.icon {
					position: absolute;
					right: 0;
					top: 0;
					z-index: 99;
					background-color: #ffffff70;
					border-radius: 8rpx;
				}
			}



			.plus {
				width: 28vw;
				height: 28vw;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				background-color: #f7f7f7;
			}
		}
	}
</style>