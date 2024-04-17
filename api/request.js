function request({
	url,
	method = 'GET',
	data
}) {
	return new Promise((resolve, reject) => {
		const header = {}
		const token = uni.getStorageSync('token')
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