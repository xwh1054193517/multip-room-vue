<template>
  <div class="person">
    <div class="header">
      <el-upload class="avatar-uploader" action="###" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforePicUpload" :http-request="uploadUrl">
        <img :src="userForm.user_avatar" class="avatar" />
      </el-upload>
    </div>
    <span class="uid">uid:{{ uid }}</span>
    <div class="form">
      <el-form ref="userFormRef" :model="userForm" :rules="rules" class="demo-ruleForm" :size="formSize" status-icon>
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="userForm.user_name" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="user_nickname">
          <el-input v-model="userForm.user_nickname" clearable />
        </el-form-item>
        <el-form-item label="性别" prop="user_sex">
          <el-radio-group v-model="userForm.user_sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签名" prop="user_signature">
          <el-input v-model="userForm.user_signature" clearable />
        </el-form-item>
      </el-form>
      <div class="btn-container">
        <el-upload class="upload" action="#" :http-request="uploadRoomUrl" :show-file-list="false"
          :on-success="handleRoomBgSuccess" :before-upload="beforePicUpload">
          <el-button class="btn" size="small" type="success">专属背景</el-button>
        </el-upload>
        <el-button class="btn" size="small" type="danger" @click="removeUserRoomBg">移除背景</el-button>
        <el-button class="btn" size="small" type="primary" @click="updateUser(userFormRef)">更新资料</el-button>
      </div>
    </div>
  </div>
</template>
<script  lang="ts" setup>
import { reactive, ref, computed, getCurrentInstance } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useStore } from 'vuex';
import { putFile } from '@/utils/upload';
import { updateUserInfo } from '@/api/user';
import { useActions } from '@/utils/hooks/useMap';
const store = useStore()
const user_info = computed(() => store.getters.user_info)
const action = useActions(['getUser'])
const uid = ref("")
const formSize = ref('default')
const userFormRef = ref<FormInstance>()
const { proxy } = getCurrentInstance()
const userForm = reactive({
  user_name: "",
  user_nickname: "",
  user_sex: "",
  user_signature: "",
  user_avatar: ""
})
const rules = reactive<FormRules>({
  user_name: [{ required: true }],
  user_nickname: [{ required: true, message: "请输入您的昵称", trigger: "blur" }],
  user_sex: [{ required: true, message: "请选择您的性别", trigger: "change" }],
  user_signature: [{ required: true, message: "请输入您的个性签名", trigger: "blur" }]
})
//初始化用户信息
function initUser() {
  if (!user_info.value) return
  const { user_name, user_nickname, user_sex, user_signature, user_avatar } = user_info.value
  Object.assign(userForm, { user_name, user_nickname, user_sex, user_signature, user_avatar })
  uid.value = `sb${user_info.value.user_id.toString().padStart(4, 0)}`
}
initUser()

//头像上传
async function uploadUrl(event) {
  const { file: imgFile } = event
  const type = imgFile.name.split('.')[1]
  const files = {
    name: user_info.value.user_name + '-avatar.' + type,
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

async function uploadRoomUrl(event) {
  const { file: imgFile } = event
  const type = imgFile.name.split('.')[1]
  const files = {
    name: user_info.value.user_name + '-room.' + type,
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
  userForm.user_avatar = file.url
  await updateUserInfo({ user_avatar: userForm.user_avatar })
  await action['getUser']()
  const { user_name, user_nickname, user_sex, user_signature, user_avatar } = user_info.value
  const newInfo = { user_name, user_nickname, user_sex, user_signature, user_avatar }
  proxy.$socket.client.connected && proxy.$socket.client.emit('updateRoomUser', newInfo)
  ElMessage({ message: '上传头像', type: 'success' })
}




//上传专属背景
async function handleRoomBgSuccess(file) {
  if (!file) return
  await updateUserInfo({ user_room_bg: file.url })
  action['getUser']()
}

//处理上传前
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

//清除房间背景
async function removeUserRoomBg() {
  await updateUserInfo({ user_room_bg: "" })
  ElMessage({ message: '已移除掉专属背景', type: 'success' })
  action['getUser']()
}

//更新用户信息
async function updateUser(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await updateUserInfo(userForm)
      ElMessage({ message: "更新成功", type: 'success' })
      await action['getUser']()
      const { user_name, user_nickname, user_sex, user_signature, user_avatar } = user_info.value
      const newInfo = { user_name, user_nickname, user_sex, user_signature, user_avatar }
      proxy.$socket.client.connected && proxy.$socket.client.emit('updateRoomUser', newInfo)
    }
  })
}
</script>
<style lang="less" scoped>
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .upload {
    margin-right: 10px;
  }
}

.person {
  padding: 1px 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .avatar-uploader {
    img {
      width: 120px;
      height: 120px;
      border-radius: 10px;
    }

  }

  .uid {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 4px;
    border-radius: 4px;
    margin-top: 4px;
    background-color: #ccc;
    color: rgb(80, 80, 81);
  }

  .form {
    width: 80%;
    margin: 0 auto;
    margin-top: 10px;
  }
}
</style>