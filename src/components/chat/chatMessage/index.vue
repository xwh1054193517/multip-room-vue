<template>
  <div class="chatMessage">
    <chat-tool ref="toolbar"></chat-tool>
    <div class="chatMessage-input">
      <!-- 发送图片文件 -->
      <img v-if="file && allowImg.includes(file.type)" class="chatMessage-input-img" :src="preImg" />
      <!-- 发送非图片文件 -->
      <div v-if="file && !allowImg.includes(file.type)">
        <div class="file-box">
          <div class="file-info">
            <span class="file-info-name">{{ file.name }}</span>
            <span class="file-info-size">{{ file.size }}</span>
          </div>
        </div>
      </div>
      <!-- 发送文字消息 -->
      <textarea ref="messageInput" v-model.trim="message" placeholder="回车发送信息" class="chatMessage-input-text"
        @keydown="sendMessage" @paste="pasteMessage"></textarea>
    </div>

    <!-- 引用信息 -->
    <div v-if="quoteMessage" class="quote" @click="focusInput">
      <span class="quote-box">
        <!-- 引用文字 -->
        <span>{{ quoteMessage.user_info.user_nickname }}:</span>
        <span v-if="quoteMessage.message_type === 'text'">{{ quoteMessage.message_content }}</span>
        <!-- 引用图片 -->
        <img v-if="allowImg.includes(quoteMessage.message_type)" :src="quoteMessage.message_content.url" alt=""
          class="quote-img">
        <!-- 引用非图片文件 -->
        <div v-if="!allowImg.includes(quoteMessage.message_type) &&
        quoteMessage.message_type !== 'text'">
          <div class="file-box">
            <div class="file-info">
              <span class="file-info-name">{{ quoteMessage.message_content.name }}</span>
              <span class="file-info-size">{{ quoteMessage.message_content.size }}</span>
            </div>
          </div>
        </div>
      </span>
    </div>
    <div class="chatMessage-empty" @click="focusInput"></div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { getCurrentInstance, ref, watch } from 'vue';
import ChatTool from '../chatTool/index.vue';
const allowImg = ref(['png', 'jpg', 'gif', 'jpeg'])
const file = ref(null)
const preImg = ref(null)
const quoteMessage = ref(null)
const message = ref("")
const { proxy } = getCurrentInstance()
async function sendMessage(e) {
  if (!proxy.$socket.client.connected) return ElMessage({ message: '连接已断开,请重新登陆', type: 'error' })

  //删除键 有BUG只能删完文字再删图片
  if (e.keyCode === 8) {
    if (message.value) return
    preImg.value = null
    file.value = null
  }

  //回车键 发送
  if (e.keyCode === 13) {
    //分三种情况，只有文字，只有文件，有文字和文件
    // 只有文字
    if (message.value && !file.value) {
      console.log('只有文字');
      const data: any = {
        message_type: 'text',
        message_content: JSON.stringify(message.value)
      }
      quoteMessage.value && (data.quoteMessage = quoteMessage.value)
      // proxy.$socket.client.emit('message', data)
      console.log(data);

    }

    //只有文件
    if (!message.value && file.value) {
      console.log('只有文件');
      const { name, orgfile, type, size } = file.value
      const formData = new FormData()
      formData.append("file", orgfile)
      const config = { headers: { "Content-Type": "multipart/form-data" } }
      try {
        //此处上传文件
        const res = {
          data: {
            data: [{ url: '12' }]
          }
        }

        const content = { name, size, type, url: res.data.data[0].url };
        const data: any = {
          message_type: type,
          message_content: JSON.stringify(content)
        }
        quoteMessage.value && (data.quoteMessage = quoteMessage.value)
        // proxy.$socket.client.emit('message', data)
        console.log(data);
      } catch (error) {
        ElMessage({ message: "文件上传失败辣", type: 'error' })
      }
    }

    //又有文件又有文字
    if (message.value && file.value) {
      console.log('有文字有文件');
      const { name, orgfile, type, size } = file.value
      const formData = new FormData()
      formData.append("file", orgfile)
      const config = { headers: { "Content-Type": "multipart/form-data" } }
      try {

        //此处上传文件
        const res = {
          data: {
            data: [{ url: '12' }]
          }
        }
        //先发送文件消息
        const fileContent = { name, size, type, url: res.data.data[0].url };
        const fileData: any = {
          message_type: type,
          message_content: JSON.stringify(fileContent)
        }
        // proxy.$socket.client.emit('message', fileData)
        // 在发送文字消息
        const textData: any = {
          message_type: 'text',
          message_content: JSON.stringify(message.value)
        }
        quoteMessage.value && (textData.quoteMessage = quoteMessage.value)
        // proxy.$socket.client.emit('message', textData)
        console.log(fileData, textData);
      } catch (error) {
        ElMessage({ message: "文件上传失败辣", type: 'error' })
      }
    }

    //清空所有显示 
    clearAll()
    //防止添加换行符
    e.preventDefault();
  }
}

