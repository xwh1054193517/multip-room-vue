import cookies from 'js-cookie'
const tokenKey = 'token'
export function getToken() {
  return cookies.get(tokenKey)
}

export function setToken(token: string) {
  return cookies.set(tokenKey, token)
}

export function clearToken() {
  cookies.remove(tokenKey)

}