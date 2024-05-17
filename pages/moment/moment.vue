<template>
	<view>
		<u-navbar title="" :autoBack="true" fixed :rightIcon="(friendId && friendId!=$store.state.userInfo.id) ? '' : 'camera-fill'" bgColor="transparent" @rightClick="postMoment"></u-navbar>
		<view class="top">
			<image src="../../static/img/common/moment.jpg" mode="aspectFill"></image>

			<view class="avatar">
				<view class="nickname">{{nickname}}</view>
				<u-avatar :src="formatUrl(avatar)" shape="square" size="60"></u-avatar>
			</view>
		</view>
		<view class="moment-list">
			<view v-for="item in momentList" class="item">
				<u-avatar :src="formatUrl(item.avatar)" shape="square" size="40"></u-avatar>

				<view class="content">
					<view class="name">{{item.name}}</view>
					<view v-if="item.content.text" class="text">{{item.content.text}}</view>
					<u-album v-if="item.content.image.length > 0" :urls="item.content.image.map(item => formatUrl(item))" rowCount="3" multipleSize="24.5vw" style="padding: 12rpx 0;"></u-album>
					<video v-if="item.content.video" :src="formatUrl(item.content.video)" class="video"></video>
					<view class="bottom">
						<view class="">{{item.create_time}}</view>
						<view class="icon">
							<u-icon name="more-dot-fill" @tap="showPopup(item)"></u-icon>
							<view class="popup" v-if="item.isShowPopup">
								<view class="left" @tap="like(item)">
									<u-icon v-if="item.like.find(likeItem => likeItem.uid == $store.state.userInfo.id)" name="heart-fill" color="#ff0000"></u-icon>
									<u-icon v-else name="heart" color="#fff"></u-icon>
									<view class="">赞</view>
								</view>
								<view class="right" @tap="showComment(item)">
									<u-icon name="chat" color="#fff"></u-icon>
									<view class="">评论</view>
								</view>
							</view>
						</view>
					</view>
					<view class="like-comment">
						<view class="like" v-if="item.like.length > 0">
							<u-icon name="heart" color="#4e5390" style="margin-right: 12rpx;"></u-icon>
							<view v-for="(likeItem, likeIndex) in item.like">{{likeItem.name}}{{likeIndex < item.like.length - 1 ? '，' : '' }}</view>
						</view>
						<view class="comment-list" v-if="item.comment.length > 0">
							<view v-for="(commentItem, commentIndex) in item.comment" @tap="onClickComment(commentItem, commentIndex, item.comment, item)">
								<text class="nickname">{{commentItem.name}}</text>
								<template v-if="commentItem.replyName">
									<text style="padding: 0 6rpx;">回复</text>
									<text class="nickname">{{commentItem.replyName}}</text>
								</template>
								<text>：{{commentItem.content}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-empty v-if="momentList.length == 0" icon="/static/img/empty/comment.png" text="快去发布一条朋友圈吧"></u-empty>

		<view v-show="isShowComment" class="comment">
			<view class="input-box">
				<u--textarea v-model="content" :placeholder="replyName ? `回复 ${replyName}:`:'评论'" autoHeight @confirm="send" @focus="closeBottom"></u--textarea>
				<i :class="['iconfont', isShowEmoji ? 'icon-jianpanqiehuan' : 'icon-biaoqing'] " style="font-size: 44rpx; margin: 0 20rpx;" @tap="showEmoji"></i>
				<u-button :type="content === '' ? 'info' : 'success'" :disabled="content === ''" style="width: auto;" size="small" @tap="send">发送</u-button>
			</view>
			<emoji v-show="isShowEmoji" @change="(emoji) => content += emoji"></emoji>
		</view>
	</view>
</template>

<script>
	import {
		getMomentList,
		like,
		comment,
		deleteComment
	} from '@/api/api';

	import emoji from '@/components/emoji.vue'
	export default {
		components: {
			emoji
		},
		data() {
			return {
				friendId: null,
				momentList: [],
				total: 0,
				page: 1,
				content: '',
				isShowEmoji: false,
				isShowComment: false,
				currentMoment: null,
				replyId: 0,
				replyName: '',
			};
		},
		computed: {
			nickname() {
				return this.$store.getters.getNameByUid(this.friendId || this.$store.state.userInfo.id)
			},
			avatar() {
				return this.$store.getters.getAvatarByUid(this.friendId || this.$store.state.userInfo.id)
			}
		},
		onLoad({
			friendId
		}) {
			this.friendId = friendId
			this.getMomentList()
		},
		onPageScroll() {
			this.momentList.forEach(item => {
				this.$set(item, 'isShowPopup', false)
			})
			this.isShowEmoji = false
			this.isShowComment = false
		},
		methods: {
			/**
			 * 发送评论
			 */
			async send() {
				const { content, replyId } = this
				const { id } = this.currentMoment

				if (!content) return
				const { data } = await comment({
					moment_id: id,
					reply_id: replyId || undefined,
					content
				})
				data.name = this.$store.state.userInfo.nickname
				if (data.reply_id) {
					data.replyName = this.$store.getters.getNameByUid(data.reply_id)
				}

				this.currentMoment.comment.push(data)
				this.isShowComment = false
				this.currentMoment = null
				this.replyId = 0
				this.replyName = ''
			},
			showPopup(item) {
				this.$set(item, 'isShowPopup', !item.isShowPopup)
			},
			async getMomentList() {
				const { friendId } = this
				const params = { page: this.page }
				if (friendId) {
					params.friend_id = friendId
				}
				const { data } = await getMomentList(params)
				this.total = data.total
				this.momentList = data.data.map(item => {
					const { content, uid } = item
					// 解析content
					try {
						item.content = JSON.parse(content)
					} catch (e) {
						console.error(e)
					}

					// 获取用户名和头像
					if (uid == this.$store.state.userInfo.id) {
						item.name = this.$store.state.userInfo.nickname
						item.avatar = this.$store.state.userInfo.avatar
					} else {
						const friend = this.$store.getters.getFriend(uid)
						item.name = friend ? (friend.remark || friend.nickname) : ''
						item.avatar = friend ? friend.avatar : ''
					}

					// 获取点赞用户列表
					if (Array.isArray(item.like)) {
						item.like.forEach(likeItem => {
							if (likeItem.uid == this.$store.state.userInfo.id) {
								likeItem.name = this.$store.state.userInfo.nickname
							} else {
								likeItem.name = this.$store.getters.getNameByUid(likeItem.uid)
							}
						})
					}

					// 评论列表格式化
					item.comment.forEach(commentItem => {
						commentItem.name = commentItem.uid == this.$store.state.userInfo.id ? this.$store.state.userInfo.nickname : this.$store.getters.getNameByUid(commentItem.uid)

						if (commentItem.reply_id) {
							commentItem.replyName = this.$store.getters.getNameByUid(commentItem.reply_id)
						}
					})
					return item
				})
			},
			postMoment() {
				uni.navigateTo({
					url: '/pages/postMoment/postMoment'
				})
			},
			async like(likeItem) {
				likeItem.isShowPopup = false
				const { data } = await like({ moment_id: likeItem.id })
				if (data) {
					data.name = this.$store.state.userInfo.nickname
					likeItem.like.push(data)
				} else {
					const index = likeItem.like.findIndex(item => item.uid == this.$store.state.userInfo.id)
					likeItem.like.splice(index, 1)
				}
			},
			showEmoji() {
				this.isShowEmoji = !this.isShowEmoji
			},
			showComment(item) {
				this.currentMoment = item
				this.isShowComment = !this.isShowComment
				item.isShowPopup = false
			},
			onClickComment(commentItem, commentIndex, commentList, moment) {
				const { id, uid, name, content } = commentItem
				if (uid == this.$store.state.userInfo.id) {
					uni.showActionSheet({
						itemList: ['复制', '删除'],
						success: async ({ tapIndex }) => {
							switch (tapIndex) {
								case 0:
									uni.setClipboardData({ data: content })
									break;
								case 1:
									const res = await deleteComment({ comment_id: id })
									commentList.splice(commentIndex, 1)
									uni.showToast({
										title: '已删除',
										icon: "success"
									})
									break;
								default:
									break;
							}
						}
					});
				} else {
					this.currentMoment = moment
					this.replyId = uid
					this.replyName = name
					this.isShowComment = true
				}
			},
		}
	}
</script>

<style lang="scss">
	.top {
		width: 100vw;
		height: 70vw;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.avatar {
			display: flex;
			position: absolute;
			right: 30rpx;
			bottom: -60rpx;

			.nickname {
				color: #fff;
				font-size: 36rpx;
				font-weight: 500;
				padding-right: 20rpx;
			}
		}
	}

	.moment-list {
		padding: 100rpx 0 0 0;

		.item {
			display: flex;
			padding: 30rpx;
			border-bottom: 2rpx solid #99999930;

			.content {
				flex: 1;
				padding-left: 20rpx;

				.name {
					color: #4e5390;
				}

				.text {}

				.video {
					width: 100%;
					margin-top: 15rpx;
					border-radius: 8rpx;
				}

				.bottom {
					display: flex;
					justify-content: space-between;
					font-size: 24rpx;
					color: #999999;
					padding-top: 20rpx;

					.icon {
						background-color: #00000010;
						padding: 0rpx 10rpx;
						border-radius: 8rpx;
						position: relative;

						.popup {
							width: 260rpx;
							height: 60rpx;
							position: absolute;
							top: -12rpx;
							left: -270rpx;
							display: flex;

							white-space: nowrap;
							background-color: #4c4c4c;
							border-radius: 8rpx;
							color: #fff;

							.left,
							.right {
								width: 50%;
								height: 100%;
								display: flex;
								justify-content: center;
								align-items: center;

								.u-icon {
									margin-right: 10rpx;
								}
							}
						}
					}
				}

				.like-comment {
					margin: 20rpx 0;
					border-radius: 8rpx;
					background-color: #00000010;
					font-size: 24rpx;


					.like {
						display: flex;
						flex-wrap: wrap;
						padding: 12rpx;
						color: #4e5390;
						border-bottom: #00000008 solid 1px;
					}

					.comment-list {
						padding: 12rpx;
						line-height: 1.8;

						.nickname {
							color: #4e5390;
						}
					}
				}
			}
		}
	}

	.comment {
		position: fixed;
		bottom: 0;
		width: 100vw;
		z-index: 99;

		.input-box {
			background-color: #f7f7f7;
			display: flex;
			padding: 10rpx 20rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			border-bottom: #00000010 solid 1px;

			.u-icon {
				margin-left: 10rpx;
			}

			.u-textarea {
				flex: 1;
				border: none !important;
			}
		}

		.emoji-container {
			height: 400rpx;

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

		.function-list {
			display: flex;
			flex-wrap: wrap;
			padding: 40rpx;
			background-color: #f7f7f7;

			.item {
				width: 25%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.icon-box {
					width: 120rpx;
					height: 120rpx;
					background-color: white;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.text {
					font-size: 24rpx;
					text-align: center;
					color: #6b6b6b;
					padding: 4rpx;
				}
			}
		}

	}
</style>