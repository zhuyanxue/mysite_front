<template>
  <div class="reset" style="margin: 0px;border: 0px;padding: 0px;font-family: Kaiti;">
    <div align="center">
        <div style="margin-top:5%">
        <img src="../assets/img/logo.png" width="6%"/>
        <div style="margin-top:1%;font">
          <span style="font-size:1.4em;color:green;">
              <span style="border-radius: 50%; margin-top:2.5px;margin-right:-5px;   height: 20px;    width: 20px;    display: inline-block;    background: #f30303;      vertical-align: top;">  
              <span style="display: block;    color: #FFFFFF;    height: 20px;    line-height: 20px;    text-align: center">沐</span>  
          </span>
            重新设置密码</span>
        </div>
      </div>
        <div  style="margin-top:3.5%;margin-left:-9.5%;">
            <div  v-show="takeNext"  style="width:32%">
                <el-form ref="form" label-position="right"   label-width="150px">
                    <el-form-item>
                        <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">电子邮箱：</span>
                        <el-autocomplete
                        style="width:100%"
                        class="inline-input"
                        v-model="email"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入电子邮箱账号"
                        :trigger-on-focus="false"
                        ></el-autocomplete>
                    </el-form-item>
                     <el-form-item>
                        <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">验证码：</span>
                        <el-input  v-model="emailCode" placeholder="请输入收到的验证码" style="width:70%;float:left" clearable></el-input>
                        
                        <!-- 倒计时验证码 -->
                         <span  style="width:14%;">
                        <el-button
                            type="primary"
                            @click="getVerify"
                            style="width:30%;"
                            :disabled="disabled=!show"
                        >
                        <span v-show="show">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                        </el-button>
                         </span>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click.native="submitNext" round style="width:40%;margin-left:30%">下一步</el-button>
            </div>
            
            <!-- 设置密码 -->
            <div v-if="!takeNext" style="width:32%">
                <el-form ref="form" label-position="right"   label-width="150px">
                    <el-form-item>
                    <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">新密码：</span>
                    <el-input v-model="password"  placeholder="请设置新密码" show-password  clearable  :prefix-icon="iconshow"></el-input>
                </el-form-item>
                <el-form-item @mouseleave.native="respass">
                    <span slot="label" style="font-size:1.2em;letter-spacing:-0.1em;">确认密码：</span>
                    <el-input v-model="repassword"  placeholder="请确认密码" show-password  :prefix-icon="iconshow"></el-input>
                </el-form-item>
                </el-form>
                <el-button type="primary" @click="submitNewPassword" round style="width:40%;margin-left:30%">确定</el-button>
            </div>


            <div v-show="canseeImg" style="margin-top:5%;margin-left:8%">
                <div>账号信息二维码（请扫描以获得你更改的账号信）</div>
                <img :src="userInfo" width="150" height="150"/>
            </div>
            
        </div>
        <div class="footer" align="center">
            <div style="margin-top:1%;font-size:1.3em"><a @click="imgDialogVisible=true"><u>二维码生成</u></a></div>
        </div>
    </div>

    <el-dialog
    title="密码更改成功"
    :visible.sync="tipDialogVisible"
    width="30%"
    center>
    <div>
        <h3>此邮箱的关联账号有{{usernum}}个</h3>
        <div>
            
            <div v-if="successImg">
                <div align="center">
                <span>请扫描下方二维码，查看账号和密码</span>
                <img :src="userInfo" width="300" height="300"/>
                </div>
            </div>

            <div v-if="!successImg">
                <span v-for="user in userList" :key="user.id">
                    用户名：{{user.name}},密码：{{newPassword}}<br>
                </span>
            </div>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLogin">取 消</el-button>
        <el-button type="primary" @click="gotoLogin">去登录</el-button>
    </span>
    </el-dialog>

    <el-dialog
    title="！提示（只能使用纯文本）"
    :visible.sync="imgDialogVisible"
    width="38%"
    center>
    <div>
        <el-input
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 15}"
        placeholder="请输入二维码想要展示的内容"
        v-model="imgContent">
        </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="imgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="newUrlImg">确 定</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
//引入axios
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import global_ from './../global'

//解决axios的post传参问题
import qs from 'qs'

Vue.use(VueAxios, axios)


