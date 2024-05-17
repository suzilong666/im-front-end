<template>
	<view class="container">
		<u--form labelPosition="top" labelWidth="200" :model="form" ref="uForm">
			<u-form-item label="发送添加朋友申请" borderBottom>
				<u--textarea v-model="form.application_message"></u--textarea>
			</u-form-item>
			<u-form-item label="设置备注" borderBottom>
				<u--input v-model="form.remark" border="none"></u--input>
			</u-form-item>
			<u-form-item>
				<u-button type="success" color="#05c160" text="发送" @tap="addFriend"></u-button>
			</u-form-item>
		</u--form>
	</view>
</template>

<script>
	import {
		addFriend
	} from '@/api/api';
	export default {
		data() {
			return {
				form: {
					id: 0,
					application_message: '',
					remark: '',
				},
			};
		},
		onLoad({ id }) {
			this.form.id = id
			this.form.application_message = `我是${this.$store.state.userInfo.nickname}`
		},
		methods: {
			async addFriend() {
				const { data } = await addFriend(this.form)
				this.$showToast('已发送')
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0 20rpx;
	}
</style>