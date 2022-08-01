import { getRoomDetail } from "@/api/chatting"
import { getUserInfo } from "@/api/user"
import router from "@/router"

export default {
  //获取用户信息
  async getUser({ commit }) {
    const res = await getUserInfo()
    const { user_info } = res.data
    // console.log(res.data);
    commit('setUserInfo', user_info)
  },

  //获取当前房间信息
  async getCurrentRoom({ commit, state }) {
    const res = await getRoomDetail({ room_id: state.room_id })
    commit('setRoomInfo', res.data)  
  },

  //退出登录
  async loginOut({ commit }) {
    return new Promise<void>((resolve) => {
      commit('removeToken')
      commit('resetStore')
    
      router.replace('/login')
      resolve()
    })
  }
}