export default {
  name: 'Java',
  data () {
    return {
        imgDialogVisible:false,
        imgContent:'',

        email:'',
        emailCode:'',
        iconshow:'',
        takeNext:true,

        //密码
        password:'',
        repassword:'',

        //二维码路径
        userInfo:'',
        usernum:0,

        userList:[],
        newPassword:'',

        successImg:true,
        canseeImg:false,

        //倒计时验证码
        show: true,
        count: "", // 初始化次数
        timer: null,
        tipDialogVisible:false,
     
    }
  },
  mounted(){
    axios.defaults.baseURL = global_.API_BASEURL;
  },
  methods:{
      newUrlImg(){
          var url="/newUrlUserImg?content="+this.imgContent;
          var self=this;
          this.axios.post(url,{}).then((res)=>{
              if(res.data.code=="0000"){
                  self.$message({
                    showClose: true,
                    message: "二维码图片已生成，请到C盘根目录查看："+res.data.data,
                    type: 'success',
                    center: true,
                    duration:8500
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
      respass(){
     if(this.repassword!=''&&this.repassword==this.password){
         this.iconshow="el-icon-check";
       }else{
         this.iconshow="";
       }
      },
      gotoLogin(){
        if(this.userInfo!=''){
       this.deleteImg();}
        this.canseeImg=false;
       this.tipDialogVisible=false;
       this.takeNext=true;
       this.$router.push({path:'/login'}); 
      },
      cancelLogin(){
       if(this.userInfo!=''){
       this.deleteImg();}
       this.canseeImg=true;
       this.tipDialogVisible=false;
       this.email='';
       this.emailCode='';
       this.takeNext=true;
     },
      //删除二维码图片
    deleteImg(){
        var url="/delteInfoImg?imgurl="+this.userInfo;
        var self=this;
        this.axios.post(url,{}).then((res)=>{
            if(res.data.code=="0000"){
                self.successImg=true;
                console.log("已删除二维码！");
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

    //校验验证码
   nextReset(){
       var url="/submitCode?code="+this.emailCode;
       var self=this;
       this.axios.post(url,{}).then((res)=>{
           if(res.data.code=="0000"){
               this.takeNext=false;
           }else{
             self.$message({
              message: res.data.message,
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
   submitNewPassword(){
       if(this.repassword!=''&&this.repassword==this.password){
        this.realNewPassword();
       }else{
           this.$message({
              message: "两次密码输入不一致",
              type: 'error',
              center: true,
              duration:2500
              });
       }
   },
   realNewPassword(){
        var url="/subNewPassword";
        var param={email:this.email,password:this.password};
        var self=this;
        this.axios.post(url,qs.stringify(param)).then((res)=>{
            if(res.data.code=="0000"){
                this.userInfo=res.data.message;
                this.usernum=res.data.data;
                this.tipDialogVisible=true;
                this.canseeImg=true;
            }else{
                this.successImg=false;
                this.userList=res.data.data;
                this.usernum=parseInt(res.data.message);
                this.tipDialogVisible=true;
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
   submitNext(){
        if(this.email!='' && this.emailCode!=''){
            this.nextReset();
        }else{
            if(this.email==''){
                 this.$message({
					showClose: true,
					message: "请输入邮箱账号",
					type: 'warning',
					center: true,
					duration:2500
                });
                return;
            };
            if(this.emailCode==''){
                 this.$message({
					showClose: true,
					message: "请输入邮箱验证码",
					type: 'warning',
					center: true,
					duration:2500
                });
                return;
            }
        }   
    },
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
      getVerify() {
          if(this.email==''){
             this.$message({
					showClose: true,
					message: "请先输入邮箱账号",
					type: 'warning',
					center: true,
					duration:2500
				});
          }else{
              if(this.email.indexOf("@") == -1){
                   this.$message({
					showClose: true,
					message: "请输入正确的邮箱账号",
					type: 'warning',
					center: true,
					duration:2500
				});
              }else{
                 const TIME_COUNT = 300; //更改倒计时时间
                if (!this.timer) {
                    this.sendCode();
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.show = true;
                            clearInterval(this.timer); // 清除定时器
                            this.timer = null;
                        }
                    }, 1000);
                }
              }

          }
      },

      //发送验证码
      sendCode(){
          var url="/sendIdentifyCode?emailAddress="+this.email;
          var self=this;
          this.axios.post(url,{}).then((res)=>{
              if(res.data.code=='0000'){
                  self.$message({
					showClose: true,
					message: "验证码已发送，请注意查收。有效时间：5分钟。",
					type: 'success',
					center: true,
					duration:5500
				});
              }else{
                  self.$message({
					showClose: true,
					message: res.data.message,
					type: 'warning',
					center: true,
					duration:3500
                });
                this.show = true;
                clearInterval(this.timer); // 清除定时器
                this.timer = null;
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
  }
}
</script>

<style scoped>
.footer{
    position: fixed;
    left:0%;
    right: 0;
    bottom: 5%;
    cursor:pointer;
}

</style>
