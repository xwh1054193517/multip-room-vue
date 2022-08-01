<template>
  <div class="onlineUser">
    <div v-for="(item, index) in online_user_list" :key="index"
      :class="['onlineUser-item', { current: fineMyself(item.id) }]">
      <img class="onlineUser-item-avatar" :src="item && item.user_avatar" />
      <div class="onlineUser-item-info">
        <div class="onlineUser-item-info-name">
          <span>{{ item.user_nickname }}</span>
          <span v-if="item.id === room_admin_id || item.user_role === 'admin'" class="role" :style="{
            backgroundColor: (item.user_role === 'admin' ? '#fa6819' : '#701ec9'),
          }">
            {{ item.user_role === "admin" ? "超级管理员" : "房主" }}
          </span>
        </div>
        <div class="onlineUser-item-info-sign">
          {{ item.user_signature }}
        </div>
      </div>
    </div>
  </div>
</template>
<script  lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const room_admin_id = computed(() => store.getters.room_admin_id)
const my_id = computed(() => store.getters.my_id)
const online_user_list = computed(() => store.getters.online_user_list)
function fineMyself(id) {
  return my_id.value === id
}
</script>
<style lang="less" scoped>
@import '../../../../theme/theme.less';
.current {
  border-right-color: #ff09eb73 !important;
}

.onlineUser {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;

  &-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    border-top: 1px solid @message-border;
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
      }

      &-sign {
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