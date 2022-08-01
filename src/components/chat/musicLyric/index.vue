<template>
  <div class="lrc">
    <span class="lrc-text">
      <Icon name="bottom-music" class="icon  dance" scale="1.8" />
      {{ lrc || '加载歌词中' }}
    </span>
    <div class="volume">
      <el-dropdown trigger="click" placement="top" size="small" :hide-on-click="false">
        <icon name="bottom-volume" class="icon" scale="2.5" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <VolumeSlider />
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <icon name="chat-header-setting" scale="1.8" class="icon" @click="drawer = true" />
    <el-drawer v-model="drawer" size="auto" append-to-body>
      <GlobalCfg />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { parseLyric } from '@/utils/tools'
import { useStore } from 'vuex';
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElDrawer } from 'element-plus';
import VolumeSlider from './volumeSlider.vue';
import GlobalCfg from '../../globalCfg/index.vue';
const store = useStore()
const music_lrc = computed(() => store.state.music_lrc || null)
const music_current_time = computed(() => store.state.music_current_time || null)
const lrcArray = computed(() => {
  return music_lrc.value && parseLyric(music_lrc.value);
})

const lrc = computed(() => {
  let res = []
  if (lrcArray.value) {
    res = lrcArray.value.filter((t) => {
      return t[0] < music_current_time.value
    })
  }
  return res.length && res[res.length - 1][1]
})

const drawer = ref(false)
</script>

<style lang="less" scoped>
@import '../../../theme/theme.less';

.icon {
  margin-right: 5px;
  cursor: pointer;
  z-index: 2;
}

.volume {
  position: relative;
}

.slider-demo-block {
  display: flex;
  position: absolute;
  align-items: center;
  top: 0;
  left: 0;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.lrc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  color: @message-text-color;
  padding: 7px 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &-text {
    flex: 1
  }
}

.dance {
  animation: textDance 2s linear infinite forwards;
}

@keyframes textDance {
  25% {
    transform: translateY(2px);
  }

  50% {
    transform: translateY(0px);
  }

  75% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0px);
  }

}
</style>