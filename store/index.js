// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {
	getUserInfo,
	getFriendList,
	getChatList,
} from '@/api/api';

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: {
		token: '',
		userInfo: {},
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
	actions: {
		getUserInfo(context) {
			getUserInfo().then(({
				data
			}) => {
				context.commit('set', {
					key: 'userInfo',
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
	},
	plugins: [createPersistedState()]
})
export default store