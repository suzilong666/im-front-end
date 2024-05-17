<template>
	<view>
		<u-checkbox-group v-model="selectFriend" placement="column" @change="change">
			<u-index-list :index-list="indexList" activeColor="#05c160">
				<template v-for="(item, index) in friendList">
					<u-index-item>
						<u-index-anchor :text="indexList[index]"></u-index-anchor>
						<view class="list-cell" v-for="(cell, index) in item" @tap="$emit('clickItem', cell)">
							<u-checkbox v-show="isShowCheckbox" shape="circle" activeColor="#5ac725" :name="cell.id"></u-checkbox>
							<u-avatar :src="formatUrl(cell.avatar)" shape="square" size="35"></u-avatar>
							<text style="margin-left: 20rpx;">{{cell.nickname}}</text>
						</view>
					</u-index-item>
				</template>
			</u-index-list>
		</u-checkbox-group>
	</view>
</template>

<script>
	import { pinyin } from 'pinyin-pro';

	export default {
		name: "friendList",
		props: {
			isShowCheckbox: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				indexList: [],
				selectFriend: []
			};
		},
		computed: {
			friendList() {
				const { friendList } = this.$store.state
				const map = {}

				friendList.forEach(item => {
					const name = item.remark || item.nickname || item.username
					const letter = pinyin(name)[0]
					if (/^[a-zA-Z]$/.test(letter)) {
						map[letter] = map[letter] || []
						map[letter].push(item)
					} else {
						map['#'] = map['#'] || []
						map['#'].push(item)
					}
				})
				this.indexList = Object.keys(map)
				return Object.values(map)
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
	.list-cell {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		padding: 10px 15px;
		font-size: 15px;
		color: #303133;
		align-items: center;
		border-bottom: 1px solid rgb(214, 215, 217);
	}
</style>