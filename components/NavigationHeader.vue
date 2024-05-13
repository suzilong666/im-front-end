<template>
	<u-navbar :title="title" leftIcon="">
		<template slot="right">
			<navigator url="/pages/initiateGroupChat/initiateGroupChat">
				<view class="dropdown">
					<u-icon name="plus-circle" size="25"></u-icon>
				</view>
			</navigator>
		</template>
	</u-navbar>
</template>

<script>
	export default {
		name: "NavigationHeader",
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>

</style>