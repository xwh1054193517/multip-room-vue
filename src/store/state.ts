export function getDefault() {
  return {
    token: null,
    user_info: null,
    pre_img: null,

    room_list: [],
    room_id: 555,
    room_admin: null,
    room_info: null,

    online_user_list: [],
    message_list: [],

    music_info: null,
    music_lrc: null,
    music_src: null,
    music_downloadSrc: null,
    music_start_time: null,
    music_current_time: null,
    music_queue_list: [],

    show_all_tips: true,
    show_join_tip: true,
    show_quit_tip: true,
    show_switchMusic: true,
    show_playMusic: true,
    show_roomNotice: true,
    theme: 'default'
  }
}

export const state = getDefault()
