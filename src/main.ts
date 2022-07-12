import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.less'
import './utils/permission.ts'
import socket from './socket'
import VueSocketIOExt from 'vue-socket.io-extended';
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
const app = createApp(App)
app.use(VueSocketIOExt, socket);
app.use(store).use(router).mount('#app')
