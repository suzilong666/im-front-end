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
		<view class="uni-form-item uni-column">
			<view class="title">昵称</view>
			<input v-model="form.nickname" class="uni-input" focus placeholder="昵称" />
		</view>

		<button type="primary" @tap="register">注册</button>
	</view>
</template>

<script>
	import {
		register
	} from '@/api/api';
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
					nickname: '',
				}
			};
		},
		methods: {
			register() {
				register(this.form).then(() => {
					this.$showToast('注册成功')
				})
			}
		}
	}
</script>

<style lang="scss">

</style>