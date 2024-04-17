<template>
	<view class="container">
		<view class="bottom">
			<input v-model="message" />
			<button type="primary" size="mini" @tap="send()">发送</button>
		</view>
	</view>
</template>

<script>
	import {
		send
	} from '@/api/api';

	export default {
		data() {
			return {
				id: undefined,
				message: ''
			};
		},
		onLoad({
			id
		}) {
			this.id = id
		},
		methods: {
			send() {
				const {
					id,
					message
				} = this
				send({
					receiver_id: id,
					message
				})
			}
		}
	}
</script>

<style lang="scss">

</style>