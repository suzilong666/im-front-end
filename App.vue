<script>
	import {
		ws
	} from '@/api/ws'
	export default {
		onLaunch: function() {
			this.$store.dispatch('init')
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// @import '@/uni_modules/uni-scss/index.scss';
	*{
		box-sizing: border-box;
	}
	uni-page-body{
		height: 100%;
	}
</style>