# multip-room 多人聊天音乐室

## 技术栈
* vue3:前端框架
* vue-Router,Vuex：路由跳转以及状态管理
* typescript;(其实没怎么用到类型注解)
* elementplus:Vue3组件库
* less：css预处理
* socket.io：实时通讯

## 项目功能
### 音乐
* 搜索音乐（调用qq音乐接口,容易抽风)
* 快速搜索（只会搜索出少量，且耗时长）
* 日推歌曲（调用qq音乐接口，在点歌处显示的均为日推）
* 根据mid获得播放链接（调用qq音乐接口)
* 收藏歌曲
* 查看收藏歌曲
* 移除收藏歌曲
* 查看热门推荐（管理员的收藏歌曲）
* Websocket(下一首，点歌，移除点歌,顶歌)

### 聊天 
* 创建房间
* 查找房间信息
* 更新房间信息
* 查看聊天历史
* 查看未读信息
* Websocket(发送信息，撤回信息，更新房间列表，更新用户列表)

##  项目难点
* 自定义组件弹出框：配合slot实现弹出框内自定义
* 封装svgIcon组件,引入svg资源文件规范使用svg图标
* 使用less变量进行主题控制与颜色替换
* 将vuex的getter,action,mutation操作封装成hooks利于调用
* 引入Socket.io监听对应的实时通信事件，通过状态管理通知对应组件渲染数据
* 使用scrollIntoView实现聊天显示区域滚动到最新消息
* 聊天栏实现黏贴图片、文件功能，显示区域提供对应的预览、下载功能
* 同步房间内所有用户的音乐(进度条组件显示)，根据时长解析lrc歌词文件信息，实时显示歌词（有误差）
  



## 项目启动
项目启动需要在src目录下创建.env.development，.env.production定义腾讯云存储的密钥
```js
ENV = 'development'
VUE_APP_SECRETID=xxx
VUE_APP_SECRETKEY=xxx
VUE_APP_BUCKET=xxx
VUE_APP_REGION=ap-xxx

ENV = 'production'
VUE_APP_SECRETID=xxx
VUE_APP_SECRETKEY=xxx
VUE_APP_BUCKET=xxx
VUE_APP_REGION=ap-xxx
```
* 项目运行：npm run serve
* 项目打包：npm run build

