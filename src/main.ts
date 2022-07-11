import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.less'
import './utils/permission.ts'
import socket from './socket'
import VueSocketIOExt from 'vue-socket.io-extended';

const app = createApp(App)
app.use(VueSocketIOExt, socket);
app.use(store).use(router).mount('#app')
