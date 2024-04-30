<template>
	<view class="container">
		<view class="">
			<view class="title">
				注册
			</view>
			<u--form labelPosition="left" :model="form" :rules="rules" ref="uForm">
				<u-form-item label="账号" prop="username" borderBottom>
					<u--input v-model="form.username" placeholder="请输入账号" border="none"></u--input>
				</u-form-item>
				<u-form-item label="密码" prop="password" borderBottom>
					<u--input v-model="form.password" placeholder="请输入密码" border="none" password></u--input>
				</u-form-item>
				<u-form-item label="昵称" prop="nickname" borderBottom>
					<u--input v-model="form.nickname" placeholder="请输入昵称" border="none"></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="">
			<u-button type="success" text="注册" @tap="register"></u-button>
			<navigator url="/pages/login/login" style="margin-top: 40rpx;">
				<u-button text="登录"></u-button>
			</navigator>
		</view>
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
<style lang="scss" scoped>
	.container {
		height: 100%;
		padding: 80rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.title {
			font-size: 40rpx;
			font-weight: 500;
			text-align: center;
			padding: 150rpx 0 40rpx 0;
			letter-spacing: 20rpx;
		}
	}
</style>