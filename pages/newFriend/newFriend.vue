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
					<view class="f--c">
						<u-button type="success" size="mini" text="接受" @tap="accept(item.id)"></u-button>
						<u-button type="warning" size="mini" text="拒绝" style="margin-left: 20rpx;" @tap="refuse(item.id)"></u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="item f u-border-bottom" v-for="item in applicationRecord">
				<u-avatar :src="formatUrl(item.avatar)" shape="square" size="40"></u-avatar>
				<view class="center">
					<view class="u-line-1">{{item.nickname}}</view>
					<view class="application-message u-line-2">{{item.application_message}}</view>
				</view>

				<view class="right">
					{{statusMap[item.status] || ''}}
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
		refuse,
		getApplicationRecord
	} from '@/api/api';

	export default {
		data() {
			return {
				username: '',
				applicationList: [],
				applicationRecord: [],
				statusMap: {
					1: '等待通过',
					2: '已添加',
					3: '已拒绝',
				}
			};
		},
		onShow() {
			this.getApplication()
			this.getApplicationRecord()
		},
		methods: {
			/**
			 * 申请列表
			 */
			async getApplication() {
				const { data } = await getApplication()
				this.applicationList = data
			},
			/**
			 * 申请记录
			 */
			async getApplicationRecord() {
				const { data } = await getApplicationRecord()
				this.applicationRecord = data.data
			},
			/**
			 * 同意好友申请
			 * @param {Object} id
			 */
			async accept(id) {
				await accept({ id })
				this.getApplication()
				this.$store.dispatch('getApplicationCount')
				await this.$store.dispatch('getFriendList')
				uni.redirectTo({
					url: `/pages/friendDetail/friendDetail?id=${id}`
				})
			},
			/**
			 * 拒绝好友申请
			 * @param {Object} id
			 */
			async refuse(id) {
				await refuse({ id })
				this.getApplication()
				this.$store.dispatch('getApplicationCount')
			},
			/**
			 * 搜索好友
			 */
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