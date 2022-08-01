<template>
  <div class="progress" v-if="music_info">
    <div class="progress-bar" :style="{ width: `${width}%` }"></div>
    <div class="currentMusic">
      <icon name="progress-music" class="icon shouldRound" scale="2" />
      <span class="music">{{ music_info.music_name }} - {{ music_info.music_singer }}</span>
      <icon name="progress-collect" class="icon" scale="2.2" @click.native="collectMusic" />
      <icon name="progress-switch" class="icon" scale="2.5"
        @click.native="$socket.client.emit('nextMusic', music_info)" />
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

const collectMusic = () => {

}
</script>
<style lang="less" scoped>
@import '../../../theme/theme.less';

.icon {
  transition: all 0.3s;
  margin-right: 6px;
  cursor: pointer;

  &:nth-child(3) {
    margin-left: 5px;
  }

  &:nth-child(3),
  &:nth-child(4) {

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      color: #fbc2eb;
    }
  }
}

.btn {
  font-size: 5px;

}

.progress {
  width: 100%;
  height: 2px;
  position: relative;
  background: @message-border;

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
      max-width: 300px
    }
  }
}

.shouldRound {
  transition: all 7s linear;
  animation: turnRound 7s linear infinite;
}

@keyframes turnRound {
  0% {
    transform: rotate(0);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>