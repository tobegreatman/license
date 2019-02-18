<template>
  <div class="login-ctn login-bg">
    <div style="display: flex;">
      <div>
        <img src="../assets/left.png" style="width: 304px;height: 412px;" />
      </div>
      <div class="login-right">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-ruleForm">
          <el-form-item>
            <p class="login-title"><span>欢迎登录</span></p>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-input placeholder="请输入账号" v-model="ruleForm.name" autocomplete="off" suffix-icon="login-user" class="login-input"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入密码" type="password" v-model="ruleForm.password" autocomplete="off" suffix-icon="login-lock" class="login-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return {
      ruleForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    submitForm(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          sessionStorage.setItem('sid','Sesis0012');
          vm.$router.push({name:'MainPage'})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style>
  .login-ctn{
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .login-right {
    width: 444px;
    height: 412px;
    background-color: #fff;
  }
  .login-ruleForm {
    padding: 60px;
  }
  .login-title {
    font-size: 24px;
    color: #3C3C3C;
    text-align: center;
  }
  .login-input input {
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-radius: 0px;
  }
  .login-input .el-input__validateIcon {
    display: none;
  }
</style>
