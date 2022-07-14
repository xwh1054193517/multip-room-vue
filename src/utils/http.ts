import myaxios from "./axios"

export default function myRequest(method, url, data = {}, headers = {}) {
  //如果是get方法data作为params传入,不是则作为data
  const methodType = method.toLocaleLowerCase() === 'get' ? 'params' : 'data'
  const option = {
    method,
    url,
    //字符串当属性需要加括号[]
    [methodType]: data,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
  return myaxios(option)
}