<template>
  <div class="queue-music">
    <div v-if="!music_queue_list.length" class="queue-music-empty">
      <icon name="empty" scale="16" style="margin-bottom:20px;" />
      <span class="notice">当前房间还没人点歌</span>
    </div>

    <div v-else class="queue-music-content">
      <div v-for="(item, index) in music_queue_list" :key="item.music_mid" class="music">
        <img v-if="item.music_albumPic" :src="item.music_albumPic" :alt="item.music_album" :title="item.music_album"
          class="music-image" />
        <img v-else :src="imgFail" :alt="'暂无图片'" :title="'暂无图片'" class="music-image" />
        <div class="music-info">
          <div class="music-info-name">{{ item.music_name }}</div>
          <div class="music-info-singer">歌手：{{ item.music_singer }} 专辑:{{ item.music_album }}</div>
        </div>
        <div class="music-btn" @click="upMusic(item)">
          <icon name="queue-music-up" scale="1.6" style="margin-right:3px;" />顶歌
        </div>
        <div class="music-btn" @click="removeSong(item)">
          <icon name="queue-music-del" scale="1.6" style="margin-right:3px;" />
          移除
        </div>
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { Config } from '@/config';
import { computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const music_queue_list = computed(() => store.state.music_queue_list)
const imgFail = Config.imgFail
const { proxy } = getCurrentInstance()

function upMusic(music) {
  proxy.$socket.client.emit("upMusic", music)
}

//移除房间歌单
function removeSong(music) {
  proxy.$socket.client.emit("removeMusic", music)
}
</script>

<style lang="less" scoped>
@import '../../../../theme/theme.less';

.queue-music {
  padding: 10px 15px;

  &-empty {
    margin-top: 30px;
    padding: 25px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .notice {
      user-select: none;
      color: @message-text-color;
      font-size: 20px;
    }
  }

  &-content {
    height: auto;
    overflow: hidden;
    overflow-y: auto;
  }

  .music {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-top: 1px solid #eee;

    &-image {
      width: 50px;
      height: 50px;
      border-radius: 10px;
    }

    &-info {
      display: flex;
      flex-direction: column;
      margin-left: 8px;
      flex: 1;
      width: 0;
      color: @message-text-color;

      &-name {
        font-size: 16px;
        font-weight: 600;
      }

      &-singer {
        font-size: 12px;
      }
    }

    &-btn {
      user-select: none;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: @message-text-color;
      border: 1px solid #eee;
      margin: 0 3px;
      transition: all 0.3s ease;

      &:hover {
        filter: brightness(0.8);
      }

      &:active {
        filter: brightness(1.2);
        transform: translateY(2px);
        color: rgb(182, 177, 177);
      }
    }
  }
}
</style>