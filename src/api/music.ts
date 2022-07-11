import myRequest from "@/utils/http";

export const search = data => myRequest('get', '/music/quicksearch', data)

export const addCollect = data => myRequest('post', '/music/addCollect', data)

export const getCollect = (data?) => myRequest('get', '/music/collect', data)

export const removeCollect = data => myRequest('post', '/music/remove', data)

export const getHot = (data?) => myRequest('get', '/music/hotList', data)
