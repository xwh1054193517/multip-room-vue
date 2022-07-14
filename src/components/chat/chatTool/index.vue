<template>
  <div class="toolbar">
    <chat-pop :options="opt.opt1" :bottom="55" :left="10" :width="500" :height="400" title="点歌平台">
      <ToolChooseMusic></ToolChooseMusic>
    </chat-pop>
    <chat-pop :options="opt.opt2" :bottom="55" :left="10" :width="500" :height="400" title="房间歌单">
      <ToolQueueList></ToolQueueList>
    </chat-pop>
    <chat-pop :options="opt.opt3" :bottom="55" :left="10" :width="500" :height="400" title="我的收藏">
      <ToolCollect></ToolCollect>
    </chat-pop>
    <div class="toolbar-content">
      <div :class="['toolbar-content-item', ' flex_center', { 'active-menu': opt.opt1.show }]"
        @click.stop="openBody(1)">
        点歌
      </div>
      <div :class="['toolbar-content-item', ' flex_center', { 'active-menu': opt.opt2.show }]"
        @click.stop="openBody(2)">
        歌单
      </div>
      <div :class="['toolbar-content-item', ' flex_center', { 'active-menu': opt.opt3.show }]"
        @click.stop="openBody(3)">
        收藏
      </div>
    </div>
    <div class="toolbar-takeplace"></div>
  </div>
</template>

<script lang="ts" setup>
import ChatPop from '@/components/chatPop/index.vue';
import ToolChooseMusic from './components/ToolChooseMusic.vue';
import ToolQueueList from './components/ToolQueueList.vue';
import ToolCollect from './components/ToolCollect.vue';
import { reactive } from 'vue';
// const opt1 = reactive({ show: false })
// const opt2 = reactive({ show: false })
// const opt3 = reactive({ show: false })
const opt = reactive({
  opt1: { show: false },
  opt2: { show: false },
  opt3: { show: false },
})
//
function openBody(val) {
  //如果已经打开就关闭
  if (opt[`opt${val}`].show) return (opt[`opt${val}`].show = false)
  // // 先关掉所有
  closeBody()
  // // 再打开
  opt[`opt${val}`].show = !opt[`opt${val}`].show
}
function closeBody() {
  Object.keys(opt).forEach((key) => {
    opt[key].show = false
  })
}
</script>
<style lang="less" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  position: relative;
  color: #999;

  .active-menu {
    background: #292f45e6
  }

  &-content {
    display: flex;
    font-size: 1rem;
    &-item {
      user-select: none;
      margin-right: 5px;
      padding: 5px 10px;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      transition: all 0.4s;

      &:nth-child(1) {
        margin-left: 15px;
      }

      &:hover {
        background: #292f45e6;
      }

    }
  }
}
</style>