<template>
  <div class="header flex-between">
    <div class="header-left flex-start">
      <div class="header-left-roomid">
        <span>
          ID:
        </span>
        {{ (getters['room_info'] && getters['room_info'].value && getters['room_info'].value['room_id']) }}
      </div>
      <div class="header-left-roomname visible-xl visible-lg">
        <span>{{ (getters['room_info'] && getters['room_info'].value && getters['room_info'].value['room_name'])
        }}</span>
      </div>
    </div>

    <div class="header-right flex-center">
      <div v-if="Number(getters['my_room_id'].value) === Number(getters['room_id'].value)" :class="[
        'header-right-item',
        'flex-center',
        { 'active-menu': opt.opt4.show },
      ]" @click.stop="openBody(4)">
      <icon name="chat-manage" scale="1.8" class="icon" />
        <span class="visible-xl visible-lg">管理</span>
      </div>
      <div :class="[
        'header-right-item',
        'flex-center',
        { 'active-menu': opt.opt1.show },
      ]" @click.stop="openBody(1)">
        <icon name="chat-online" scale="1.8" class="icon" />
        <span class="visible-xl visible-lg"> 在线[{{ getters['online_user_Num'] }}] </span>
      </div>
      <div :class="[
        'header-right-item',
        'flex-center',
        { 'active-menu': opt.opt2.show },
      ]" @click.stop="openBody(2)">
        <icon name="chat-room" scale="1.8" class="icon" />
        <span class="visible-xl visible-lg">房间[{{ getters['online_room_Num'] }}]</span>
      </div>
      <div :class="[
        'header-right-item',
        'flex-center',
        { 'active-menu': opt.opt3.show },
      ]" @click.stop="openBody(3)">
        <icon name="chat-mine" scale="1.8" class="icon" />
        <span class="visible-xl visible-lg">我的</span>
      </div>
      <div class="header-right-item flex-center" @click="handleLoginout">
        <icon name="chat-left" scale="1.8" class="icon" />
        <span class="visible-xl visible-lg">登出</span>
      </div>
    </div>
    <chat-pop :options="opt.opt1" :top="60" :right="10" :height="450" title="在线用户">
      <OnlineUserList></OnlineUserList>
    </chat-pop>
    <chat-pop :options="opt.opt2" :top="60" :right="10" :height="450" title="房间列表">
      <template v-slot:header>
        <el-button v-if="!isMyRoom" size="small" @click="createOrJoinRoom">{{ BtnText }}</el-button>
      </template>
      <RoomList :createRoom="createRoom" @cancel="handleCreate" @close="closeBody" @createSuccess="handleCreate">
      </RoomList>
    </chat-pop>
    <chat-pop :options="opt.opt3" :top="60" :right="10" :height="450" title="个人信息">
      <PersonInfo></PersonInfo>
    </chat-pop>
    <chat-pop :options="opt.opt4" :top="60" :right="50" title="房间设置">
      <RoomConfig />
    </chat-pop>
  </div>
</template>

<script lang="ts" setup>
import ChatPop from '@/components/chatPop/index.vue';
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import OnlineUserList from './components/OnlineUserList.vue';
import RoomList from './components/RoomList.vue';
import PersonInfo from './components/PersonInfo.vue';
import { useActions, useGetters, useMutations } from '@/utils/hooks/useMap';
import { ElMessage, ElMessageBox } from 'element-plus';
import RoomConfig from './components/RoomConfig.vue';
const opt = reactive({
  opt1: { show: false },
  opt2: { show: false },
  opt3: { show: false },
  opt4: { show: false },
})
const actions = useActions(['getUser', 'loginOut'])
const mutations = useMutations(['setRoomId'])
const getters = useGetters([
  'my_room_id',
  'online_user_Num',
  'online_room_Num',
  'room_id',
  'room_info'
])

//创建或者加入房间
const { proxy } = getCurrentInstance()
const createRoom = ref(false)
function createOrJoinRoom() {
  if (!proxy.$socket.client.connected) {
    return actions['loginOut']()
  }
  if (!getters['my_room_id'].value) {
    return (createRoom.value = true)
  }
  if (Number(getters['my_room_id'].value) === Number(getters['room_id'].value)) {
    return ElMessage({ message: '已经在这个房间里', type: 'warning' })
  }
  mutations['setRoomId'](getters['my_room_id'].value)
  closeBody()

}
//成功回调
async function handleCreate() {
  createRoom.value = false;
  actions['getUser']()
}
function openBody(val) {
  //如果已经打开就关闭
  if (opt[`opt${val}`].show) return (opt[`opt${val}`].show = false)
  // // 先关掉所有
  closeBody()
  // // 再打开
  opt[`opt${val}`].show = !opt[`opt${val}`].show
}
function closeBody() {
  Object.keys(opt).forEach((key) => {
    opt[key].show = false
  })
}

//注销 退出登录
function handleLoginout() {
  ElMessageBox.confirm(
    '确定要退出登录吗！',
    '退出登录',
    {
      confirmButtonText: '确认加入',
      cancelButtonText: '返回',
    }
  )
    .then(() => {
      actions['loginOut']()
    })
    .catch(() => {
      ElMessage({ message: '取消了登出', type: 'info' })
    })
}




const BtnText = computed(() => {
  return !getters['my_room_id'].value ? '创建房间' : '我的房间'
})

const isMyRoom = computed(() => {
  return Number(getters['room_id'].value) === Number(getters['my_room_id'].value)
})
</script>
<style lang="less" scoped>
@import '../../../theme/theme.less';

.header {
  height: 100%;
  padding: 0 15px;
  user-select: none;
  color: @message-text-color;

  &-left {
    &-roomid {
      user-select: none;
      background-color: rgb(0, 255, 221);
      color: @message-text-color;
      display: flex;
      padding: 0 5px;
      font-size: 14px;
      border-radius: 5px;
      margin-right: 5px;
    }

    &-roomname {
      font-size: 18px;
      user-select: none;
      margin-right: 12px;
    }
  }

  &-right {
    &-item {
      padding: 5px 12px;
      font-size: 14px;
      transition: all 0.3s ease;
      color: @message-text-color;
      margin: 0 3px;
      z-index: 100;
      border-radius: 4px;
      cursor: pointer;

      .icon {
        margin-right: 3px;
      }

      &:hover {
        filter: brightness(0.8);
        background: @hover-bgcolor;
      }

      &:active {
        filter: brightness(1.2);
        transform: translateY(2px);
      }
    }

    .active-menu {
      background: #292f45e6;
      border-radius: 5px;
    }

  }

}
</style>