<template>
  <div class="chatting" :style="{ backgroundImage: `url(${room_bg})` }">
    <transition name="message-panel" mode="out-in">
      <div class="chatting-wrapper" v-show="showChat">
        <div class="chatting-wrapper-header">
          <chat-header></chat-header>
        </div>
        <div class="chatting-wrapper-content">
          <message-area @quoteMsg="handleQuoteMes" @loadMoreHistory="handleLoadMore">
          </message-area>
          <transition name="msg-tips" mode="out-in">
            <div @click="ToBottom" v-if="state['unReadMsgNum'].value" class="unReadMsg">{{ state['unReadMsgNum'] }}条未读信息
            </div>
          </transition>
        </div>
        <div class="chatting-wrapper-progress">
          <music-progress></music-progress>
        </div>
        <div class="chatting-wrapper-footer">
          <chat-message ref="chatMessage"></chat-message>
          <music-lyric></music-lyric>
        </div>
      </div>
    </transition>
    <music-player></music-player>
  </div>
</template>

<script lang="ts" setup>
import ChatHeader from '@/components/chat/chatHeader/index.vue';
import MessageArea from '@/components/chat/messageArea/index.vue';
import MusicProgress from '@/components/chat/musicProgress/index.vue';
import ChatMessage from '@/components/chat/chatMessage/index.vue';
import MusicPlayer from '@/components/chat/musicPlayer/index.vue';
import MusicLyric from '../../components/chat/musicLyric/index.vue';
import { computed, getCurrentInstance, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { getToken } from '@/utils/auth';
import { useState, useGetters, useActions, useMutations } from '@/utils/hooks/useMap';
import { Config } from '@/config';
import { ElMessage, ElMessageBox } from 'element-plus';
import { checkHistory } from '@/api/chatting';
import { useStore } from 'vuex';
import { scrollBottom } from '@/utils/scrolltoBottom';
import { setThemeStyle } from '@/theme';
const { proxy } = getCurrentInstance()

//参数映射 方法映射
const state = useState([
  'room_id',
  'unReadMsgNum',
  'pre_img',
  'show_join_tip',
  'show_quit_tip',
  'show_switchMusic',
  'theme',
  'show_playMusic',
  'show_roomNotice',
  'online_user_list',
  'message_list'
])
const getters = useGetters([
  'room_info',
  'my_room_bg'
])
const actions = useActions([
  'getUser',
  'loginOut',
  'getCurrentRoom'
])
const mutations = useMutations([
  "setOnlineUserList",
  "setRoomList",
  "setRoomAdmin",
  "setMessageList",
  "setCurrentMusicInfo",
  "setMusicStartTime",
  "setMusicQueueList",
  "emptyMessageList",
  "setRoomId",
  "updateMessageList",
  "setUnReadMsgNum",
  "setRoomInfo",
  "setGlobalRoomConfig"
])
const store = useStore()
const room_info = computed(() => {
  return store.getters.room_info || {}
})
let room_bg = computed(() => {
  return getters['my_room_bg'].value || room_info.value.room_bg || Config.bg
})











// console.log('getters:', getters);
// console.log('actions:', actions);
// console.log('mutations', mutations);
// console.log('state', state);

//watch 房间切换
watch(state['room_id'], (newNumber, oldNumber) => {
  if (Number(newNumber) === Number(oldNumber) || !newNumber) return;
  proxy.$socket.client.disconnect()
  resetRoom()
  initSocket()
})


//调用搜狐API获取用户地址和IP
function initUserAddress() {
  if (!document.querySelector("#address")) {
    const script = document.createElement('script')
    script.type = "text/javascript"
    script.id = "address";
    script.src = "https://pv.sohu.com/cityjson?ie=utf-8"
    document.head.appendChild(script)
  }
}

//初始化 socketio 连接至服务器
async function initSocket() {
  const token = getToken()
  if (!(window['returnCitySN'])) {
    setTimeout(() => initSocket(), 50)
  } else {
    const { cname } = window['returnCitySN']
    proxy.$socket.client.io.opts.query = {
      token,
      address: cname,
      room_id: state['room_id'].value
    }
    localStorage.room_id = state['room_id'].value
    proxy.$socket.client.open()

  }
}

//清空房间信息
const messageParam = reactive({
  page: 1,
  pagesize: 20
})
function resetRoom() {
  mutations['emptyMessageList']()
  messageParam.page = 1
}

//初始化点歌列表
function updateMusic(music) {
  const { music_info, music_lrc, music_queue_list, music_src, music_downloadSrc, music_current_time } = music
  mutations['setMusicQueueList'](music_queue_list)
  mutations['setCurrentMusicInfo']({ music_info, music_lrc, music_src, music_downloadSrc })
  //这个currentTime是进入房间时音乐开始播放的时间 不是正在播放的时间
  music_current_time && (mutations['setMusicStartTime'])(music_current_time)
}
const stopLoad = ref(false)
//查询房间历史信息
async function getHistory() {
  const res = await checkHistory({
    room_id: state['room_id'].value,
    ...messageParam
  })

  //当返回的数量少于一页数 说明是最后一页
  stopLoad.value = res.data.length == 0
  stopLoad.value && ElMessage({ message: '没有更多消息了', type: 'error' })
  mutations['setMessageList'](res.data)
}

//显示房间公告
function initRoomNotice() {
  setTimeout(() => {
    proxy.$socket.client.connected && mutations['setMessageList'](reactive({
      message_type: 'notice',
      message_content: room_info.value.room_notice
    }))
  }, 1000);
}

//初始化本地设置
function initLocalStorageConfig() {
  const keys = [
    'show_all_tips',
    'show_join_tip',
    'show_quit_tip',
    'show_switchMusic',
    'show_playMusic ',
    'show_roomNotice'
  ];
  keys.forEach((key) => localStorage[key] &&
    mutations['setGlobalRoomConfig']({ key, value: key === "theme" ? localStorage[key] : JSON.parse(localStorage[key]) })
  );
  const theme = localStorage.theme || "default"
  mutations['setGlobalRoomConfig']({ key: 'theme', value: theme })
  setThemeStyle(theme)
}

//上拉获得更多历史消息
function handleLoadMore() {
  if (stopLoad.value) return
  messageParam.page += 1
  getHistory()
}

//处理引用消息
const chatMessage = ref(null)
function handleQuoteMes(mes) {
  chatMessage.value.setQuoteMsg(mes)
}

//滚动到可视区域
function ToBottom() {
  scrollBottom({ animation: true })
  mutations['setUnReadMsgNum'](0)
}

/*-------------------socket订阅事件----------------*/
//连接成功后初始化房间信息
function socketSubscribe() {
  proxy.$socket.$subscribe('connect', () => {
    console.log('connect');
    initLocalStorageConfig()
    actions['getCurrentRoom']()
  })

  //身份token校验失败
  proxy.$socket.$subscribe('auth', (data) => {
    data && ElMessage({ message: data.msg, type: 'error' })
    actions['loginOut']()
    // console.log('auth:', data);

  })

  //用户上线
  proxy.$socket.$subscribe('online', data => {
    const { msg, online_user_list } = data
    mutations['setOnlineUserList'](online_user_list)
    state['show_join_tip'].value && mutations['setMessageList']({ message_type: "info", message_content: msg })

  })

  //用户下线
  proxy.$socket.$subscribe('offline', data => {
    const { online_user_list, msg } = data
    mutations['setOnlineUserList'](online_user_list)
    state['show_quit_tip'].value && mutations['setMessageList']({ message_type: "info", message_content: msg })
  })

  //初始化房间信息
  proxy.$socket.$subscribe('initRoomInfo', async (data) => {
    await getHistory()
    const { room_admin, msg, online_user_list, room_list } = data
    mutations['setRoomAdmin'](room_admin)
    mutations['setOnlineUserList'](online_user_list)
    mutations['setRoomList'](room_list)
    updateMusic(data)
    state['show_join_tip'].value && mutations['setMessageList']({ message_type: "info", message_content: msg })
    state['show_roomNotice'].value && initRoomNotice()
    // console.log('initRoomInfo:', data);
  })

  //房间列表变动
  proxy.$socket.$subscribe('updateRoomlist', data => {
    const { room_list, msg } = data;
    mutations['setRoomList'](room_list)
    // msg && mutations['setMessageList']({ message_type: 'info', message_content: msg })
    // console.log('updateRoomlist:', data);

  })

  //房间内用户信息变动
  proxy.$socket.$subscribe('updateOnlineUser', ({ online_user_list }) => {
    mutations['setOnlineUserList'](online_user_list)
    console.log('updateOnlineUser:', online_user_list);
  })

  //提示信息
  proxy.$socket.$subscribe('tips', data => {
    const { code, msg } = data
    //code为1则成功，为-1则失败
    code === 1 && ElMessage({ message: msg, type: 'success' })
    code === -1 && ElMessage({ message: msg, type: 'error' })
    //为-2是被挤下去了
    code === -2 && ElMessage({ message: msg, type: 'error' })
    code === -2 && actions['loginOut']()
    //为-3是没有房间
    code === -3 && ElMessage({ message: msg, type: 'error' })
    code === -3 && mutations['setRoomId'](555)
    console.log('tip:', data);
  })

  //消息提示 切歌 歌曲无法播放
  proxy.$socket.$subscribe('notice', data => {
    const { code, message_type, message_content, msg } = data
    code == 2 && state['show_switchMusic'].value && mutations['setMessageList']({ message_type, message_content })
    code == -1 && ElMessage({ message: msg, type: 'error' })
    // console.log('notice:', data);
  })

  ////用户 收到消息
  proxy.$socket.$subscribe('message', res => {
    const { data } = res
    mutations['setMessageList'](data)
    console.log('message:', res);
  })

  //用户 撤回消息
  proxy.$socket.$subscribe('callbackMessage', data => {
    const { id, msg } = data
    mutations['updateMessageList']({ id, msg })
    console.log('callbackMessage:', data);
  })

  //用户点歌
  proxy.$socket.$subscribe('chooseMusic', data => {
    const { music_queue_list, msg } = data
    mutations['setMessageList']({ message_type: 'info', message_content: msg })
    mutations['setMusicQueueList'](music_queue_list)
    // console.log('chooseMusic:', data);
  })

  //用户切歌或者系统切歌
  proxy.$socket.$subscribe('changeMusic', data => {
    const { musicInfo, msg } = data
    updateMusic(musicInfo)
    state['show_playMusic'].value && mutations['setMessageList']({ message_type: 'info', message_content: msg })
    // console.log('changeMusic:', data);
  })
}
//确定进入房间

const showChat = ref(false)
function confirmConnect() {
  ElMessageBox.confirm(
    '登陆成功，将自动加入主房间！',
    'Enjoy music while chatting',
    {
      confirmButtonText: '确认加入',
      cancelButtonText: '返回',
    }
  )
    .then(() => {
      initSocket()
      showChat.value = true
      localStorage.room_id && mutations['setRoomId'](localStorage.room_id);

    })
    .catch(() => {
      actions['loginOut']()
    })
}

// setup生命周期执行的操作、
// created 进行的操作


// localStorage.room_id && mutations['setRoomId'](localStorage.room_id);
// initSocket()
onBeforeMount(() => {
  socketSubscribe()
})



//挂载后的操作
onMounted(() => {
  initUserAddress()
  confirmConnect()
  // console.log(store.state);

})

onBeforeUnmount(() => {
  proxy.$socket.connected && proxy.$socket.client.disconnect()
})
</script>


<style lang="less" scoped>
@import '../../theme/theme.less';

@media screen and (max-width:640px) {
  .chatting-wrapper {
    position: fixed;
    width: 100vw !important;
    height: 100vh !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: 0 !important;
    border-radius: 0 !important;
  }
}

.chatting {
  width: 100vw;
  height: 100vh;
  background-size: cover;

  &-wrapper {
    position: fixed;
    left: 7%;
    right: 7%;
    top: 5%;
    bottom: 5%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 1;
    transition: all 0.5s;
    background: @message-container-bgcolor;
    box-shadow: @message-container-shadow;

    &-header {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid @message-border;
    }

    &-content {
      flex: 1;
      height: 0;
      position: relative;

      .unReadMsg {
        transition: all ease 0.4s;
        position: absolute;
        right: 10px;
        bottom: 10px;
        padding: 5px 15px;
        border-radius: 5px;
        font-size: 12px;
        color: #fff;
        background: rgb(247, 161, 24);
        font-weight: 500;
        cursor: pointer;
      }
    }

    &-progress {
      height: 2px;
      margin-bottom: 5px
    }

    &-footer {
      padding: 0
    }
  }
}
</style>