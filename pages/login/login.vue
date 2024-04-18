<template>
	<view>
		<view class="uni-form-item uni-column">
			<view class="title">账号</view>
			<input v-model="form.username" class="uni-input" focus placeholder="账号" />
		</view>
		<view class="uni-form-item uni-column">
			<view class="title">密码</view>
			<input v-model="form.password" class="uni-input" focus placeholder="密码" />
		</view>

		<button type="primary" @tap="login">登录</button>

		<navigator url="/pages/register/register">注册</navigator>
	</view>
</template>

<script>
	import {
		login
	} from '@/api/api';
	import {
		ws
	} from '@/api/ws'
	export default {
		data() {
			return {
				form: {
					username: '',
					password: ''
				}
			};
		},
		methods: {
			login() {
				login(this.form).then(({
					data
				}) => {
					this.$store.commit('set', {
						key: 'token',
						value: data
					})
					this.$store.dispatch('getUserInfo')
					ws.bind()
					uni.switchTab({
						url: '/pages/chats/chats'
					})
				})
			}
		}
	}
</script>

<style lang="scss">

</style>