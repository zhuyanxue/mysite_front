<template>
  <div class="registers" style="margin: 0px;border: 0px;padding: 0px;font-family: Kaiti;">
    <div align="center">
      <div style="margin-top:2%">
        <img src="../assets/img/logo.png" width="6%"/>
        <div style="margin-top:1%;font">
          <span style="font-size:1.4em;color:green;">
              <span style="border-radius: 50%; margin-top:2.5px;margin-right:-5px;   height: 20px;    width: 20px;    display: inline-block;    background: #f30303;      vertical-align: top;">  
              <span style="display: block;    color: #FFFFFF;    height: 20px;    line-height: 20px;    text-align: center">沐</span>  
          </span>
            欢迎来注册</span>
        </div>
      </div>
      <div style="margin-top:3.5%;margin-left:-9.5%;">
        <div style="width:32%">
        <el-form ref="form" label-position="right"  :model="users" label-width="150px">
          <el-form-item>
            <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">昵称(登录名)：</span>
            <el-input @blur.native.capture="isMake"  v-model="users.name"  placeholder="请输入昵称"  clearable prefix-icon="el-icon-star-off"></el-input>
          </el-form-item>
           <el-form-item>
             <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">设置密码：</span>
            <el-input v-model="users.password"  placeholder="请设置密码" show-password  clearable  :prefix-icon="iconshow"></el-input>
          </el-form-item>
           <el-form-item>
             <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">确认密码：</span>
            <el-input @mouseleave.native="respass" v-model="repassword"  placeholder="请确认密码" show-password  :prefix-icon="iconshow"></el-input>
          </el-form-item>
           <el-form-item>
             <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">电子邮箱：</span>
              <el-tooltip class="item" effect="light" content="此邮箱账号主要用于找回密码" placement="right-start" >
             <!-- <el-input v-model="users.email"  placeholder="请输入电子邮箱"  clearable prefix-icon="el-icon-user"></el-input> -->
              <el-autocomplete
              style="width:100%"
              class="inline-input"
              v-model="users.email"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              prefix-icon="el-icon-user"
              ></el-autocomplete>


            </el-tooltip>
          </el-form-item>
          <el-form-item>
             <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">验证码：</span>
            <el-input v-model="myidentifyCode" placeholder="请输入图中验证码" style="width:74.2%;float:left" clearable></el-input>
            <span style="float:left;">
              <el-tooltip class="item" content="点击切换验证码" placement="right-start" >
              <s-identify  @click.native="refreshCode" :identifyCode="identifyCode" style="cursor:pointer;">
              </s-identify>
             </el-tooltip>
              </span>
          </el-form-item>
        </el-form>
           <el-button type="primary" @click="submitRegister" round style="width:40%;margin-left:20%">注册</el-button>
        </div>

      </div>
    </div>

      <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :modal-append-to-body='false'
      width="30%"
      :before-close="handleClose"
      center="">
      <span>恭喜你，注册成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLogin">取 消</el-button>
        <el-button type="primary" @click="gologin">去登录</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import SIdentify from './identify.vue'
//引入axios
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import global_ from './../global'

//解决axios的post传参问题
import qs from 'qs'

Vue.use(VueAxios, axios)

