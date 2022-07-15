<template>
  <div id="message-box" class="message-container">
    <div v-for="(item, index) in message_list" :key="index" :class="['message-container-item', setMsgClass(item)]">
      <!-- notice信息 -->
      <span v-if="item.message_type === 'notice'" class="notice-container">
        <div class="notice-container-header">
          <span class="title">房间公告</span>
        </div>
        <div>{{ item.message_content }}</div>
      </span>

      <!-- info信息 -->
      <span v-if="item.message_type === 'info'" class="info-item">
        {{ item.message_content }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const message_list: any = computed(() => store.state.message_list)
const my_id = computed(() => store.getters.my_id)
function setMsgClass(item) {
  const { user_id, message_type } = item
  if (!['info', 'notice'].includes(message_type)) {
    return user_id === my_id.value ? 'mine' : 'other'
  }
  return message_type
}

</script>
<style lang="less" scoped>
.message-container {
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: scroll;
  // overflow: overlay;
  display: flex;
  flex-direction: column;
  position: relative;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: block;
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 1em;
    background-color: rgba(50, 50, 50, 0.3);
  }

  &::-webkit-scrollbar-track {
    border-radius: 1em;
    background-color: rgba(50, 50, 50, 0.1);
  }

  &-item {
    display: flex;
    margin: 7px 0;
  }

  .info {
    justify-content: center;

    &-item {
      font-size: 12px;
      color: rgb(243, 243, 248);
      display: inline-block;
      background-color: #484848;
      padding: 2px 10px;
      border-radius: 4px;
      max-width: 500px;
    }
  }

  .notice {
    justify-content: center;

    &-container {
      text-align: left;
      min-width:200px;
      max-width: 500px;
      background: #484848;
      padding: 10px 15px;
      border-radius: 10px;
      color: #999;
      font-size: 13px;
      display: flex;
      flex-direction: column;
      letter-spacing: 3px;

      &-header {
        display: flex;

        .title {
          font-size: 16px;
          color: #1295dd;
          display: inline-block;
          border-bottom: 2px dotted #1295dd;
          margin-bottom: 10px;
          padding-bottom: 5px;
        }
      }
    }
  }
}
</style>