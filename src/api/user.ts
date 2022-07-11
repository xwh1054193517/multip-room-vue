import myRequest from "@/utils/http";

export const register = data => myRequest('post', '/user/register', data)

export const login = data => myRequest('post', '/user/login', data);

export const getUserInfo = data => myRequest('get', '/user/info', data)

export const updateUserInfo = data => myRequest('put', '/user/update', data)