<template>
  <div class="music-player">
    <audio ref="music" :src="music_src" autoplay @timeupdate="updatetime" muted></audio>
  </div>
</template>

<script lang="ts" setup>
import { useMutations } from '@/utils/hooks/useMap';
import { ElMessage } from 'element-plus';
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const music_src = computed(() => store.state.music_src)
const music_volume = computed(() => store.state.music_volume)
const music_start_time = computed(() => store.state.music_start_time)


const music = ref(null)
const mutation = useMutations(['setMusicCurrentTime'])

const time = ref(null)
watch(music_start_time, (n, o) => {
  time.value = n
  setMusicStarttime(n)
},
  {
    immediate: true
  })

watch(music_volume, (n, o) => {
  music && (music.value.volume = n)
})


//用户进入房间设置后台服务音乐播放的位置
function setMusicStarttime(startTime) {
  nextTick(() => {
    if (music.value?.fastSeek) {
      music.fastSeek(startTime);
    } else {
      music.value.currentTime = startTime;
      music.value.volume = music_volume.value
      //部分浏览器需要静音才能播放
      music.value.muted = false
      // music.value.play();
    }
  })
}

//音乐播放时把当前播放位置的时间传给全局，用于实时显示歌词
function updatetime(e) {
  mutation['setMusicCurrentTime'](e.target.currentTime)
}

const isPlay = ref(false)

function handlerTouchPlay() {
  if (!isPlay.value && time.value && music.value) {
    music.value.currentTime = time.value;
    music.value.play();
    isPlay.value = true;
    document.removeEventListener("touchstart", handlerTouchPlay);
  }
}

const { proxy } = getCurrentInstance()
const music_info = computed(() => store.state.music_info || {})
function handleError(e) {
  ElMessage({ message: '获取音乐出错,自动下一首', type: 'error' })
}
// onMounted(() => {
//   // document.addEventListener("touchstart", handlerTouchPlay, false);
//   music.value.addEventListener('error', handleError, false)
// })

// onBeforeUnmount(() => {
//   music.value.removeEventListener('error', handleError)
// })
</script>
