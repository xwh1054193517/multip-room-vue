<template>
  <div class="music-player">
    <audio ref="music" :src="music_src" autoplay @timeupdate="updatetime" muted></audio>
  </div>
</template>

<script lang="ts" setup>
import { useMutations } from '@/utils/hooks/useMap';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const music_src = computed(() => store.state.music_src)
const music_start_time = computed(() => store.state.music_start_time)


const music = ref(null)
const mutation = useMutations(['setMusicCurrentTime'])

const time = ref(null)
watch(music_start_time, (n, o) => {
  console.log(music_start_time.value, n);
  time.value = n
  setMusicStarttime(n)
})

//用户进入房间设置后台服务音乐播放的位置
function setMusicStarttime(startTime) {
  nextTick(() => {
    if (music.value?.fastSeek) {
      music.fastSeek(startTime);
    } else {
      music.value.currentTime = startTime;
      //部分浏览器需要静音才能播放
      music.value.muted = false
      music.value.play();
    }
  })
}

//音乐播放时把当前播放位置的时间传给全局，用于实时显示歌词
function updatetime(e) {
  mutation['setMusicCurrentTime'](e.target.currentTime)
}

function handlerTouchPlay() {
  if (!this.isPlay && this.time && this.$refs.music) {
    this.$refs.music.currentTime = this.time;
    this.$refs.music.play();
    this.isPlay = true;
    document.removeEventListener("touchstart", handlerTouchPlay);
  }
}
onMounted(() => {
  document.addEventListener("touchstart", handlerTouchPlay, false);
})
</script>
