<template>
  <div class="onlineRoom">
    <div v-if="!props.createRoom">
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
              <icon name="chat-room-lock" scale="1.8" />
            </span>
          </div>
          <div class="onlineRoom-item-info-notice">
            {{ item.room_notice }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="props.createRoom" class="create">
      <el-form ref="ruleFormRef" label-position="left" label-width="80px" :rules="rules" :model="ruleForm" size="small">
        <el-form-item label="房间名称" prop="room_name">
          <el-input v-model="ruleForm.room_name" placeholder="请设置您的房间名称"></el-input>
        </el-form-item>
        <el-form-item label="房间号码" prop="room_id">
          <el-input v-model="ruleForm.room_id" placeholder="请设置您的房间ID"></el-input>
        </el-form-item>
        <el-form-item label="是否加密" prop="room_need">
          <el-select v-model="ruleForm.room_need" style="width: 100%" placeholder="请选择房间是否加密">
            <el-option label="加密" :value="2"></el-option>
            <el-option label="不加密" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="Number(ruleForm.room_need) === 2" label="房间密码" prop="room_password">
          <el-input v-model="ruleForm.room_password" placeholder="请设置您的房间密码"></el-input>
        </el-form-item>
        <el-form-item label="房间公告" prop="room_notice">
          <el-input v-model="ruleForm.room_notice" type="textarea" :rows="3" placeholder="请设置您的房间公告 英文,为换行">
          </el-input>
        </el-form-item>
        <el-form-item label="房间头像" prop="room_avatar">
          <el-upload class="avatar-uploader" action="###" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforePicUpload" :http-request="uploadUrl">
            <img v-if="ruleForm.room_avatar" :src="ruleForm.room_avatar" class="avatar" />
            <icon v-else class="icon" scale="9" name="upload"></icon>
          </el-upload>
        </el-form-item>
        <div class="create-footer">
          <el-button type="danger" size="small" @click="emit('cancel')">取消创建</el-button>
          <el-button type="primary" size="small" @click="createRoom(ruleFormRef)">创建房间</el-button>
        </div>
      </el-form>
    </div>

    <el-dialog title="更改房间提醒" v-model="showJoinModal" width="250px" top="35vh" append-to-body>
      <span class="dialog-info">是否退出当前房间并加入新的房间？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="showJoinModal = false">我再想想</el-button>
          <el-button type="primary" size="small" @click="handleConfirm">确认加入</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="当前房间加密" v-model="showPasswordModal" width="250px" top="35vh" append-to-body>
      <span class="dialog-info">当前房间加密，请先验证密码</span>
      <el-form :model="form">
        <el-form-item>
          <el-input v-model="form.password" placeholder="请输入房间密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="showPasswordModal = false">返回房间</el-button>
          <el-button type="primary" size="small" @click="handlerJoinPasswordRoom">确认加入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script  lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { createUserRoom } from '@/api/chatting';
import { useGetters, useMutations } from '@/utils/hooks/useMap';
import { putFile } from '@/utils/upload';
const store = useStore()
const room_list = computed(() => store.getters.room_list)
const room_id = computed(() => store.getters.room_id)
const user_info=computed(()=>store.getters.user_info)
const mutations = useMutations(['setRoomId'])
//表单验证
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  room_name: null,
  room_id: null,
  room_notice: null,
  room_avatar: null,
  room_need: null,
  room_password: null,
})
const rules = reactive<FormRules>({
  room_id: [
    { required: true, pattern: /^-?\d+\.?\d*$/, message: "请设置您的房间ID(需为数字)", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个数字", trigger: "blur" },
  ],
  room_name: [
    { required: true, message: "请设置您的房间名称", trigger: "blur" },
    { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" },
  ],
  room_notice: [
    { required: true, message: "请设置您的房间公告", trigger: "blur" },
    { max: 520, message: "长度最长520字符", trigger: "blur" },
  ],
  room_need: [
    {
      required: true,
      message: "请设置房间是否需要密码",
      trigger: "change",
    },
  ],
  room_password: [
    { required: true, message: "请设置房间密码", trigger: "change" },
    { min: 3, max: 9, message: "长度在 3 到 9 个字符", trigger: "blur" },
  ],
})
const form = reactive({
  password: ''
})
//父组件传值
const props = defineProps({
  createRoom: { type: Boolean, default: false }
})

//加入房间
const getter = useGetters(['my_room_id'])
const activeRoomId = ref(null)
const showJoinModal = ref(false)
const showPasswordModal = ref(false)
const roomPwd = ref(null)
const emit = defineEmits(['cancel', 'createSuccess', 'close'])
function handlerJoinRoom(room) {
  const { room_id: roomId, room_need, room_password } = room
  if (Number(roomId) === Number(room_id.value)) {
    return ElMessage({ message: '已经在当前房间', type: 'warning' })
  }
  if (Number(room_need) === 2) {
    if (Number(getter['my_room_id'].value) === Number(roomId)) {
      return handleConfirm()
    }
    activeRoomId.value = Number(roomId)
    roomPwd.value = room_password
    showPasswordModal.value = true
    return ElMessage({ message: '房间上锁，输入密码', type: 'warning' })
  }
  activeRoomId.value = Number(roomId)
  showJoinModal.value = true
}
// 确认加入房间
function handleConfirm() {
  mutations['setRoomId'](Number(activeRoomId.value))
  emit("close")
}

//加入带密码房间
function handlerJoinPasswordRoom() {
  if (form.password == roomPwd.value) {
    handleConfirm()
  } else {
    ElMessage({ message: '密码错误', type: 'error' })
  }
  form.password = null
}
//创建房间
const createRoom = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await createUserRoom(ruleForm)
      res.success && emit('createSuccess')
      !res.success && (ElMessage({ message: '房间ID已经被使用', type: 'error' }))
    }
  })
}

//上传图片
function beforePicUpload(file) {
  const size = file.size / 1024 / 1024 < 2;
  const type = file.name.substring(file.name.lastIndexOf(".") + 1);
  const canUpload = ['jpg', 'png', 'gif', 'jpeg']

  if (!canUpload.includes(type)) {
    ElMessage({ message: '只能上传图片', type: 'error' })
    return false
  }
  if (!size) {
    ElMessage({ message: '上传的图片不能超过2m,不然卡死你', type: 'error' })
    return false
  }
}

async function uploadUrl(event) {
  const { file: imgFile } = event
  const type = imgFile.name.split('.')[1]
  const files = {
    name: user_info.value.user_name + '-RoomAvatar.' + type,
    type,
    orgfile: imgFile,
    size: imgFile.size
  }
  try {
    const res = await putFile(files, 'user')
    event.onSuccess(res)
  } catch (error) {
    ElMessage({ message: '上传失败', type: 'error' })
  }
}

async function handleAvatarSuccess(file) {
  if (!file) return
  ruleForm.room_avatar = file.url
  ElMessage({ message: '上传房间头像成功', type: 'success' })
}
</script>
<style lang="less" scoped>
@import '../../../../theme/theme.less';

.dialog-info {
  color: @message-text-color;
}

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

.create {
  transition: all 0.4s;
  padding: 10px 20px;

  &-footer {
    display: flex;
    justify-content: space-around;
  }
}

.avatar-uploader {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 6px;
  border: 1px dashed #ccc !important;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  display: block;
  border: 1px solid #409eff;
}
</style>