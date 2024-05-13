<template>
	<view class="container">
		<u--form labelPosition="top" labelWidth="200" :model="form" ref="uForm">
			<u-form-item label="发送添加朋友申请" borderBottom>
				<u--textarea v-model="form.application_message"></u--textarea>
			</u-form-item>
			<u-form-item label="设置备注" borderBottom>
				<u--input v-model="form.remark" border="none"></u--input>
			</u-form-item>
			<u-form-item label="设置朋友权限" borderBottom>
				<u-radio-group v-model="form.permission" activeColor="#05c160" style="padding: 10px 0;">
					<u-radio label="聊天,朋友圈等" :name="1" style="margin-right: 10px;"></u-radio>
					<u-radio label="仅聊天" :name="2"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item v-if="form.permission == 1" label="朋友圈和状态" borderBottom>
				<view style="width: 100%;">
					<view class="f-b-c" style="margin-bottom: 10px;">
						<text>不让他看我</text>
						<u-switch v-model="form.see_me" :activeValue="1" :inactiveValue="0" activeColor="#05c160" size="20"></u-switch>
					</view>
					<view class="f-b-c">
						<text>不看他</text>
						<u-switch v-model="form.see_he" :activeValue="1" :inactiveValue="0" activeColor="#05c160" size="20"></u-switch>
					</view>
				</view>
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
					permission: 1,
					see_me: 0,
					see_he: 0
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