export default {
  data () {
    return {
      users:{name:'',password:'',email:''},
      repassword:'',
      myidentifyCode:'',
      iconshow:'',

      //验证码
      makeCode: '',
      identifyCode: '',
      dialogVisible:false,
      
      isUseName:'',
     
    }
  },
  components: {
    's-identify': SIdentify
  },
  mounted () {
    axios.defaults.baseURL = global_.API_BASEURL;
    this.makeIdentifyCode({ randomTypeLen: true });
  },
   methods: {
     isMake(){
       var self=this;
       if(this.users.name!=''){
         var url="/judgeName?name="+this.users.name;
         self.axios.post(url,{}).then((res)=>{
          if(res.data.code=="0000"){
            self.isUseName="used";
            self.$message({
                     showClose: true,
                      message: res.data.data,
                      type: 'warning',
                      center: true,
                      duration:2500
              });
          }else{
            self.isUseName="";
          }
        }).catch(function (error) {
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
         });

       }
     },
     handleClose(){

     },
     //自定义方法
     cancelLogin(){
        this.users={name:'',password:'',email:''};
        this.repassword='';
        this.myidentifyCode='';
        this.dialogVisible=false;
     },
     gologin(){
       this.dialogVisible=false;
       this.$router.push({path:'/login'}); 
     },
     submitRegister(){{
          if(this.users.name!=""&&this.users.password!=""&&this.users.email!=""){
            if(this.repassword==this.users.password){
              if(this.myidentifyCode.toLowerCase()===this.identifyCode.toLowerCase()){
                  if(this.users.email.indexOf("@") == -1){
                    this.$message({
                      message: "邮箱格式不正确",
                      type: 'error',
                      center: true,
                      duration:2500
                });
                  }else{
                    this.realregister();
                  }

                }else{
                this.$message({
                      message: "验证码输入错误",
                      type: 'error',
                      center: true,
                      duration:2500
                });
              }
            }else{
                this.$message({
                      message: "两次密码输入不一致",
                      type: 'error',
                      center: true,
                      duration:2500
                });
            }
           
          }else{
            if(this.users.name==""){
              this.$message({
              message: "用户名不能为空",
              type: 'error',
              center: true,
              duration:2500
              });
              return;
            };
            if(this.users.password==""){
                 this.$message({
              message: "密码不能为空",
              type: 'error',
              center: true,
              duration:2500
              });
              return;
            };
            if(this.users.email==""){
              this.$message({
              message: "电子邮箱不能为空",
              type: 'error',
              center: true,
              duration:2500
              });
              return;
            };
          }
       }
     },
     realregister(){
       
       var url="/submitRegister";
       var self=this;
       var param=this.users;
       if(this.isUseName!="used"){
        self.axios.post(url,param).then((res)=>{
          if(res.data.code=="0000"){
            self.isUseName="";
            self.dialogVisible=true;
            self.refreshCode ();
          }else{
            self.$message({
                message: res.data.message,
                type: 'warning',
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
         }else{
           self.$message({
                message: "请先更换昵称，才进行注册",
                type: 'error',
                center: true,
                duration:2500
              });
         }
     },
     respass(){
       if(this.repassword!=''&&this.repassword==this.users.password){
         this.iconshow="el-icon-check";
       }else{
         this.iconshow="";
       }
     },
     //补全
     querySearch(queryString, cb) {
        let restaurants = [
              {"value": "@qq.com"},
              {"value": "@163.com"},
              {"value": "@sohu.com"},
              {"value": "@126.com"},
              {"value": "@163.net"},
              {"value": "@yahoo.com"}
          ];
          let results =restaurants;    //把数组的浅复制换成深复制
          for (let item in results) {
              results[item].value = queryString + '' + restaurants[item].value
          }
          cb(results)
      },
      createFilter(queryString) {
        
      },
    /**
     * 随机生成一个0~9之间的数
     */
    randomNum () {
      return Math.floor(Math.random() * 10)
    },

    /**
     * 随机生成一个字母
     * @param {boolean} isUupper 生成大写字母
     */
    randomAlphabet ({ isUupper = false } = {}) {
      // a的Unicode值为97,z的Unicode值为123
      const alphabet = String.fromCharCode(Math.floor(Math.random() * 25) + 97)
      if (!isUupper) {
        return alphabet
      } else {
        return alphabet.toUpperCase()
      }
    },

    /**
     * 生成图片验证码
     * @param {number} length 图片验证码位数
     * @param {boolean} typeMix 数字和字母混合
     * @param {string} pureNumber 纯数字('number')或者字母('alphabet')
     * @param {boolean} randomTypeLen 随机生成类型个数组合
     * @param {boolean} capsLookMix 字母大小写混合
     * @param {number} numLength 混合类型下的数字个数
     * @param {number} uupperLength 大写字母的个数
     */
    makeIdentifyCode ({ length = 4, typeMix = true, pureNumber = 'alphabet', randomTypeLen = false, capsLookMix = false, numLength = 2, uupperLength = 1 } = {}) {
      this.makeCode = ''
      // 数字和字母混合
      if (typeMix) {
        // 随机生成类型个数组合
        if (randomTypeLen) {
          // 字母大小写混合
          if (capsLookMix) {
            const numLength = Math.floor(Math.random() * length) + 1
            const uupperLength = numLength === length ? 0 : Math.floor(Math.random() * (length - numLength)) + 1
            for (let i = 0; i < numLength; i++) {
              this.makeCode += this.randomNum()
            }
            for (let i = 0; i < uupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (numLength + uupperLength < length) {
              for (let i = 0; i < length - numLength - uupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            const numLength = Math.floor(Math.random() * length) + 1
            for (let i = 0; i < numLength; i++) {
              this.makeCode += this.randomNum()
            }
            if (numLength < length) {
              for (let i = 0; i < length - numLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          }
        } else {
          // 字母大小写混合
          if (capsLookMix) {
            const tempNumLength = numLength < 0 ? 2 : numLength > length ? 2 : numLength
            const tempUupperLength = uupperLength < 0 ? 1 : uupperLength > length - tempNumLength ? 1 : uupperLength
            for (let i = 0; i < tempNumLength; i++) {
              this.makeCode += this.randomNum()
            }
            for (let i = 0; i < tempUupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (tempNumLength + tempUupperLength < length) {
              for (let i = 0; i < length - tempNumLength - tempUupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            const tempNumLength = numLength < 0 ? 2 : numLength > length ? 2 : numLength
            for (let i = 0; i < tempNumLength; i++) {
              this.makeCode += this.randomNum()
            }
            if (tempNumLength < length) {
              for (let i = 0; i < length - tempNumLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          }
        }
      } else {
        // 纯数字('number')
        if (pureNumber === 'number') {
          for (let i = 0; i < length; i++) {
            this.makeCode += this.randomNum()
          }
        }
        // 纯字母('alphabet')
        if (pureNumber === 'alphabet') {
          // 字母大小写混合
          if (capsLookMix) {
            const tempUupperLength = uupperLength < 0 ? 1 : uupperLength > length ? 1 : uupperLength
            for (let i = 0; i < tempUupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (tempUupperLength < length) {
              for (let i = 0; i < length - tempUupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            for (let i = 0; i < length; i++) {
              this.makeCode += this.randomAlphabet()
            }
          }
        }
      }
      this.shuffle(this.makeCode)
    },

    /**
     * 图片验证码随机排序
     * @param {string} str 图片验证码
     */
    shuffle (str) {
      this.identifyCode = [...str].sort(() => Math.random() - 0.5).join('')
      //console.log(this.identifyCode)
    },

    /**
     * 更换图片验证码
     */
    refreshCode () {
      this.makeIdentifyCode({ randomTypeLen: true })
    }
  },
}
</script>

<style scoped>
.registers{
  position: fixed;
  bottom: 0%;
  top: 0%;
  left: 0%;
  right: 0%;
        width: 100%;
		    height: 100vh;	/* 重点一 */
		    margin: 0 auto;
		    background-image: url(../assets/img/register.jpg);
		    background-repeat: no-repeat;
		    background-size: cover; /* 重点二 */
}

</style>
