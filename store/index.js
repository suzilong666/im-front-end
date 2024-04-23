// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {
	getUserInfo,
	getFriendList,
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
		friendList: [],
		chatList: [],
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
		}
	},
	actions: {
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
		getChatList(context) {
			getChatList().then(({
				data
			}) => {
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
	},
	plugins: [createPersistedState()]
})
export default store