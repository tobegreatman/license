<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-header style="text-align: right; font-size: 12px" class="header-theme">
      <div class="logo-info">
        <img src="../assets/logo.png"/>
      </div>
      <el-dropdown trigger="click" @command="handMenuClick">
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">登出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>{{userName}}</span>
    </el-header>

    <el-container style="overflow: auto;">
      <el-aside :style="asideStyle" ref="slide">
        <el-menu class="el-menu-vertical-cls" @select="menuSelect" :router=true default-active="License维护" :collapse="isCollapse">
          <el-menu-item index="License维护" route="/main/list">
            <i class="el-icon-share"></i>
            <span slot="title">License维护</span>
          </el-menu-item>
          <el-submenu index="用户管理" v-if="false">
            <template slot="title">
              <i class="el-icon-service"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="用户" route="/main/home">用户</el-menu-item>
            <el-menu-item index="角色">角色</el-menu-item>
          </el-submenu>
          <el-menu-item index="日志管理" route="/main/log">
            <i class="el-icon-document"></i>
            <span slot="title">日志管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container style="background: #E6E9F0;">
        <el-header class="nav-info" style="height: 40px;padding: 9px;">
          <i class="el-icon-menu" @click="isCollapse = !isCollapse"></i> <span class="menu-path">{{menuPath}}</span>
        </el-header>
        <el-main class="main-theme">
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style>
  .el-menu-vertical-cls {
    transition: width 0.5s ease;
  }
  .el-menu-vertical-cls:not(.el-menu--collapse) {
    width: 239px;
    min-height: 400px;
  }
</style>

<script>
  export default {
    name: 'MainPage',
    data() {
      return {
        menuPath: '',
        userName: 'Admin',
        isCollapse: false
      }
    },
    computed:{
      asideStyle(){
        var width = '240px';
        if(this.isCollapse) width = '60px';
        return {
          'background-color': '#FFF',
          width: width,
          transition: 'width 0.5s ease'
        }
      }
    },
    methods: {
      menuSelect(index,indexPath){
        var vm = this,
            path = '';
        setTimeout(function(){
          /* var nodes = vm.$refs.slide.$el.querySelectorAll('.is-active');
          Array.from(nodes).map(function(item){
            if(item.classList.contains('el-submenu')) path += item.firstChild.innerText + ' / ';
            else path += item.innerText;
          });*/
          vm.menuPath = indexPath.join(' / ');
        },0);
      },
      handMenuClick(code){
        if(code == 'logout') this.$router.push({name:'login'})
      }
    },
    mounted(){
      this.$refs.slide.$el.querySelector('.is-active').click();
    }
  };
</script>
