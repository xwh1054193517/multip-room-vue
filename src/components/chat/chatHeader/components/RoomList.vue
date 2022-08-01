<template>
  <div class="onlineRoom">
    <div v-for="(item, index) in room_list" :key="index"
      :class="['onlineRoom-item', { current: item.room_id === room_id }]" @click="handlerJoinRoom(item)">
      <img class="onlineRoom-item-avatar" :src="item.room_avatar" />
      <div class="onlineRoom-item-info">
        <div class="onlineRoom-item-info-name">
          <span>
            <span class="room_num">({{ item.on_line_nums }})</span>
            {{ item.room_name }}
          </span>

          <!-- 房间是否加密 -->
          <span v-if="item.room_need === 2" class="lock">
            lock
          </span>
        </div>
        <div class="onlineRoom-item-info-notice">
          {{ item.room_notice }}
        </div>
      </div>
    </div>
  </div>
</template>
<script  lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const room_list = computed(() => store.getters.room_list)
const room_id = computed(() => store.getters.room_id)
const my_id = computed(() => store.getters.my_id)
function handlerJoinRoom(item) {

}
</script>
<style lang="less" scoped>
@import '../../../../theme/theme.less';

.current {
  border-right-color: #ff09eb73 !important;
}

.onlineRoom {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;

  &-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    padding: 5px;
    padding-left: 8px;
    position: relative;

    &:hover {
      border-left: 3px solid #19c6fa;
    }

    &-avatar {
      width: 50px;
      height: 50px;
      border-radius: 5px;
      margin-right: 10px;
    }

    &-info {
      display: flex;
      flex-direction: column;
      flex: 1;

      &-name {
        font-size: 15px;
        color: @message-text-color;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .role {
          font-size: 12px;
          padding: 1px 5px;
          margin-right: 2px;
          border-radius: 4px;
          color: bisque;
        }

        .room_num {
          margin-right: 5px;
          color: rgb(238, 230, 7);
        }
      }

      &-notice {
        font-size: 13px;
        margin-top: 6px;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ccc;
      }
    }
  }
}
</style>