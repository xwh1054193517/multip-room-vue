export default {
  room_admin: state => state.room_admin,
  room_admin_id: state => state.room_admin.id,
  room_list: state => state.room_list,
  room_id: state => state.room_id,
  room_info: state => state.room_list.find(t => t.room_id == state.room_id),

  my_room_bg: state => state.user_info && state.user_info.user_room_bg,
  my_room_id: state => state.user_info && state.user_info.user_room_id,
  my_id: state => state.user_info && state.user_info.user_id,

  online_user_list: state => state.online_user_list,
  online_user_Num: state => state.online_user_list.length,
  online_room_Num: state => state.room_list.length,

  user_info: state => state.user_info,

  message_list: state => state.message_list,
  music_queue_list: state => state.music_queue_list
}