<template>
  <div class="queue-music">
    <div v-if="!music_list" class="queue-music-empty">
      <icon name="choose-music-empty" scale="16" class="icon" />
      <span class="notice">你还没有收藏过歌曲</span>
    </div>

    <div v-else class="queue-music-content">
      <div v-for="(item, index) in music_list" :key="item.music_mid" class="music">
        <img v-if="item.music_albumPic" :src="item.music_albumPic" :alt="item.music_album" :title="item.music_album"
          class="music-image" />
        <img v-else :src="imgFail" :alt="'暂无图片'" :title="'暂无图片'" class="music-image" />
        <div class="music-info">
          <div class="music-info-name">{{ item.music_name }}</div>
          <div class="music-info-singer">歌手：{{ item.music_singer }} 专辑:{{ item.music_album }}</div>
        </div>
        <div class="music-btn" @click="chooseMusic(item)">
          <icon name="choose-music-play" scale="1.6" class="icon" />
          点歌
        </div>
        <div class="music-btn" @click="removeSong(item)">
          <icon name="queue-music-del" scale="1.6" class="icon" />
          移除
        </div>
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { getCollect, removeCollect } from '@/api/music';
import { Config } from '@/config';
import { ElMessage } from 'element-plus';
import { getCurrentInstance, ref } from 'vue';
const imgFail = Config.imgFail
//点歌
const { proxy } = getCurrentInstance()
function chooseMusic(music) {
  proxy.$socket.client.emit('chooseMusic', music)
}

//移除房间歌单
async function removeSong(music) {
  const { music_mid } = music
  if (!music_mid) return
  await removeCollect({ music_mid })
  ElMessage({ message: "移除歌曲成功", type: "success" })
  getOwnCollect()
}

//获得收藏歌曲列表
const music_list = ref(null)
async function getOwnCollect() {
  const res = await getCollect()
  music_list.value = res.data
}
getOwnCollect()
</script>

<style lang="less" scoped>
@import '../../../../theme/theme.less';
.icon{
  margin-right: 5px;
}
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
    border-top: 1px solid @message-border;

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
      border: 1px solid @message-border;
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