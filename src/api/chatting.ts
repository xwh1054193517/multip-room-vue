import myRequest from "@/utils/http";

export const createUserRoom = data => myRequest('post', '/chat/createRoom', data)

export const getRoomDetail = data => myRequest('get', '/chat/roomDetail', data)

export const updateRoom = data => myRequest('put', '/chat/updateRoom', data)

export const checkHistory = (data?) => myRequest('post', '/chat/history', data)