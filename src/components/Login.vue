<template>
  <div class="login">
    <!-- 文字区不需要请连css部分代码一并删除 -->
    <div id="">
      <div id="mylogin">                      
         <!-- 登陆表单 -->
        <div class="lock animated">
          <div class="form">
              <div class="pic"></div>
              <div class="input">
                <input @keyup.enter="login" class="animated" type="text" placeholder="请输入登录名" v-model="users.name" />
              </div>
              <div class="input">
                  <input @keyup.enter="login" class="animated" type="password" placeholder="请输入密码" v-model="users.password" />
              </div>
              <div class="container">
                <a @click="login" class="btn"><span style="color: rgba(0, 0, 0);"><b>登录</b></span></a>
                  <a @click="register" class="btn"><span style="color:rgba(0, 0, 0);"><b>注册</b></span></a>
              </div> 
                <a @click="reSetPassWord"><span style="font-family: Kaiti;color: rgba(0, 0, 0);font-size:0.75em"><u>找回密码?</u></span></a>
          </div>
        </div>      
      </div>      
      <!-- 你可以添加个多“.slideshow-image”项目, 记得修改CSS -->
      <div class="slideshow">
        <div class="slideshow-image" id="one"></div>
        <div class="slideshow-image" id="two"></div>
        <div class="slideshow-image" id="three"></div>
        <div class="slideshow-image" id="four"></div>
      </div>
    </div>

    </div>
</template>

<script>
//引入axios
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import global_ from './../global'

//解决axios的post传参问题
import QS from 'qs'

Vue.use(VueAxios, axios)

export default {
  name: 'Login',
  data () {
    return {
      users:{name:'',password:''},
      visible:true,
      changeType:'password',
      iconeye:'el-icon-view el-input__icon',
      loginUser:{name:'',password:''},
    }   
  },
  mounted(){
    axios.defaults.baseURL = global_.API_BASEURL;
  },

  methods:{
       changePass() {        
        if(this.changeType=='password'){           
            this.changeType='text';
            this.iconeye='el-icon-remove-outline el-input__icon';
             //console.log("0000");
        }else{      
          this.changeType='password'; 
          this.iconeye='el-icon-view el-input__icon';          
        }
      },
      reSetPassWord(){
        //找回密码
        this.$router.push({path:'/reset'}); 
      },

      //登录判断，token
      login(){
        if(this.users.name && this.users.password != ''){
            this.toLogin();        
         }else{
           if(this.users.name==''){
            this.$message({
              message: '用户名不能为空',
              type: 'warning',
               center: true,
               duration:2500
            });
             return;
           };
           if(this.users.password==''){
             this.$message({
              message: '密码不能为空',
              type: 'warning',
              center: true,
               duration:2500
            });
             return;
           }
         }
      },
      toLogin(){
        var self=this;
        var url="/login"
        let param=this.users;

        this.axios.post(url, param).then((response) => {
          if(response.data.code == '0000'){
            //存入token
            self.$root.setToken(response.data.message);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$root.getToken() ;
            //console.log(response.data.message);
            localStorage.setItem("userId",response.data.data.id);
            localStorage.setItem("userRole",response.data.data.role);
            //登录成功。记录拿到token的时间
            var haveTime=new Date().getTime();
            localStorage.setItem("haveToken",haveTime);
            //路由跳转
            self.$router.push({path:'/'}); 
          }else{
            self.$message({
              message: response.data.message,
              type: 'error',
              center: true,
              duration:2500
            });
          }
        }).catch(function (error) {
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
        });
      },
      //注册
      register(){
        this.$router.push({path:'/register'}); 
      },
  }
}
</script>

<style scoped>
/* =================================== 登录样式 ================================ */
*{margin:0%;padding:0%;}

.slideshow {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.slideshow-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background: no-repeat 50% 50%;
  background-size: cover;
  -webkit-animation-name: kenburns;
          animation-name: kenburns;
  -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
  -webkit-animation-duration: 16s;
          animation-duration: 16s;
  opacity: 1;
  -webkit-transform: scale(1.2);
          transform: scale(1.2);
}
.slideshow-image:nth-child(1) {
  -webkit-animation-name: kenburns-1;
          animation-name: kenburns-1;
  z-index: 3;
}
.slideshow-image:nth-child(2) {
  -webkit-animation-name: kenburns-2;
          animation-name: kenburns-2;
  z-index: 2;
}
.slideshow-image:nth-child(3) {
  -webkit-animation-name: kenburns-3;
          animation-name: kenburns-3;
  z-index: 1;
}
.slideshow-image:nth-child(4) {
  -webkit-animation-name: kenburns-4;
          animation-name: kenburns-4;
  z-index: 0;
}

@-webkit-keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
            transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}

@keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
            transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@-webkit-keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@-webkit-keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}
@keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}

/* =================  更改使背景图显示 ==================== */
#one{
  background-image:url(./../assets/img/4.jpg);
}
#two{
   background-image:url(./../assets/img/2.jpg);
}
#three{
   background-image:url(./../assets/img/3.jpg);
}
#four{
   background-image:url(./../assets/img/1.jpg);
}


/* =======================表格样式=========================== */
.login{
  position: fixed;
  top:0%;
  left: 0%;
  right: 0%;
  bottom: 0%;

}
#mylogin{
  position: absolute;
  top: 45%;
  left: 44%;  
  -webkit-transform: translate3d(-50%, -50%, 0);
          transform: translate3d(-50%, -50%, 0);
  z-index: 99;
  text-align: center;
  font-family: Raleway, sans-serif;
  font-weight: 300;
  text-transform: uppercase;
  padding: 1em 2em;
  line-height: 1.5;
}
/* =============================== 按钮样式 ================================= */

.container {
  font-family: Kaiti;
  margin-top:5%; 
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  cursor:pointer;
  font-size: 17px;
  padding: 1px 30px  1px 30px;
  color: #f4f4f4;
  text-transform: uppercase;
}

.btn {
  text-decoration: none;
  border: 0px solid rgb(43, 42, 38);
  position: relative;
  overflow: hidden;
}

.btn:hover {
  box-shadow: 1px 1px 25px 10px rgba(231, 231, 240, 0.4);
}

.btn:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(90, 197, 224, 0.4),
    transparent
  );
  transition: all 650ms;
}

.btn:hover:before {
  left: 100%;
}
/* ================================= 表单样式 =================================== */

    .form {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 250px;
        height: 276px;
        text-align: center;
        background: rgba(255,255,255,.3);
    }
        .pic {
          margin-top: 5%;
          margin-left: 32%;
          width: 80px;
          height: 80px;
          background: url(./../assets/img/pic.jpg) no-repeat center;
          background-size: 100%;
          border-radius: 50%;
          opacity:0.8;
        }
        .pic:hover {
            cursor: pointer;
            opacity: 1;
        }
        .name {
          margin-top: 15px;
          color: white;
          font-size: 18px;
        }
            .input input {
              width: 70%;
              margin-top: 20px;             
              height: 30px;
              text-indent: 13px;
              font-family: Kaiti;
            }
</style>
