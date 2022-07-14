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
const music_src = computed(() => store.state.music_src )
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

//用户进入房间设置后台服务音乐播放的位置
function setMusicStarttime(startTime) {
  nextTick(() => {
    if (music.value?.fastSeek) {
      music.fastSeek(startTime);
    } else {
      music.value.currentTime = startTime;
      music.value.volume = 0.5
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

function handleError(e) {
  console.log(e);

}
onMounted(() => {
  document.addEventListener("touchstart", handlerTouchPlay, false);
  music.value.addEventListener('error', handleError, false)
})
</script>
