<template>
	<view>
		<navigator url="/pages/info/info">
			<view class="">
				{{userInfo.nickname}}
			</view>
			<view class="">
				账号：{{userInfo.username}}
			</view>
		</navigator>

		<uni-list>
			<uni-list-item :show-extra-icon="true" title="设置" to="/pages/set/set" />
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>