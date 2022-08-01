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
import 'element-plus/es/components/dropdown-item/style/css'
import 'element-plus/es/components/dropdown-menu/style/css'
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/drawer/style/css'

import SvgIcon from '@/components/SvgIcon/index.vue'
const req = require.context('@/assets/icons/svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

const app = createApp(App)
app.component('Icon', SvgIcon)
app.use(VueSocketIOExt, socket);
app.use(store).use(router).mount('#app')
