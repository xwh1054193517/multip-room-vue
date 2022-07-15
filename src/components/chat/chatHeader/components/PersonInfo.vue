<template>
  <div class="person">
    <div class="header">
      <!-- <el-upload class="avatar-uploader"  :show-file-list="false" :on-success="handleAvatarSuccess" -->
        <!-- :before-upload="beforePicUpload"> -->
        <img :src="userForm.user_avatar" class="avatar" />
      <!-- </el-upload> -->
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
          <el-input v-model="userForm.user_sex" clearable />
        </el-form-item>
        <el-form-item label="签名" prop="user_signature">
          <el-input v-model="userForm.user_signature" clearable />
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleRoomBgSuccess"
          :before-upload="beforePicUpload">
          <!-- <el-button class="btn" size="mini" type="success">专属背景</el-button> -->
        </el-upload>
        <!-- <el-button class="btn" size="mini" type="danger" @click="removeUserRoomBg">移除背景</el-button>
        <el-button class="btn" size="mini" type="primary" @click="updateUser">更新资料</el-button> -->
      </div>
    </div>
  </div>
</template>
<script  lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useStore } from 'vuex';
const store = useStore()
const user_info = computed(() => store.getters.user_info)
const uid = ref("")
const formSize = ref('default')
const userFormRef = ref<FormInstance>()
const userForm = reactive({
  user_name: "",
  user_nickname: "",
  user_sex: "",
  user_signature: "",
  user_avatar: ""
})
const rules = reactive<FormRules>({

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
function uploadUrl() {

}
function handleAvatarSuccess(file) {
  if (!file.data[0].url) return ElMessage({ message: '上传的头像失败', type: 'error' })
}

//上传专属背景
function handleRoomBgSuccess() {

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
</script>
<style lang="less" scoped>
.person {
  padding: 1px 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  // .avatar-uploader {
    img {
      width: 120px;
      height: 120px;
      border-radius: 10px;
    }
  // }

  .uid {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 4px;
    border-radius: 4px;
    margin-top: 4px;
    color: aliceblue;
  }

  .form {
    width: 80%;
    margin: 0 auto;
    margin-top: 10px;
  }
}
</style>