<template>
	<view>
		<u-search placeholder="请输入账号" v-model="username" @search="search" @custom="search"></u-search>

		<view class="list">
			<view class="item f u-border-bottom" v-for="item in applicationList">
				<u-avatar :src="formatUrl(item.avatar)" shape="square" size="40"></u-avatar>
				<view class="center">
					<view class="u-line-1">{{item.nickname}}</view>
					<view class="application-message u-line-2">{{item.application_message}}</view>
				</view>

				<view class="right">
					<view v-if="item.status == 1" class="f--c">
						<u-button type="success" size="mini" text="接受" @tap="accept(item.id)"></u-button>
						<u-button type="warning" size="mini" text="拒绝" style="margin-left: 20rpx;" @tap="refuse(item.id)"></u-button>
					</view>
					<text v-else-if="item.status == 2">已添加</text>
					<text v-else-if="item.status == 3">已拒绝</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		searchFriend,
		addFriend,
		getApplication,
		accept,
		refuse
	} from '@/api/api';

	export default {
		data() {
			return {
				username: '',
				applicationList: []
			};
		},
		onShow() {
			this.getApplication()
		},
		methods: {
			async accept(id) {
				await accept({ id })
				this.getApplication()
				this.$store.dispatch('getApplicationCount')
				await this.$store.dispatch('getFriendList')
				uni.redirectTo({
					url: `/pages/friendDetail/friendDetail?id=${id}`
				})
			},
			async refuse(id) {
				await refuse({ id })
				this.getApplication()
				this.$store.dispatch('getApplicationCount')
			},
			async getApplication() {
				const { data } = await getApplication()
				this.applicationList = data.data
			},
			async search() {
				const { data } = await searchFriend({ username: this.username })
				if (!data) return this.$showToast('该用户不存在')
				uni.navigateTo({
					url: `/pages/friendDetail/friendDetail?id=${data.id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		padding: 20rpx;
	}

	.list {
		padding-top: 20rpx;

		.item {
			padding: 20rpx 0;

			.center {
				padding-left: 20rpx;

				.application-message {
					padding-top: 10rpx;
					padding-right: 30rpx;
					font-size: 24rpx;
					color: #999;
				}
			}

			.right {
				margin-left: auto;
				font-size: 14px;
				color: #999;

				.u-button {
					margin-top: 20rpx;
				}
			}
		}
	}
</style>