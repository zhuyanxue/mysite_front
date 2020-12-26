
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'  //引入jQuery
//使用elemntUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//使用富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import "babel-polyfill"


//使用vue-video
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')//官方路径
//require('vue-video-player/node_modules/video.js/dist/video-js.css') //这个路径要引用正确，自定义路径。npm报错
require('vue-video-player/src/custom-theme.css')

Vue.use(VideoPlayer);

Vue.use(ElementUI);

Vue.use(VueQuillEditor);


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',

  //监听路由变化
  watch:{
    "$route" : 'checkLogin'
  },
  created() {
   //消除动画
    this.checkLogin();
  },
  methods:{
    //检查是否存在token
    checkLogin(){
      var self=this;
      if(self.$router.currentRoute.path != "/register" && self.$router.currentRoute.path !="/reset"){
        if(!self.getToken('token')){
          //console.log(token);
          this.$router.push('/login');
        }
      }
    },
    //axios请求前的处理
    //token相关
    setToken(token){
      //保存token
      //console.log(token);
      localStorage.setItem("token", token);
    },

    //获得token
    getToken(){
      var token = localStorage.getItem("token");
      return token;
    },

  }
})
