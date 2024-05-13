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
	* {
		box-sizing: border-box;
	}

	uni-page-body {
		height: 100%;
	}

	.f {
		display: flex;
	}

	.f-c {
		display: flex;
		justify-content: center;
	}

	.f--c {
		display: flex;
		align-items: center;
	}

	.f-c-c {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.f-b-c {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.f-a-c {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
</style>