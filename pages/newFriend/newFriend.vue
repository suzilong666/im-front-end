<template>
	<view>
		<input v-model="username" class="uni-input" focus placeholder="用户名" />
		<button type="primary" @tap="search">搜索</button>

		<view v-if="searchResult" class="">
			<view>{{searchResult.username}}</view>
			<view>{{searchResult.nickname}}</view>
			<button type="primary" @tap="add">添加</button>
		</view>

		<view class="">
			<view class="" v-for="item in applicationList">
				<view class="">
					<view class="">{{item.nickname}}</view>
					<button v-if="item.status == 1" class="mini-btn" type="primary" size="mini"
						@tap="accept(item.id)">接受</button>
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
		accept
	} from '@/api/api';
	export default {
		data() {
			return {
				username: '',
				searchResult: null,
				applicationList: []
			};
		},
		onShow() {
			this.getApplication()
		},
		methods: {
			accept(id) {
				accept({
					id
				}).then(() => {
					this.getApplication()
					this.$store.dispatch('getFriendList')
				})
			},
			getApplication() {
				getApplication().then(({
					data
				}) => {
					this.applicationList = data
				})
			},
			search() {
				searchFriend({
					username: this.username
				}).then(({
					data
				}) => {
					this.searchResult = data
				})
			},
			add() {
				addFriend({
					id: this.searchResult.id
				}).then(({
					data
				}) => {

				})
			}
		}
	}
</script>

<style lang="scss">

</style>