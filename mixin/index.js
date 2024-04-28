import {
	isAbsolutePath,
	joinUrls
} from '@/utils/index.js'

export default {
	methods:{
		/**
		 * 如果是相对路径，则拼接baseURL
		 * @param {Object} url
		 */
		formatUrl(url){
			return isAbsolutePath(url) ? url : joinUrls(this.$store.getters.baseUrl, url)
		}
	}
}