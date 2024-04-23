<script>
	import {
		ws
	} from '@/api/ws'
	export default {
		onLaunch: function() {
			this.$store.dispatch('getConfig')
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">


	/*每个页面公共css */
	// @import '@/uni_modules/uni-scss/index.scss';
</style>