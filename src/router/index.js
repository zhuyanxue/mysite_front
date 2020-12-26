import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Framework from '@/components/Framework.vue'
import Detail from '@/components/Detail.vue'
import Video from '@/components/Videos.vue'
import Register from '@/components/Register.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import SearchPage from '@/components/SearchPage.vue'
import UserManager from '@/components/UserManager.vue'
import Footers from '@/components/AllFooter.vue'

Vue.use(Router)

//解决路由报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode:'history', //开始路由不生效，加上这句
  routes: [
    {
      path:'/allfooter',
      component:Footers
    },
    {
      path:'/usermanager',
      component:UserManager
    },
    {
      path:'/searchResult',
      component:SearchPage
    },
    {
      path:'/reset',
      component:ResetPassword
    },
    {
      path:'/register',
      component:Register
    },
    {
      path: '/login',
      component: Login
    },
    {
      path:'/',
      component:Home
    },
    {
      path:'/frame',
      component:Framework
    },
    {
      path:'/detail',
      component:Detail
    },
    {
      path:'/videos',
      component:Video
    },
  ]
})
