import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/NewLogin'
import MainPage from '@/pages/Main'
import PageNotFind from '@/pages/PageNoFind'
import List from '@/components/List'
import Log from '@/components/Log'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'login',
    align: '/login',
    component: Login
  }, {
    path: '/main',
    name: 'MainPage',
    component: MainPage,
    children: [{
      path: 'home',
      name: 'home',
      component: PageNotFind
    }, {
      path: 'list',
      name: 'list',
      component: List
    }, {
      path: 'log',
      name: 'log',
      component: Log
    }, {
      path: '*',
      component: PageNotFind
    }]
  }, {
    path: '*',
    component: PageNotFind
  }]
})
