<template>
	<view>
		<u-checkbox-group v-model="selectFriend" placement="column" @change="change">
			<u-index-list :index-list="indexList">
				<template v-for="(item, index) in friendList">
					<!-- #ifdef APP-NVUE -->
					<u-index-anchor :text="indexList[index]"></u-index-anchor>
					<!-- #endif -->
					<u-index-item>
						<!-- #ifndef APP-NVUE -->
						<u-index-anchor :text="indexList[index]"></u-index-anchor>
						<!-- #endif -->
						<view v-for="(cell, index) in item">
							<u-checkbox :name="cell.id"></u-checkbox>
							{{cell.nickname}}
						</view>
					</u-index-item>
				</template>
			</u-index-list>
		</u-checkbox-group>
	</view>
</template>

<script>
	export default {
		name: "friendList",
		data() {
			return {
				indexList: ["A"],
				selectFriend: []
			};
		},
		computed: {
			friendList() {
				return [this.$store.state.friendList]
			}
		},
		methods: {
			change(e) {
				this.$emit('change', e)
			}
		}
	}
</script>

<style lang="scss">

</style>