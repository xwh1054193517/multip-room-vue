<template>
  <div class="global-config">
    <el-form label-position="left" label-width="100px">
      <el-form-item label="主题设置">
        <el-radio-group v-model="theme" @change="changeTheme">
          <el-radio style="margin: 4px" label="default" border size="small">默认主题</el-radio>
          <el-radio style="margin: 4px" label="night" border size="small">暗黑主题</el-radio>
          <el-radio style="margin: 4px" label="transparent" border size="small">透明主题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否开启提示">
        <el-switch v-model="showAllTips"></el-switch>
      </el-form-item>
      <el-form-item label="显示进房信息">
        <el-switch v-model="showTipsEnterRoom"></el-switch>
      </el-form-item>
      <el-form-item label="显示退房信息">
        <el-switch v-model="showTipsQuitRoom"></el-switch>
      </el-form-item>
      <el-form-item label="显示切歌信息">
        <el-switch v-model="showTipsSwitchMusic"></el-switch>
      </el-form-item>
      <el-form-item label="显示播放信息">
        <el-switch v-model="showTipsPlayMusic"></el-switch>
      </el-form-item>
      <el-form-item label="显示房间公告">
        <el-switch v-model="showTipsRoomNotice"></el-switch>
      </el-form-item>
      <el-form-item label="清空提示信息">
        <el-button type="danger" size="small" @click="clearTips">清空提示信息</el-button>
        <el-button type="danger" size="small" @click="clearNotice">清空公告信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts"  setup>
import { setThemeStyle } from '@/theme/index';
import { useMutations } from '@/utils/hooks/useMap';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const mutation = useMutations(['clearTips', 'clearNotice', 'setGlobalRoomConfig'])
const clearTips = () => {
  mutation['clearTips']()
}
const clearNotice = () => {
  mutation['clearNotice']()
}
//切换主题
const theme = computed({
  get() {
    return store.state.theme
  },
  set(newValue) {
    return mutation['setGlobalRoomConfig']({ key: "theme", value: newValue })
  }
})
const changeTheme = (val: any) => {
  setThemeStyle(val);
}

//切换设置
// 全部设置
const showAllTips = computed({
  get() {
    return store.state.show_all_tips
  },
  set(newValue) {
    return mutation['setGlobalRoomConfig']({ key: "show_all_tips", value: newValue })
  }
})
//进房提示 
const showTipsEnterRoom = computed({
  get() {
    return store.state.show_join_tip
  },
  set(newValue) {
    return mutation['setGlobalRoomConfig']({ key: "show_join_tip", value: newValue })
  }
})
// 退出提示
const showTipsQuitRoom = computed({
  get() {
    return store.state.show_quit_tip
  },
  set(newValue) {
    return mutation['setGlobalRoomConfig']({ key: "show_quit_tip", value: newValue })
  }
})
// 切歌提示
const showTipsSwitchMusic = computed({
  get() {
    return store.state.show_switchMusic
  },
  set(newValue) {
    return mutation['setGlobalRoomConfig']({ key: "show_switchMusic", value: newValue })
  }
})
// 播放提示
const showTipsPlayMusic = computed({
  get() {
    return store.state.show_playMusic
  },
  set(newValue) {
    return mutation['setGlobalRoomConfig']({ key: "show_playMusic", value: newValue })
  }
})
// 公告提示
const showTipsRoomNotice = computed({
  get() {
    return store.state.show_roomNotice
  },
  set(newValue) {
    return mutation['setGlobalRoomConfig']({ key: "show_roomNotice", value: newValue })
  }
})

// 清除提示

</script>
<style lang="less" scoped>
.global-config {
  padding: 0 15px;
  width: 100%;
  height: 100%;
}
</style>
