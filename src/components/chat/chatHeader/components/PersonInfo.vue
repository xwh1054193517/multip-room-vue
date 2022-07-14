<template>
  <div class="person">
    <div class="header">
      <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img :src="userForm.user_avatar" class="avatar" />
      </el-upload>
    </div>
    <span class="uid">uid:{{ uid }}</span>
    <div class="form">
      <el-form ref="userFormRef" :model="userForm" :rules="rules" label-width="120px" class="demo-ruleForm"
        :size="formSize" status-icon>
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="userForm.user_name" />
        </el-form-item>
        <el-form-item label="昵称" prop="user_nickname">
          <el-input v-model="userForm.user_nickname" />
        </el-form-item>
        <el-form-item label="性别" prop="user_sex">
          <el-input v-model="userForm.user_sex" />
        </el-form-item>
        <el-form-item label="签名" prop="user_signature">
          <el-input v-model="userForm.user_signature" />
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleRoomBgSuccess"
          :before-upload="beforeRoomBgUpload">
         
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script  lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
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
function handleAvatarSuccess() {

}
function beforeAvatarUpload() {

}

//上传专属背景
function handleRoomBgSuccess(){

}

function  beforeRoomBgUpload(){
  
}
</script>
<style lang="less" scoped>
</style>