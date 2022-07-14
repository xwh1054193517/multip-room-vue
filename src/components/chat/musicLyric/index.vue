<template>
  <div class="lrc">
    <span class="lrc-text">
      <!-- icon -->
      {{ lrc || '加载歌词中' }}
    </span>
    <!-- icon -->
    <!-- drawer -->
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { parseLyric } from '@/utils/tools'
import { useStore } from 'vuex';
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
</script>

<style lang="less" scoped>
.lrc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  color: aliceblue;
  padding: 7px 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &-text {
    flex: 1
  }
}
</style>