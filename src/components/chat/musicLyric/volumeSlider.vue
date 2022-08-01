<template>
  <div class="slider">
    <el-slider v-model="music_volume" vertical height="150px" size="small" @input="changeVolume" />
  </div>
</template>
<script lang="ts" setup>

import { useMutations } from '@/utils/hooks/useMap';
import { ref, watch } from 'vue';
let music_volume = ref(Number(localStorage.getItem('volume')) * 100 || 50)
watch(music_volume, () => {
  changeVolume()
})
const mutation = useMutations(['setVolume'])
const changeVolume = () => {
  mutation['setVolume'](music_volume.value / 100)
}
</script>

<style lang="less" scoped>
.slider {
  padding: 20px 0px;
}
</style>