import {
	get,
	post,
	upload as uploadFn
} from './request.js'

export const searchFriend = (data) => get('/api/user/search', data)
export const getUserInfo = (data) => get('/api/user/getUserInfo', data)
export const updateUserInfo = (data) => post('/api/user/update', data)

export const login = (data) => post('/api/auth/login', data)
export const register = (data) => post('/api/auth/register', data)

export const addFriend = (data) => get('/api/friend/add', data)
export const getApplication = (data) => get('/api/friend/application', data)
export const getApplicationRecord = (data) => get('/api/friend/applicationRecord', data)
export const accept = (data) => get('/api/friend/accept', data)
export const getFriendList = (data) => get('/api/friend/list', data)
export const getFriendDetail = (data) => get('/api/friend/friendDetail', data)

export const send = (data) => post('/api/chat/send', data)
export const bind = (data) => get('/api/chat/bind', data)
export const getChatHistory = (data) => get('/api/chat/getChatHistory', data)
export const getChatList = (data) => get('/api/chat/getChatList', data)

export const upload = (data) => uploadFn('/api/common/upload', data)