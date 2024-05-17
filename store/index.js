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
	getChatHistory,
	getGroupChatMemberList,
	getApplicationCount
} from '@/api/api';

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
		groupChatMemberMap: {}, // 群聊成员映射 {groupId => []}
		chatsUnreadQuantity: 0, // 消息页面未读消息数量
		contactsUnreadQuantity: 0, // 通讯录页面未读消息数量
	},
	mutations: {
		set(state, {
			key,
			value
		}) {
			state[key] = value
		},
		logout(state) {
			state.token = ''
			state.userInfo = {}
			state.chatList = []
			state.friendList = []
			state.groupChatList = []
			state.friendHistoryMap = {}
			state.groupChatHistoryMap = {}
			state.groupChatMemberMap = {}
			// state.chatsUnreadQuantity = 0
			state.contactsUnreadQuantity = 0
		}
	},
	getters: {
		chatsUnreadQuantity(state) {
			return state.chatList.reduce((count, item) => { count + +item.unread_quantity }, 0)
		},
		baseUrl: (state) => {
			return state.config.baseUrl || ''
		},
		getFriend: (state) => (id) => {
			return state.friendList.find(item => item.id == id)
		},
		getNameByUid: (state) => (id) => {
			if (id == state.userInfo.id) return state.userInfo.nickname;
			const friend = state.friendList.find(item => item.id == id)
			return friend ? (friend.remark || friend.nickname) : ''
		},
		getAvatarByUid: (state) => (id) => {
			if (id == state.userInfo.id) return state.userInfo.avatar;
			const friend = state.friendList.find(item => item.id == id)
			return friend ? friend.avatar : ''
		},
		getFriendHistory: (state) => (id) => {
			return state.friendHistoryMap[id] || []
		},
		getGroupChat: (state) => (id) => {
			return state.groupChatList.find(item => item.id == id)
		},
		getGroupChatMemberList: (state) => (groupId) => {
			return state.groupChatMemberMap[groupId] || []
		},
		getGroupChatHistory: (state) => (groupId) => {
			return state.groupChatHistoryMap[groupId] || []
		},
	},
	actions: {
		async init({
			dispatch,
			state
		}) {
			if (!state.token) return
			await dispatch('getConfig');
			await dispatch('getUserInfo');
			await dispatch('getFriendList');
			dispatch('getChatList');
			dispatch('getGroupChatList');
			dispatch('getApplicationCount');
		},
		async getApplicationCount({ commit }) {
			const { data } = await getApplicationCount()
			commit('set', {
				key: 'contactsUnreadQuantity',
				value: data
			})
			if (data > 0) {
				uni.setTabBarBadge({
					index: 1,
					text: String(data)
				})
			} else {
				uni.removeTabBarBadge({
					index: 1
				})
			}
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
			commit('set', {
				key: 'friendList',
				value: data
			})
			return data
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
			return data
		},
		/**
		 * 获取群聊成员列表
		 */
		async getGroupChatMemberList({ commit, state }, group_id) {
			const {
				data
			} = await getGroupChatMemberList({ group_id })
			const { groupChatMemberMap } = state
			groupChatMemberMap[group_id] = data
			commit('set', {
				key: 'groupChatMemberMap',
				value: groupChatMemberMap
			})
		},
		async getChatList({
			getters,
			commit
		}) {
			const {
				data
			} = await getChatList()
			let unreadQuantity = 0
			data.forEach(item => {
				unreadQuantity += (item.unread_quantity || 0)
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
			// commit('set', {
			// 	key: 'chatsUnreadQuantity',
			// 	value: unreadQuantity
			// })
			if (unreadQuantity > 0) {
				uni.setTabBarBadge({
					index: 0,
					text: String(unreadQuantity)
				})
			} else {
				uni.removeTabBarBadge({
					index: 0
				})
			}
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
		async getGroupChatHistory({ commit, state }, id) {
			if (!id) return
			const { data } = await getGroupChatHistory({
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
				chat.unread_quantity += 1
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