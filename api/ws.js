import {
	bind
} from '@/api/api';
import store from '@/store/index.js'; //需要引入store

class Ws {

	socketTask = null;

	clientId = '';

	constructor() {
		this.connect()
	}

	connect() {
		const url = 'ws://127.0.0.1:3000';

		const socketTask = uni.connectSocket({
			url,
			success: () => {
				console.log('ws连接成功');
			},
			fail: () => {
				setTimeout(() => {
					this.connect()
				}, 1000)
			},
		});

		socketTask.onMessage((data) => {
			try {
				data = JSON.parse(data.data)
				console.log('ws 接收消息', data);
				const {
					type
				} = data
				if (type || typeof this[type] === 'function') {
					this[type](data.data)
				}
			} catch (e) {
				console.error(e)
			}

		})

		this.socketTask = socketTask
	}

	bind(clientId) {
		const {
			token
		} = store.state;
		this.clientId = clientId

		if (!token || !clientId) return

		bind({
			client_id: clientId
		})
	}

	message({
		message,
		sender_id, // 发送者id
		receiver_id, //接受者id
		type, // 1私聊，2群聊
	}) {
		const {
			chatList
		} = store.state;
	}
}

export const ws = new Ws();