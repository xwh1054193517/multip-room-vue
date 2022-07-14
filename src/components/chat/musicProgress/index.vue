<template>
  <div class="progress" v-if="music_info">
    <div class="progress-bar" :style="{ width: `${width}%` }"></div>
    <div class="currentMusic">
      <!-- icon -->
      <span class="music">
        {{ music_info.music_name }} - {{ music_info.music_singer }}
      </span>
      <button class="btn" @click="$socket.client.emit('nextMusic',music_info)">下一首</button>
      <!-- icon -->
      <!-- icon -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const music_current_time = computed(() => store.state.music_current_time || null)
const music_info = computed(() => store.state.music_info || {})
const width = computed(() =>
  ((Number(music_current_time.value) / Number(music_info.value.music_duration)) * 100).toFixed(2)
)

</script>
<style lang="less" scoped>
.btn{
  font-size: 5px;

}
.progress {
  width: 100%;
  height: 2px;
  position: relative;

  &-bar {
    height: 2px;
    background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
  }

  .currentMusic {
    position: absolute;
    right: 0;
    height: 5px;
    top: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    color: #7891dc98;
    z-index: 2;

    @media screen and (max-width:640px) {
      top: -18px !important;
      right: 8px;
    }

    .music {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      letter-spacing: 1px;
      max-width:300px
    }
  }
}
</style>