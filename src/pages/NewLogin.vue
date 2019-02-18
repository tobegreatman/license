<template>
  <div class="login-ctn login-bg">
    <div style="flex: 1 1 40%;"></div>
    <div style="display: flex; flex:auto;">
      <div class="login-right">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-ruleForm">
          <el-form-item>
            <p class="login-title"><span>W E L C O M E</span></p>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-input placeholder=" 请输入账号" v-model="ruleForm.name" autocomplete="off" prefix-icon="login-user" class="login-input"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder=" 请输入密码" type="password" v-model="ruleForm.password" autocomplete="off" prefix-icon="login-lock" class="login-input"></el-input>
          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;border-radius: 10px;">登录</el-button>
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
          { required: true, message: '请输入账号', trigger: 'blur' },
          { type: "enum", enum: ['admin'], message: '账号错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: "enum", enum: ['abc123'], message: '密码错误', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    submitForm(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
    color: #fff;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .login-right {
    width: 300px;
    height: 380px;
    background-color: rgba(255,255,255,0.4);
    border-radius: 15px;
  }
  .login-ruleForm {
    padding: 20px;
  }
  .login-title {
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    font-family: 'Sitka Heading';
  }
  .login-input .el-input__validateIcon {
    display: none;
  }
  .login-input input {
    color: #fff;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.3);
  }
  .login-input input::-webkit-input-placeholder{
     color: #FFF;
     opacity: 0.8;
  }
  .login-input input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color: #FFF;
      opacity: 0.8;
  }
  .login-input input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
      color: #FFF;
      opacity: 0.8;
  }
  .login-input input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
      color: #FFF;
      opacity: 0.8;
  }
</style>
