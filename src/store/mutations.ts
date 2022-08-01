import { clearToken, setToken } from "@/utils/auth"
import { getDefault } from "./state"

export default {
  //重制store
  resetStore(state) {
    Object.assign(state, getDefault())
  },

  setSignInPopup(state, isShow) {
    state.showSignInPopup = isShow;
  },

  setSignUpPopup(state, isShow) {
    state.showSignUpPopup = isShow;
  },

  /*--------------用户 信息---------------*/
  setToken(state, token) {
    state.token = token
    setToken(token)
  },

  removeToken(state) {
    state.token = null,
      clearToken()
  },

  setUserInfo(state, user_info) {
    state.user_info = user_info
  },

  setOnlineUserList(state, online_user_list) {
    state.online_user_list = online_user_list
  },

  /*--------------房间信息---------------*/
  setRoomList(state, room_list) {
    state.room_list = room_list
  },

  setRoomId(state, room_id) {
    state.room_id = room_id
  },

  setRoomInfo(state, room_info) {
    state.room_info = room_info
  },

  setRoomAdmin(state, room_admin) {
    state.room_admin = room_admin
  },


  /*--------------音乐信息---------------*/
  setVolume(state, volume) {
    state.music_volume = volume
    localStorage.setItem('volume', volume)
  },

  setCurrentMusicInfo(state, currentMusicInfo) {
    const { music_info, music_src, music_lrc, music_downloadSrc } = currentMusicInfo
    state.music_info = music_info,
      state.music_src = music_src,
      state.music_lrc = music_lrc,
      state.music_downloadSrc = music_downloadSrc
  },

  setMusicStartTime(state, music_start_time) {
    state.music_start_time = music_start_time
  },

  setMusicCurrentTime(state, music_current_time) {
    state.music_current_time = music_current_time
  },

  setMusicQueueList(state, music_queue_list) {
    state.music_queue_list = music_queue_list
  },

  /*--------------消息信息---------------*/
  emptyMessageList(state) {
    state.message_list = []
  },

  setMessageList(state, message_info) {
    const isArr = Array.isArray(message_info)
    let result = []
    //是数组 的话 就是上拉刷新 要加到前面去
    isArr && (result = [...message_info, ...state.message_list])
    !isArr && (result = [...state.message_list, ...[message_info]])
    state.message_list = state.show_all_tips ? result : result.filter(k => k.message_type !== 'info')
  },

  clearTips(state) {
    state.message_list = state.message_list.filter(k => k.message_type !== 'info')
  },

  clearNotice(state) {
    state.message_list = state.message_list.filter(k => k.message_type !== 'notice')
  },

  updateMessageList(state, { id, msg }) {
    const hasMessage = state.message_list.findIndex(k => k.id === id)
    hasMessage !== -1 && (state.message_list[hasMessage].message_content = msg)
    hasMessage !== -1 && (state.message_list[hasMessage].message_type = 'info')
    state.message_list.forEach(k => {
      if (k?.quote_info?.quote_message_id === id) {
        k.quote_info.quote_message_statue = 2
      }
    });
  },

  setUnReadMsgNum(state, unReadMsgNum) {
    state.unReadMsgNum = unReadMsgNum;
  },

  setGlobalRoomConfig(state, { key, value }) {
    state[key] = value;
    localStorage.setItem(key, typeof value === 'boolean' ? JSON.stringify(value) : value);
  }
}