<template>
  <div id="message-box" class="message-container">
    <div v-for="(item, index) in message_list" :key="index" :class="['message-container-item', setMsgClass(item)]"
      :ref="`message__${item.id || -1}`">
      <span v-if="!otherMsgType.includes(item.message_type)" class="message-container-item-info">
        <el-dropdown trigger="click" placement="bottom" size="mini" @command="handlerMessageCommand($event, item)">
          <div class="info-box">
            <span class="name">
              {{ item.user_info && item.user_info.user_nickname }}
            </span>

            <!-- 文字 -->
            <span v-if="item.message_type === 'text' && !isUrl(item.message_content)"
              :class="['message', setTextClass(item)]" v-html="item.message_content"></span>
            <!-- 链接 -->
            <a v-if="item.message_type === 'text' && isUrl(item.message_content)" href="item.message_content"
              target="_blank" :class="['message', 'msg-url']" @click.stop>{{ item.message_content }}</a>

            <!-- 图片 -->
            <span v-if="imgMsgType.includes(item.message_type)" class="msg-img">
              <img :ref="`img__${item.id}`" :src="item.message_content.url" />
            </span>

            <!-- 非图片文件 -->
            <span v-if="otherFileType(item.message_type)" class="msg-other">
              <div class="msg-other-container">
                <div class="file-info">
                  <span class="file-info-name">{{
                      item.message_content.name
                  }}</span>
                  <span class="file-info-size">{{
                      item.message_content.size
                  }}</span>
                </div>
              </div>
            </span>

            <!-- 引用消息 -->
            <span v-if="item.quote_info"
              :class="['quote-box', { callback: item.quote_info.quote_message_statue === 2 }]"
              @click.stop="gotoQuoteMsg(item.quote_info.quote_message_id)">
              <span v-if="item.quote_info.quote_message_statue === 1">{{ item.quote_info.quote_user_nickname
              }}&nbsp;:&nbsp; </span>
              <span v-if="item.quote_info.quote_message_statue === 2">该消息已经被撤回</span>
              <!-- 文字消息引用 -->
              <span v-if="
              item.quote_info.quote_message_type === 'text' &&
              item.quote_info.quote_message_statue === 1">
                {{ item.quote_info.quote_message_content }}
              </span>

              <!-- 图片引用 -->
              <img v-if="
                imgMsgType.includes(item.quote_info.quote_message_type) &&
                item.quote_info.quote_message_statue === 1
              " :src="item.quote_info.quote_message_content.url" class="quote-box-img" />

              <!-- 其他文件引用 -->
              <span
                v-if="otherFileType(item.quote_info.quote_message_type) && item.quote_info.quote_message_statue === 1"
                class="msg-other quote-box-other">
                <div class="msg-other-container">
                  <div class="file-info">
                    <span class="file-info-name">{{
                        item.quote_info.quote_message_content.name
                    }}</span>
                    <span class="file-info-size">{{
                        item.quote_info.quote_message_content.size
                    }}</span>
                  </div>
                </div>
              </span>
            </span>
            <span class="time">{{ formatTime(item.createdAt) }}</span>
          </div>
          <template #dropdown>
            <span>
              <el-dropdown-menu>
                <el-dropdown-item command="1">
                  <el-icon>
                    <ChatLineRound />
                  </el-icon>引用消息
                </el-dropdown-item>
                <el-dropdown-item v-if="item.user_info.id === my_id || item.user_info.user_id === my_id" command="2">
                  <el-icon>
                    <Delete />
                  </el-icon>撤回消息
                </el-dropdown-item>
                <el-dropdown-item v-if="otherFileType(item.message_type)"
                  command="3">
                  <el-icon>
                    <Download />
                  </el-icon>下载文件
                </el-dropdown-item>
              </el-dropdown-menu>
            </span>
          </template>
        </el-dropdown>
        <img v-if="item.user_info" class="avatar" :src="item.user_info.user_avatar" />
        <img v-if="!item.user_info" class="avatar" :src="errAvatar" />
      </span>
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
    <div id="panel" ref="end"></div>
  </div>
</template>