//黏贴文件信息
function pasteMessage(e) {
  if (e.clipboardData.files.length) {
    focusInput()
    const pastefile = e.clipboardData.files[0];
    if (pastefile.size > 1024 * 1024 * 2) {
      return ElMessage({ message: '文件大小不能超过2MB', type: 'error' })
    }
    const type = getFileType(pastefile.name)
    allowImg.value.includes(type) && pastingImg(pastefile, type)
    !allowImg.value.includes(type) && pastingOther(pastefile, type)
  }
}

//获取文件类型
function getFileType(t) {
  return t.substr(t.lastIndexOf('.') - t.length + 1).toLowerCase()
}
//黏贴图片
function pastingImg(imgfile, type) {
  const { name, size } = imgfile
  const reader = new FileReader()
  reader.readAsDataURL(imgfile)
  reader.onload = (e) => {
    preImg.value = e.target.result
    file.value = { orgfile: imgfile, name, type, size: formatSize(size) }
  }
}
//黏贴非图片文件
function pastingOther(otherfile, type) {
  const { name, size } = otherfile;
  file.value = { orgfile: otherfile, name, type, size: formatSize(size) }
}
//聚焦输入
const messageInput = ref(null)
function focusInput() {
  messageInput.value.focus();
}

//引用消息
function setQuoteMsg(msg) {
  quoteMessage.value = msg
  focusInput()
}

//清除引用消息
function delQuoteMsg() {
  quoteMessage.value = null
}
//发送消息后清空
function clearAll() {
  message.value = "";
  quoteMessage.value = null;
  file.value = null;
  preImg.value = null;
}

//格式化大小
function formatSize(size) {
  return size > 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(2)}m` : `${(size / 1024).toFixed(2)}k`
}
</script>
<style lang="less" scoped>
.chatMessage {
  height: 180px;
  display: flex;
  flex-direction: column;
  width: 100%;

  &-input {
    display: flex;
    padding: 0 15px;
    overflow: hidden;

    &-img {
      object-fit: cover;
      border: 1px solid #b6b6b6;
      border-radius: 4px;
      max-width: 200px;
    }

    &-text {
      font-size: 14px;
      vertical-align: baseline;
      width: 100%;
      overflow: hidden;
      resize: none;
      outline: none;
      border: none;
      color: aliceblue;
      box-sizing: border-box;
      background-color: transparent;

      &::placeholder {
        font-size: 14px;
      }
    }
  }

  .quote {
    padding: 0 13px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-top: 5px;

    &-box {
      background-color: #e5e5e5;
      color: #c4c4c4;
      display: flex;
      padding: 5px 13px;
      position: relative;
      border-radius: 4px;
      word-break: break-all;
    }

    &-img {
      max-height: 45px;
    }
  }

  .file-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 8px 18px;
    min-width: 150px;
    border-radius: 3px;
    filter: brightness(0.75)
  }

  .file-info {
    display: flex;
    flex-direction: column;

    &-name {
      color: rgb(41, 41, 41);
      max-width: 85px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &-size {
      color: rgb(55, 55, 55);
      margin-top: 5px;
      font-size: 12px;
    }
  }

  &-empty {
    flex: 1
  }
}
</style>