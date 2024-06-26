import {
	bind
} from '@/api/api';
import store from '@/store/index.js'; //需要引入store

class Ws {

	socketTask = null;

	clientId = '';

	timer = null; // 心跳定时器

	constructor() {
		this.connect()
	}

	/**
	 * 连接ws
	 */
	connect() {
		const url = 'ws://127.0.0.1:3000';

		const socketTask = uni.connectSocket({
			url,
			success: () => {
				console.log('ws连接成功');

				// 定时发送心跳
				if (this.timer) {
					clearInterval(this.timer)
					this.timer = null
				}
				this.timer = setInterval(() => {
					if (!this.socketTask) return
					this.socketTask.send({
						data: '{"type":"ping"}'
					})
				}, 1000 * 30)
			},
			fail: (e) => {
				console.error('ws连接失败', e);
				setTimeout(() => {
					console.log('ws尝试重新连接');
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

	/**
	 * ws返回的clientId和uid绑定
	 * @param {Object} clientId
	 */
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

	/**
	 * 收到消息
	 * @param {Object} data
	 */
	message(data) {
		store.dispatch('updateMessage', data)
		// const innerAudioContext = uni.createInnerAudioContext();
		// innerAudioContext.autoplay = false;
		// innerAudioContext.src = '/static/audio/message.mp3';
		// innerAudioContext.onPlay(() => {
		//   console.log('开始播放');
		// });
		// innerAudioContext.onError((res) => {
		//   console.log(res.errMsg);
		//   console.log(res.errCode);
		// });
		// innerAudioContext.play()
	}

	/**
	 * 收到群消息
	 * @param {Object} data
	 */
	groupMessage(data) {
		store.dispatch('updateGroupMessage', data)
	}

	/**
	 * 好友申请
	 */
	friendApplication() {
		store.dispatch('getApplicationCount')
	}

	/**
	 * 对方通过了你的好友申请
	 */
	friendApplicationSuccess() {
		store.dispatch('getFriendList')
	}

	/**
	 * 群通知
	 */
	groupChatNotice(data) {
		const { group_id, notice } = data
		const { groupChatList } = store.state
		const group = groupChatList.find(item => item.id == group_id)
		group.notice = notice
		store.commit('set', {
			key: 'groupChatList',
			value: groupChatList
		})
		uni.$emit('groupChatNotice', data)
	}

	/**
	 * 撤销
	 * @param {Object} data
	 */
	withdraw(data) {
		uni.$emit('withdraw', data)
	}

	/**
	 * 群聊撤销
	 * @param {Object} data
	 */
	groupChatWithdraw(data) {
		uni.$emit('groupChatWithdraw', data)
	}
}

export const ws = new Ws();