<script lang="ts" setup>
import { Config } from '@/config';
import { formatTime } from '@/utils/tools';
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage, } from 'element-plus';
import { ChatLineRound, Delete, Download } from '@element-plus/icons-vue'
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { scrollBottom } from '@/utils/scrolltoBottom';
import { useMutations, useState } from '@/utils/hooks/useMap';
import { getFile } from '@/utils/upload';
const store = useStore()
const message_list: any = computed(() => store.state.message_list)
const my_id = computed(() => store.getters.my_id)
const otherMsgType = ref(["notice", "info"])
const imgMsgType = ref(['jpg', 'png', 'gif', 'jpeg'])
const errAvatar = Config.imgFail
const instance: any = getCurrentInstance()
const isVisible = ref(true)
const mutation = useMutations(['setUnReadMsgNum'])
const state = useState(['unReadMsgNum'])

watch(message_list, (n, o) => {

  if (!n.length) return
  const isAMsg = n.length - o.length === 1
  const lastNodeId = o.length > 10 ? o[0].id : 0

  //既不是在可视区域 也不 止一条消息 上拉刷新 
  if (!isVisible.value && !isAMsg) {
    nextTick(() => {
      instance.refs[`message__${lastNodeId}`] && (instance.refs[`message__${lastNodeId}`][0].scrollIntoView({ behavior: "smooth" }))
    })
  }
  //在可视区域就拉到最底部 不在就设置未读
  const params = isAMsg ? { animation: true } : {}
  isVisible.value && nextTick(() => scrollBottom(params));
  !isVisible.value && isAMsg && mutation['setUnReadMsgNum'](state['unReadMsgNum'].value + 1)
})


const emit = defineEmits(['quoteMsg', 'loadMoreHistory'])
//可视区域判断
function scrollToTop() {
  const el: any = document.querySelector(`#message-box`);
  const { scrollTop } = el;
  const { scrollHeight } = el;

  //el.offsetHeight可视区域高度
  //scrollTop可视区域到顶部的高度
  //scrollHeight滚动区域整体高度
  // console.log(el.offsetHeight + scrollTop - scrollHeight);

  //是否在可是区域
  isVisible.value = el.offsetHeight + scrollTop - scrollHeight > -400;

  //滑到可视区域那么未读消息自动变为0
  isVisible.value && mutation['setUnReadMsgNum'](0);

  // 快到顶部了加载更多消息
  if (scrollTop < 30 && message_list.value.length > 0) {
    loadMoreHistory()
  }
}

//加载更多历史信息
function loadMoreHistory() {
  emit("loadMoreHistory")
}
onMounted(() => {
  const box = document.querySelector('#message-box')
  box.addEventListener("scroll", scrollToTop)
})
onBeforeUnmount(() => {
  const box = document.querySelector('#message-box')
  box.removeEventListener("scroll", scrollToTop)
})

//设置样式
function setMsgClass(item) {
  const { user_id, message_type } = item
  if (!['info', 'notice'].includes(message_type)) {
    return user_id === my_id.value ? 'mine' : 'other'
  }
  return message_type
}
function setTextClass(item) {
  if (!item.user_info) return
  const { user_role, id } = item.user_info
  // if (room_admin_id == id) return "roomOwner";
}

// 检查文件类型
function otherFileType(item) {
  const type = [...otherMsgType.value, ...imgMsgType.value, 'text']
  return !type.includes(item)
}
//检查是否为链接
function isUrl(item) {
  const url = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  return url.test(item)
}

//下拉菜单
function handlerMessageCommand(val, msg) {
  if (Number(val) === 1) {
    emit('quoteMsg', msg)
  }
  if (Number(val) === 2) {
    return instance.proxy.$socket.client.emit("callbackMessage", {
      id: msg.id,
      user_nickname: msg.user_info.user_nickname
    })
  }
  if (Number(val) === 3) return handlerDownload(msg);
}

//下载文件
async function handlerDownload(message) {
  const { name } = message.message_content;
  const atag = document.createElement("a")
  const downLoadurl: any = await getFile(name, 'chat')
  atag.href = downLoadurl
  atag.download = name
  document.body.appendChild(atag);
  atag.click();
  document.body.removeChild(atag);
}

