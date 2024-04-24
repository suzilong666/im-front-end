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

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: {
		token: '',
		userInfo: {},
		config: {},
		chatList: [],
		friendList: [], // 好友列表
		groupChatList: [], // 群聊列表
	},
	mutations: {
		set(state, {
			key,
			value
		}) {
			state[key] = value
		}
	},
	getters: {
		getFriendById: (state) => (id) => {
			return state.friendList.find(item => item.id == id)
		},
		getGroupChatById: (state) => (id) => {
			return state.groupChatList.find(item => item.id == id)
		}
	},
	actions: {
		init({
			dispatch,
			state
		}) {
			if (!state.token) return
			dispatch('getConfig');
			dispatch('getUserInfo');
			dispatch('getFriendList');
			dispatch('getGroupChatList');
		},
		getUserInfo(context) {
			getUserInfo().then(({
				data
			}) => {
				data.avatar = context.state.config.baseUrl
				context.commit('set', {
					key: 'userInfo',
					value: data
				})
			})
		},
		getConfig(context) {
			getConfig().then(({
				data
			}) => {
				context.commit('set', {
					key: 'config',
					value: data
				})
			})
		},
		getFriendList(context) {
			getFriendList().then(({
				data
			}) => {
				context.commit('set', {
					key: 'friendList',
					value: data
				})
			})
		},
		getGroupChatList(context) {
			getGroupChatList().then(({
				data
			}) => {
				context.commit('set', {
					key: 'groupChatList',
					value: data
				})
			})
		},
		getChatList(context) {
			const {
				getters
			} = context
			getChatList().then(({
				data
			}) => {
				data.forEach(item => {
					let title = ''
					if (item.type == 1) {
						// 私聊
						const friend = getters.getFriendById(item.friend_id)
						if (friend) title = friend.remark || friend.nickname || friend.username
					} else {
						// 群聊
						const group = getters.getGroupChatById(item.group_id)
						if (group) title = group.name
					}
					item.title = title
				})
				context.commit('set', {
					key: 'chatList',
					value: data
				})
			})
		},
		/**
		 * 获取聊天记录
		 * @param {Object} context
		 * @param {Object} id 好友uid
		 */
		getChatHistory(context, id) {
			if (!id) return
			const {
				chatList
			} = context.state
			getChatHistory({
				id
			}).then(({
				data
			}) => {
				const chat = chatList.find(item => item.friend_id == id)
				if (!chat) return
				chat.history = data
				context.commit('set', {
					key: 'chatList',
					value: chatList
				})
			})
		},
		/**
		 * 获取聊天记录
		 * @param {Object} context
		 * @param {Object} id 好友uid
		 */
		getGroupChatHistory(context, id) {
			if (!id) return
			const {
				chatList
			} = context.state
			getGroupChatHistory({
				group_id: id
			}).then(({
				data
			}) => {
				const chat = chatList.find(item => item.group_id == id)
				if (!chat) return
				chat.history = data
				context.commit('set', {
					key: 'chatList',
					value: chatList
				})
			})
		}
	},
	plugins: [createPersistedState()]
})
export default store