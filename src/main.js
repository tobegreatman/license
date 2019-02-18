// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/main.css'
import App from './App'
import router from './router'
import axios from './api'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = axios

router.beforeEach((to, from, next) => {
  var sid = sessionStorage.getItem('sid');
  if (sid && to.path != '/') {
    next();
  } else if (to.path == '/') {
    sessionStorage.setItem('sid', '');
    next();
  } else next('/')
});

Vue.directive('clickoutside', {
  bind: function(el, binding, vode) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false
      }
      if (binding.expression) {
        binding.value(e)
      }
    }
    el.__vueClickOutSide__ = documentHandler
    document.addEventListener('click', documentHandler)
  },
  unbind: function(el, binding) {
    document.removeEventListener('click', el.__vueClickOutSide__)
    delete el.__vueClickOutSide__
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