//跳转 信息
function gotoQuoteMsg(id) {

  const isHasMessage = message_list.value.filter((t) => t.id === id).length;
  if (!isHasMessage)
    return ElMessage({ message: "该信息在历史信息中，尚未加载", type: "info" })
  instance.refs[`message__${id}`] && (instance.refs[`message__${id}`][0].scrollIntoView({ behavior: "smooth" }))
}
</script>
<style lang="less" scoped>
@import '../../../theme/theme.less';
.message-container {
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: scroll;
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

    &-info {
      display: flex;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 8px;
      }



      .info-box {
        display: flex;
        flex-direction: column;

        .time {
          font-size: 12px;
          color: #9d9797cf;
          margin-top: 5px;
        }

        .name {
          font-size: 14px;
          color: @message-text-color;
        }

        .message {
          font-size: 13px;
          padding: 4px 16px;
          border-radius: 6px;
          margin-top: 10px;
          cursor: pointer;
          text-align: justify;
          line-height: 2;
          max-width: 300px;
          word-break: break-all;
        }

        // 引用消息
        .quote-box {
          cursor: pointer;
          margin-top: 8px;
          background:@message-tips-bgcolor;
          color: #ccc9c9;
          display: flex;
          align-items: center;
          padding: 6px 15px;
          border-radius: 5px;
          position: relative;
          word-break: break-all;
          max-width: 350px;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          user-select: none;

          &-img {
            max-height: 75px;
            border: 1px solid #b6b6b6;
            border-radius: 3px;
          }

          &-other {
            background: #e2e2e2;
            padding: 6px 10px;
            margin-top: 0;

            &:hover {
              filter: brightness(0.9);
            }
          }
        }
      }

      .msg-img {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;

        /* 图片图片 */
        img {
          max-width: 250px;
          max-height: 300px;
          border-radius: 10px;
          object-fit: cover;
          cursor: pointer;
          user-select: none;
          -webkit-user-drag: none;
          border: 1px solid #b6b6b6;
        }
      }

      .msg-url {
        color: #87ee87 !important;
        cursor: pointer;
      }

      .msg-other {
        display: flex;
        align-items: center;
        background: rgb(220, 220, 220);
        padding: 10px 20px;
        min-width: 120px;
        border-radius: 5px;
        margin-top: 10px;
        filter: brightness(0.9);

        &-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
          cursor: pointer;

          .file-info {
            display: flex;
            flex-direction: column;

            &-name {
              color: #484848;
              max-width: 90px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            &-size {
              margin-top: 5px;
              color: rgb(89, 88, 88);
              font-size: 12px;
            }
          }

          &:hover {
            filter: brightness(1);
          }
        }
      }


    }
  }

  .info {
    justify-content: center;

    &-item {
      font-size: 12px;
      color: @message-text-color;
      display: inline-block;
      background-color: @message-tips-bgcolor;
      padding: 2px 10px;
      border-radius: 4px;
      max-width: 500px;
    }
  }

  .notice {
    justify-content: center;

    &-container {
      text-align: left;
      min-width: 200px;
      max-width: 500px;
      background: @message-tips-bgcolor;
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

.mine {
  color: #000;
  justify-content: flex-end;

  .message-container-item-info {
    flex-direction: row;

    .info-box {
      align-items: flex-end;
      margin-right: 20px;

      .message {
        background-color: #a9e87a;
        color: #000;
        position: relative;
        font-size: 14px;

        &::before {
          content: "";
          position: absolute;
          top: -5px;
          left: auto;
          right: -13px;
          width: 15px;
          height: 15px;
          border: 0 solid transparent;
          border-bottom-width: 12px;
          border-bottom-color: currentColor;
          border-radius: 0 0 15px 0;
          color: #a9e87a;
        }
      }
    }
  }
}

.other {
  color: #000;
  justify-content: flex-start;

  .message-container-item-info {
    flex-direction: row-reverse;

    .info-box {
      align-items: flex-start;
      margin-left: 20px;

      .message {
        background-color: #eee;
        color: #000;
        position: relative;
        font-size: 14px;

        &::after {
          content: "";
          position: absolute;
          top: -5px;
          left: -13px;
          right: auto;
          width: 15px;
          height: 15px;
          border: 0 solid transparent;
          border-bottom-width: 12px;
          border-bottom-color: currentColor;
          border-radius: 0 0 0 15px;
          color: #eee;
        }
      }
    }
  }
}




// .roomOwner {
//   background: #fb9919 !important;
//   color: rgb(236, 236, 236) !important;

//   &::before {
//     color: #fb9919 !important;
//   }

//   &::after {
//     color: #fb9919 !important;
//   }
// }
</style>