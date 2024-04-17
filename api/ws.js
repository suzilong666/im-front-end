import {
	bind
} from '@/api/api';

class Ws {

	socketTask = null;

	clientId = '';

	constructor() {
		this.connect()
	}

	connect() {
		const url = 'ws://127.0.0.1:3000';

		var socketTask = uni.connectSocket({
			url,
			success() {},
			fail() {},
		});

		socketTask.onMessage((data) => {
			data = JSON.parse(data.data)
			console.log('ws 接收消息', data);

			if (data.type == 'bind') {
				this.clientId = data.data
				this.bind()
			}
		})
	}

	bind() {
		const token = uni.getStorageSync('token')
		const {
			clientId
		} = this

		if (!token || !clientId) return

		bind({
			client_id: clientId
		})
	}
}

export const ws = new Ws();