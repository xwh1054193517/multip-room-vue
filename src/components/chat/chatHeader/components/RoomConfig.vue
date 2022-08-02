<template>
  <div class="myRoom">
    <div class="header">
      <el-upload class="avatar-uploader" action="###" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforePicUpload" :http-request="uploadUrl">
        <img v-if="ruleForm.room_avatar" :src="ruleForm.room_avatar" class="avatar" />
        <icon v-else class="icon" scale="9" name="upload"></icon>
      </el-upload>
    </div>
    <span class="uuid">专属房间ID: {{ ruleForm.room_id }}</span>
    <div class="form">
      <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="80px" size="small"
        :rules="rules">
        <el-form-item prop="room_name" label="房间名称">
          <el-input v-model="ruleForm.room_name" clearable placeholder="输入您的房间名称" />
        </el-form-item>
        <el-form-item prop="room_need" label="房间权限">
          <el-select v-model="ruleForm.room_need" placeholder="请选择您的房间权限" style="width: 100%">
            <el-option label="房间加密" :value="2"></el-option>
            <el-option label="房间公开" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.room_need == 2" prop="room_password" label="房间密码">
          <el-input v-model="ruleForm.room_password" show-password placeholder="输入房间密码" />
        </el-form-item>
        <el-form-item prop="room_notice" label="房间公告">
          <el-input v-model="ruleForm.room_notice" type="textarea" :rows="5" placeholder="请填写房间公告、以英文,换行" />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button class="btn" size="small" type="primary" @click="updateRoomInfo(ruleFormRef)">更新资料</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { updateRoom } from '@/api/chatting';
import { useActions, useGetters } from '@/utils/hooks/useMap';
import { putFile } from '@/utils/upload';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const user_info = computed(() => store.getters.user_info)
const action = useActions(['getCurrentRoom'])
const getter = useGetters(['my_id', 'room_info'])

// 表单
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

// 初始化房间信息
function initRoomInfo() {
  if (!getter['room_info'].value) return
  const { room_name, room_notice, room_need, room_password, room_avatar, room_id } = getter['room_info'].value
  Object.assign(ruleForm, {
    room_name, room_notice, room_id, room_password, room_avatar, room_need
  })
}
initRoomInfo()

//更新房间信息
const { proxy } = getCurrentInstance()
const updateRoomInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await updateRoom(ruleForm)
      ElMessage({ message: '修改房间成功', type: 'success' })
      await action['getCurrentRoom']()

      const { room_name, room_notice, room_need, room_avatar, room_password, room_id } = ruleForm
      const newRoomInfo = {
        room_name, room_notice, room_need, room_avatar, room_id, room_password, room_user_id: getter['my_id'].value
      }
      proxy.$socket.client.connected && proxy.$socket.client.emit('updateRoomInfo', newRoomInfo)
    }
  })
}
</script>
<style lang="less" scoped>
.myRoom {
  padding: 0 15px;
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .uuid {
    display: inline-block;
    font-size: 12px;
    background: #ccc;
    padding: 2px 5px;
    color: #fff;
    font-weight: 600;
    border-radius: 5px;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .avatar-uploader {
    img {
      width: 120px;
      height: 120px;
      border-radius: 10px;
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
