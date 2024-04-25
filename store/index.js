// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {
	getUserInfo,
	getFriendList,
	getGroupChatList,
	getGroupChatHistory,
	getChatList,
	getConfig,
	getChatHistory
} from '@/api/api';

import {
	isAbsolutePath,
	joinUrls
} from '@/utils/index.js'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: {
		token: '',
		userInfo: {},
		config: {},
		chatList: [], // 消息列表
		friendList: [], // 好友列表
		groupChatList: [], // 群聊列表
		friendHistoryMap: {}, // 好友聊天记录
		groupChatHistoryMap: {}, // 群聊聊天记录
	},
	mutations: {
		set(state, {
			key,
			value
		}) {
			state[key] = value
		},
	},
	getters: {
		baseUrl: (state) => {
			return state.config.baseUrl || ''
		},
		getFriend: (state) => (id) => {
			return state.friendList.find(item => item.id == id)
		},
		getFriendHistory: (state) => (id) => {
			return state.friendHistoryMap[id] || []
		},
		getGroupChat: (state) => (id) => {
			return state.groupChatList.find(item => item.id == id)
		},
		getGroupChatHistory: (state) => (id) => {
			return state.groupChatHistoryMap[id] || []
		},
	},
	actions: {
		async init({
			dispatch,
			state
		}) {
			if (!state.token) return
			await dispatch('getConfig');
			dispatch('getUserInfo');
			dispatch('getFriendList');
			dispatch('getGroupChatList');
		},
		async getConfig(context) {
			const {
				data
			} = await getConfig()
			context.commit('set', {
				key: 'config',
				value: data
			})
		},
		async getUserInfo({
			commit,
			getters
		}) {
			const {
				data
			} = await getUserInfo()
			data.avatar = isAbsolutePath(data.avatar) ? data.avatar : joinUrls(getters.baseUrl, data.avatar) || ''
			commit('set', {
				key: 'userInfo',
				value: data
			})
		},
		async getFriendList({
			commit,
			getters
		}) {
			const {
				data
			} = await getFriendList()
			data.forEach(item => {
				item.avatar = isAbsolutePath(item.avatar) ? item.avatar : joinUrls(getters.baseUrl, item.avatar) || ''
			})
			commit('set', {
				key: 'friendList',
				value: data
			})
		},
		async getGroupChatList({
			commit
		}) {
			const {
				data
			} = await getGroupChatList()
			commit('set', {
				key: 'groupChatList',
				value: data
			})
		},
		async getChatList({
			getters,
			commit
		}) {
			const {
				data
			} = await getChatList()
			data.forEach(item => {
				let title = ''
				let avatar = ''
				if (item.type == 1) {
					// 私聊
					const friend = getters.getFriend(item.friend_id)
					if (friend) {
						title = friend.remark || friend.nickname || friend.username || ''
						avatar = friend.avatar
					}
				} else {
					// 群聊
					const group = getters.getGroupChat(item.group_id)
					if (group) title = group.name
				}
				item.title = title
				item.avatar = avatar
			})
			commit('set', {
				key: 'chatList',
				value: data
			})
		},
		/**
		 * 获取聊天记录
		 * @param {Object} context
		 * @param {Object} id 好友uid
		 */
		async getChatHistory({
			state,
			commit
		}, id) {
			if (!id) return
			const { data } = await getChatHistory({ id })
			const { friendHistoryMap } = state
			friendHistoryMap[id] = data
			commit('set', {
				key: 'friendHistoryMap',
				value: friendHistoryMap
			})
		},
		/**
		 * 获取聊天记录
		 * @param {Object} context
		 * @param {Object} id 好友uid
		 */
		async getGroupChatHistory({commit,state}, id) {
			if (!id) return
			const {data} = await getGroupChatHistory({
				group_id: id
			})
			const {
				groupChatHistoryMap
			} = state
			groupChatHistoryMap[id] = data
			commit('set', {
				key: 'groupChatHistoryMap',
				value: groupChatHistoryMap
			})
		},
		/**
		 * 发送/接收消息，更新聊天记录和消息列表
		 */
		updateMessage({
			state,
			commit,
			dispatch
		}, message) {
			const {
				friendHistoryMap,
				chatList,
				userInfo
			} = state
			const {
				sender_id,
				receiver_id,
				create_time
			} = message
			const id = userInfo.id == sender_id ? receiver_id : sender_id
			if (!friendHistoryMap[id]) friendHistoryMap[id] = []
			friendHistoryMap[id].push(message)
			commit('set', {
				key: 'friendHistoryMap',
				value: friendHistoryMap
			})

			const chat = chatList.find(item => item.type == 1 && item.friend_id == id)
			if (chat) {
				chat.last_message = message.message
				chat.last_message_time = create_time
				commit('set', {
					key: 'chatList',
					value: chatList
				})
			} else {
				dispatch('getChatList')
			}
		},
		/**
		 * 发送/接收消息，更新聊天记录和消息列表
		 */
		updateGroupMessage({
			state,
			commit,
			dispatch
		}, message) {
			const {
				groupChatHistoryMap,
				chatList
			} = state
			const {
				group_id,
				create_time
			} = message
			if (!groupChatHistoryMap[group_id]) groupChatHistoryMap[group_id] = []
			groupChatHistoryMap[group_id].push(message)
			commit('set', {
				key: 'groupChatHistoryMap',
				value: groupChatHistoryMap
			})

			const chat = chatList.find(item => item.type == 2 && item.group_id == group_id)
			if (chat) {
				chat.last_message = message.message
				chat.last_message_time = create_time
				commit('set', {
					key: 'chatList',
					value: chatList
				})
			} else {
				dispatch('getChatList')
			}
		}
	},
	plugins: [createPersistedState()]
})
export default store