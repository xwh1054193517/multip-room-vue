<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="logo">
        <span class="title">Enjoy Music In Chatting Room</span>
        <img src="../assets/logo.gif">
      </div>


      <div class="form">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
          <el-form-item prop="user_name">
            <el-input v-model="ruleForm.user_name" autocomplete="off" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item prop="user_password">
            <el-input v-model="ruleForm.user_password" type="password" show-password placeholder="请输入密码" />
          </el-form-item>

        </el-form>
      </div>


      <div class="change">
        <a @click="forgetPassword">忘记密码</a>
        <a @click="$router.push('/register')">没有账号去注册</a>
      </div>
      <el-button style="width: 100%" type="success" round @click="Login(ruleFormRef)">登录进入</el-button>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { reactive, ref, } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

import { login } from '@/api/user';
import { setToken } from '@/utils/auth';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  user_name: '',
  user_password: ''
})
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入您的账户密码'))
  } else {
    if (ruleForm.user_password !== '') {
      if (ruleForm.user_password.length < 6 || ruleForm.user_password.length > 32) {
        callback(new Error('密码长度为6-32位字符'))
      }
    }
    callback()
  }
}
const rules = reactive({
  user_name: [
    { required: true, message: '请输入您的账号', trigger: "blur" },
    { min: 1, max: 15, message: "长度不得超过15个字符", trigger: "blur" }
  ],
  user_password: [{ validator: validatePass, trigger: "blur" }]
})

localStorage.user_name && (ruleForm.user_name = localStorage.user_name)
localStorage.user_password && (ruleForm.user_password = localStorage.user_password)
//登录
const router = useRouter()
const store = useStore()
const Login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await login(ruleForm)
      const { data } = res
      const { token } = data
      store.commit('setToken', token)
      router.push("/");
      const { user_name, user_password } = ruleForm;
      localStorage.user_name = user_name;
      localStorage.user_password = user_password;
    }
  })
}

//忘记密码 没有功能
const forgetPassword = () => {
  ElMessage({
    message: '都没得邮箱验证，你找个鬼的密码！',
    type: 'error',
  })
}

</script>

<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  background: url('https://multiproom-1305549463.cos.ap-guangzhou.myqcloud.com/chatroom.gif');

  &-wrapper {

    margin-top: 50px;

    @media screen and (min-width:640px) {
      margin-top: 90px;
      padding: 0 90px;
      height: 80%;
      gap: 20px;
      border-radius: 10px;
      backdrop-filter: blur(12px);
      background-color: rgba(228, 222, 180, 0.028);
      box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
      border: 2px rgba(255, 255, 255, 0.4) solid;
      border-bottom: 2px rgba(40, 40, 40, 0.35) solid;
      border-right: 2px rgba(40, 40, 40, 0.35) solid;
    }

    .logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 90px;

      img {
        width: 80%;
        height: 120px;
        border-radius: 8px;
        margin-top: 15px;
      }

      .title {
        font-size: 16px;
        color: #fff;

      }
    }
  }

  .form {
    margin-top: 30px;
    margin-bottom: 15px;
    width: 300px;
  }

  .change {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    cursor: pointer;
    color: #fff;
    margin: 15px 0;
  }
}
</style>
