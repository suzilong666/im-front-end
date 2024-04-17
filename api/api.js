import {
	get,
	post
} from './request.js'

export const login = (data) => post('/api/auth/login', data)
export const searchFriend = (data) => get('/api/user/search', data)
export const addFriend = (data) => get('/api/friend/add', data)
export const getApplication = (data) => get('/api/friend/application', data)
export const getApplicationRecord = (data) => get('/api/friend/applicationRecord', data)
export const accept = (data) => get('/api/friend/accept', data)
export const getFriendList = (data) => get('/api/friend/list', data)
export const getFriendDetail = (data) => get('/api/friend/friendDetail', data)


export const send = (data) => post('/api/chat/send', data)
export const bind = (data) => get('/api/chat/bind', data)