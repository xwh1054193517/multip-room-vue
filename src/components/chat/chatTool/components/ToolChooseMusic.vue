<template>
  <div v-loading="loading" class="chooseMusic">
    <div class="chooseMusic-header">
      <input v-model="param.keyword" type="text" />
      <div class="chooseMusic-header-search" @click="searchSong">搜索</div>
    </div>
    <div class="chooseMusic-body">
      <div v-if="!showMusicList" class="chooseMusic-body-empty">
        <span class="notice">输入关键字搜索歌曲</span>
      </div>

      <div v-if="showMusicList" class="chooseMusic-body-content">
        <div v-for="(item, index) in musicList" :key="item.music_mid" class="music">
          <img v-if="item.music_albumPic" :src="item.music_albumPic" :alt="item.music_album" :title="item.music_album"
            class="music-image" />
          <img v-else :src="imgFail" :alt="'暂无图片'" :title="'暂无图片'" class="music-image" />
          <div class="music-info">
            <div class="music-info-name">{{ item.music_name }}</div>
            <div class="music-info-singer">歌手：{{ item.music_singer }} 专辑:{{ item.music_album }}</div>
          </div>
          <div class="music-btn" @click="chooseMusic(item)">
            点歌
          </div>
          <div class="music-btn" @click="collectSong(item)">
            收藏
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addCollect, getDaily, getHot, search } from '@/api/music';
import { Config } from '@/config';
import { useGetters } from '@/utils/hooks/useMap';
import { ElMessage } from 'element-plus';
import { getCurrentInstance, reactive, ref, watch } from 'vue';
const imgFail = Config.imgFail
const showMusicList = ref(false)
const loading = ref(false)
const getters = useGetters(['room_admin_id'])
const musicList = ref(null)
//搜索歌曲
const param = reactive({
  keyword: ""
})

async function searchSong() {
  if (!param.keyword) return
  loading.value = true
  const res = await search(param)
  loading.value = false
  musicList.value = res.data
  showMusicList.value = true
}

//点歌
const { proxy } = getCurrentInstance()
function chooseMusic(music) {
  proxy.$socket.client.emit('chooseMusic', music)
}

//收藏歌曲
async function collectSong(music) {
  try {
    await addCollect(music)
    ElMessage({ message: "收藏歌曲成功", type: 'success' })
  } catch (error) {
  }


}

// async function getHotMusic() {
//   loading.value = true
//   const res = await getHot({ user_id: getters["room_admin_id"].value })
//   loading.value = false
//   musicList.value = res.data
//   showMusicList.value = true
// }
// getHotMusic()

async function getDailyRecommend() {
  loading.value = true
  const res = await getDaily()
  loading.value = false
  musicList.value = res.data.songlist
  showMusicList.value = true
}
getDailyRecommend()
</script>
<style lang="less" scoped>
.chooseMusic {
  padding: 0 15px;
  border-top: 1px solid #fff;

  &-header {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    font-size: 14px;
    color: rgba(233, 232, 232, 0.882);
    border-radius: 5px;
    margin: 8px 0;
    border: 1px solid rgba(169, 169, 169, 0.756);

    input {
      padding: 5px 15px;
      flex: 1;
      font-size: 14px;
      outline: none;
      border: none;
      background: transparent;
      color: aliceblue;

      &::placeholder {
        color: #ccc;
        font-size: 14px;
      }
    }

    &-search {
      padding: 5px 16px;
      border-left: 1px solid #ccc;
      user-select: none;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        filter: brightness(0.8);
      }

      &:active {
        filter: brightness(1.2);
        transform: scale(1.2);
        border-left: 1px solid transparent;
      }
    }
  }

  &-body {
    height:400px;
    user-select: none;
    overflow: hidden;
    overflow-y: auto;

    &-empty {
      padding: 25px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .notice {
        user-select: none;
        color: rgb(198, 198, 198);
        font-size: 20px;
      }
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
        color: aliceblue;

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
        color: aliceblue;
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
}
</style>