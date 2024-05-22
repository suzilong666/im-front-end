import store from '@/store/index.js'; //需要引入store

function request({
	url,
	method = 'GET',
	data
}) {
	return new Promise((resolve, reject) => {
		const header = {}
		const token = store.state.token;
		if (token) {
			header['Authorization'] = token
		}
		uni.request({
			url,
			method,
			data,
			header,
			success({
				statusCode,
				data
			}) {
				if (statusCode == 401) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
					return reject();
				}
				if (statusCode != 200) return reject()

				try {
					data = typeof data === 'string' ? JSON.parse(data) : data
				} catch (e) {
					reject()
				}
				if (data.code == 1) {
					resolve(data)
				} else {
					reject(data)
					uni.showToast({
						icon: 'none',
						title: data.message || ''
					})
				}
			},
			fail(error) {
				reject(error)
			}
		})
	})
}

export function get(url, data) {
	return request({
		url,
		data
	})
}

export function post(url, data) {
	return request({
		url,
		method: 'POST',
		data
	})
}

export function upload(url, filePath) {
	const token = store.state.token;
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url,
			filePath,
			name: 'file',
			header: {
				'Authorization': token
			},
			success: ({
				statusCode,
				data
			}) => {
				if (statusCode == 401) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
					return reject();
				}
				if (statusCode != 200) return reject()

				try {
					data = typeof data === 'string' ? JSON.parse(data) : data
				} catch (e) {
					reject()
				}
				if (data.code == 1) {
					resolve(data)
				} else {
					reject(data)
					uni.showToast({
						icon: 'none',
						title: data.message || ''
					})
				}
			},
			fail() {
				reject()
			}
		});
	})
}
