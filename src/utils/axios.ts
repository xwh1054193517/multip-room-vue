import axios, { Method } from 'axios'
import store from '@/store'
import { Config } from '@/config/'
import { getToken } from './auth'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
const config = {
  baseURL: Config.baseUrl,
  crossDomain: true,
  timeout: 5000
}
const myaxios = axios.create(config)

//请求拦截器
myaxios.interceptors.request.use(cfg => {
  const reqConfig = { ...cfg }
 
  //没有携带ulr
  if (!reqConfig.url) {
    throw new Error('no url');
  }

  // 没有指定方法
  if (!reqConfig.method) {
    reqConfig.method = 'get'
  }

  //防止GET POST错误传参
  if (reqConfig.method === 'get') {
    if (!reqConfig.params) {
      reqConfig.params = reqConfig.data || {}
    }
  } else if (reqConfig.method === 'post') {
    if (!reqConfig.data) {
      reqConfig.data = reqConfig.params || {}
    }
  }

  //防止字段大写
  reqConfig.method = reqConfig.method.toLowerCase() as Method

  // 如果有token添加
  if (getToken()) {
    reqConfig.headers.Authorization = getToken()
  }

  return reqConfig
}, error => {
  Promise.reject(error)
})

//响应拦截器
myaxios.interceptors.response.use(response => {
  //以2开头就是成功
  if (response.status.toString().charAt(0) === '2') {
    return response.data
  } else {
    return Promise.reject(new Error(response.data.message || 'Error'))
  }
}, error => {
  if (error.message === 'timeout of 5000ms exceeded') {
    ElMessage({
      message: '请求超时，请检查您的网络状态或重新请求！',
      type: 'error'
    });
  }

  //拿到响应的状态和数据
  const { status, data } = error.response
  //拿到后端自定义的响应码 和 响应信息
  const { code, message } = data

  //服务器错误
  if (status == 500) {
    return
  }

  //身份认证 错误
  if (code == 401) {

  } else {
    ElMessage({
      message: message,
      type: 'error'
    })
  }
  return Promise.reject(error)
})

export default myaxios