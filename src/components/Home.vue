<template>
  <div class="home" v-cloak>
    <div  id="desktop"  :style="{backgroundImage: 'url(' + coverImgUrl + ')',backgroundSize:'cover',backgroundRepeat: 'no-repeat'}">  
     <ul  class="list" style="width:100%;height:100%;">
       <li v-for="(app,index) in allApps" :key="index">
         <img :src="app.img" alt="图标未加载">
         <span>{{app.appName}}</span>
         <span v-show="false" class="appId">{{app.id}}</span>
         <span v-show="false" class="appstatus">{{app.status}}</span>
         <span v-show="false" class="appusers">{{app.users.id}}</span>
        </li>
     </ul>
    
     <div v-if="resultHome" class="contextmenu">
      <div class="header">可执行操作</div>
      <ul>
        <li data-value="create"   v-if="admin"><img src="../assets/images/add.png" alt="图标未加载">新增应用</li>
        <li data-value="open"><img src="../assets/images/open.png" alt="图标未加载">打开</li>
         <li data-value="edit"  v-if="admin"><img src="../assets/images/edit.png" alt="图标未加载">编辑</li>
        <li data-value="cancel"><img src="../assets/images/cancel.png" alt="图标未加载">取消</li>
        <li data-value="rollback" v-if="!admin"><img src="../assets/images/apply.png" alt="图标未加载">更多操作</li>
        <li data-value="search"><img src="../assets/images/search.png" alt="图标未加载">全站搜</li>
        <li data-value="allScreen"><img src="../assets/images/switch.png" alt="图标未加载">切换壁纸</li>
        <li data-value="refresh"><img src="../assets/images/refresh.png" alt="图标未加载">刷新</li>
        <li data-value="exit"><img src="../assets/images/exit.png" alt="图标未加载">注销</li>
        <li data-value="del"  v-if="admin"><img src="../assets/images/trash.png" alt="图标未加载">删除</li>
        <li data-value="suo"  v-if="admin"><img src="../assets/images/suo.png" alt="图标未加载">{{suoName}}</li>
      </ul>
     </div>

     <div class="dialog" v-show="add" style="height:44.2%">
      <div class="cont">
        <el-form>
          <el-form-item>
            <input style="text-align:center" type="text" v-model="appname" maxlength="7" placeholder="请输入应用名称(7字以内)"/> 
          </el-form-item>
          <el-form-item>
          <div class="uploadimg" style="height:158px">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="http://localhost:9090/mysite/api/uploadImg"
              name="picture"
              :file-list="fileList"
              :multiple="false"
              accept="image/*"
              list-type="picture"
              :before-upload="beforeAvatarUpload"
              :on-progress="beforeprogressUpload"
              :on-change="handleChange" 
              :on-success="handleSuccess"
              :auto-upload="false">
              <span style="background-color:#7996e4cc;width:100%;margin-top:5%;margin-left:0%">&nbsp;&nbsp;应用图标（点击上传）</span>
            </el-upload>
          </div>
          </el-form-item>
        </el-form>
        <span  @click="addApp">确认</span>
        <span @click="cancelAdd">取消</span>
      </div>
     </div>

   <div class="dialog" v-show="editShow" style="height:44.2%">
      <div class="cont">
        <el-form>
          <el-form-item>
            <input style="text-align:center" type="text" v-model="editName" maxlength="7" placeholder="请输入应用名称(7字以内)"/> 
          </el-form-item>
          <el-form-item>
          <div class="uploadimg" style="height:158px">
            <el-upload
              class="upload-demo"
              ref="editUpload"
              action="http://localhost:9090/mysite/api/editImg"
              name="editImage"
              :file-list="editList"
              :multiple="false"
              accept="image/*"
              :before-upload="editAvatarUpload"
              :on-progress="editprogressUpload"
              :on-change="editChange" 
              :on-success="editSuccess"
              list-type="picture"
              :auto-upload="false">
               <span style="background-color:#7996e4cc;width:100%;margin-top:5%;margin-left:0%">&nbsp;&nbsp;更改图标（点击上传）</span>
            </el-upload>
          </div>
          </el-form-item>
        </el-form>
        <span  @click="editSubmit">确认</span>
        <span @click="cancelEdit">取消</span>
      </div>
     </div>

     <!-- 搜索 -->
     <div class="dialog"  v-show="searchInput" style="height:0%;margin-top:-13%;width:40%;margin-left:-8%">
       <div class="cont">
         <div class="search">
          <el-input v-model="keywords" @keyup.enter.native="searchResult" placeholder="请输入搜索关键字">
             <a @click="tonoSearhInput" style="cursor:pointer;font-size:1.3em" slot="prepend">隐</a>
            <el-button slot="append"  @click="searchResult" icon="el-icon-search"></el-button>
          </el-input>
        </div>
       </div>
     </div>

     <!-- 桌面壁纸 -->
     <div class="dialog" v-show="desktopImgs">
      <div class="cont">
     <el-dialog
     style="margin-top:-5%"
     width="55%" 
     :append-to-body="true"
     class="abow_dialog"
     :modal-append-to-body='false'
      title="选择壁纸"
      :visible.sync="desktopImgs"
      center>
      
       <el-dialog
        width="25%"
        title="上传壁纸"
        :visible.sync="uploadDeskVisible"
        :show-close="false" 
        append-to-body center>
        <div>
           <div align="center">
            <el-upload
              class="upload-demo"
              ref="DeskUpload"
              action="http://localhost:9090/mysite/api/uploadImg"
              name="picture"
              :file-list="deskList"
              :multiple="false"
              accept="image/*"
              :before-upload="DeskAvatarUpload"
              :on-progress="DeskprogressUpload"
              :on-change="DeskChange" 
              :on-success="DeskSuccess"
              list-type="picture-card"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <span class="deskimgSpan" @click="canselDeskImg">取 消</span>
          <span class="deskimgSpan" type="primary" style="background-color:#47bb8f" @click="uploadDeskImg()">上传</span>
        </span>
     </el-dialog>
      
      <div style="height:400px;overflow: auto;">
        <div  style="height:375px" align="center">
           <div>
            <div   v-for="(deskImg,index) in deskAllImgs" :key="index" style="overflow:auto;cursor:pointer;">
            <el-image
            :class = "isactive == index ? 'myselectClass' : '' "
            @click='addSelectClass(index,deskImg)'
            style="width: 90%; height:375px;margin-top:1%;margin-left:3%;margin-bottom:1%"
            :src="deskImg.url"
            fit="fill"
            lazy>
            <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
            </div>
            </el-image>
            <i v-if="admin" @click.stop="delteDeskImg(deskImg)" class="el-icon-delete"></i>
            </div>
            </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="color:#000000">
         <span class="deskimgSpan"  @click="desktopImgs=false">取消</span>
         <span style="background-color:#47bb8f" class="deskimgSpan"  @click="makeDeskImg">确认</span>
        
         &nbsp;&nbsp;&nbsp;&nbsp;
          <i style="font-size:1.3em;" @click="addDeskImg" class="el-icon-upload2"></i>
      </div>
     </el-dialog>
      </div></div>


    </div>
    <!-- 关注 -->
    <el-dialog
    style="margin-top:-5%"
    title="提示"
    :visible.sync="takemeDialogVisible"
    width="28%"
    center>
    <div align="center">
    <span style="font-size:1.3em">请与<span style="color:#409effcf">管理员</span>联系，申请更多权限！</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <span style="background-color:#d3e8ff" class="deskimgSpan"  @click="takemeDialogVisible = false">确认</span>
    </span>
    </el-dialog>

     <el-dialog
    style="margin-top:-5%"
    title="提示"
    :visible.sync="suoDialogVisible"
    width="28%"
    center>
    <div align="center">
    <span style="font-size:1.3em">此应用已经被锁定，若要对其进行相关操作，请与<span style="color:#409effcf">此应用创建者</span>联系，将应用进行解锁！</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <span style="background-color:#d3e8ff" class="deskimgSpan"  @click="suoDialogVisible = false">确认</span>
    </span>
    </el-dialog>


  </div>
</template>

<script>
//npm安装nprogress,此处引入
import NProgress from 'nprogress';

//引入相关js
import {tools} from '../assets/homejs/tools';
import {startMove} from '../assets/homejs/startMove';
import {Contextmenu} from '../assets/homejs/object';

//引入axios
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import global_ from './../global'

//解决axios的post传参问题
import qs from 'qs'

Vue.use(VueAxios, axios)

export default {
  name: 'HelloWorld',
  data () {
    return {
      //壁纸
      routerDesktop:false,
        isactive : -1,
        coverImgUrl:'',
        selectedImg:'',
        uploadDeskVisible:false,
        selectImgId:0,

        //壁纸上传
        deskList:[],
        DeskImgUrl:'',
        deskAllImgs:[],
        suoDialogVisible:false,


      add:false,
      allApps:[],
      //图片列表
      fileList:[],
      //上传表单数据
      appname:'',
      imgurl:'',

      //编辑
      editId:-1,
      storeName:'',
      editShow:false,
      editName:'',
      editStatus:'',
      editUserId:-1,
      editList:[{name:'',url:''}],
      editImgUrl:'',//修改了上传图标才使用

      //搜索
      keywords:'',
      searchInput:false,


      //桌面壁纸
      desktopImgs:false,
      takemeDialogVisible:false,

      admin:false,
      userRoleName:'',
      resultHome:false,
      userId:0,
      suoName:'',

    }
  },
  created(){
    this.resultHome=true;
     //拦截器。判断是否刷新token值。
    axios.interceptors.request.use((config) => {
      var haveToken=localStorage.getItem("haveToken");
      var token=localStorage.getItem("token");
      var now=new Date();
      var diff=now.getTime()-parseInt(haveToken);
      var hhDiff=diff/(3600*1000*24);
      //console.log(haveToken+"出错在哪？"+token+"判断值："+hhDiff);
      if(hhDiff>14){
        //7天有效期。
        //每次访问，清空缓存
         localStorage.removeItem('token');
         localStorage.removeItem('haveToken');
         localStorage.removeItem('userId');
         localStorage.removeItem('userRole');
         localStorage.removeItem('changeId');
         localStorage.removeItem('did');
         if(token==null){
           this.$router.push({path:'/login'}); 
         }
      }else{
        localStorage.setItem("haveToken",now.getTime());
      }
      return config;  //添加这一行
    }, (error) => {
      return Promise.reject(error);
    });
  },
  mounted(){
    
    axios.defaults.baseURL = global_.API_BASEURL;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$root.getToken() ;
    
    this.userRoleName=localStorage.getItem("userRole");
    this.isAdmin();
     this.initDesktop();
   
    this.getAllApp();
    
    //拿到背景图片
    this.getDeskImg();
    

     //拿到用户角色
     this.userId=parseInt(localStorage.getItem("userId"));

  },
  methods:{
    exitLogin(){
       this.$confirm('此操作将退出登陆状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center:true,
          customClass:'defineClass'
        }).then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('haveToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          localStorage.removeItem('changeId');
          localStorage.removeItem('did');
          this.$router.push({path:'/login'}); 
          this.$message({
            type: 'success',
            message: '已退出，请重新登录!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
    },
    isAdmin(){
       if(this.userRoleName=="管理员"){
         this.admin=true;
       }else{
         this.admin=false;
       }
    },
    applyMore(){
      this.takemeDialogVisible=true;
    },
    uploadDeskImg(){
      //提交上传
      if(this.deskList.length>0){
        this.$refs.DeskUpload.submit();
      }else{
        this.$message({
              message: '未选择上传图片',
              type: 'warning',
               center: true,
               duration:2500
          });
      }
    },
    canselDeskImg(){
      this.$refs.DeskUpload.abort();
      uploadDeskVisible=false
    },
    //切换壁纸
    seeAllDesktopImg(){
      this.getAllDeskImg();
      this.desktopImgs=true;
    },
    addSelectClass(index,deskImg){
      this.isactive = index;
      this.selectImgId=deskImg.id;
    },
    makeDeskImg(){
      //确认
      if(this.selectImgId==0){
        this.$message({
              message: "未选择壁纸",
              type: 'warning',
              center: true,
              duration:2500
            });
      }else{
        //更新状态。再找壁纸
       this.updateDeskImg();
      }
    },
    updateDeskImg(){
      var url="updateDeskImg?id="+this.selectImgId;
      var self=this;
      this.axios.put(url,{}).then((res)=>{
        if(res.data.code=="0000"){
           self.getDeskImg();
           this.desktopImgs=false;
           self.selectImgId=0;
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

    delteDeskImg(deskImg){
      var id=deskImg.id;
      var delteUrl=deskImg.url;
      var url="/deleteDeskImg?id="+id+"&imgurl="+delteUrl;
      var self=this;

      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           self.axios.delete(url,{}).then((response)=>{
          if(response.data.code=="0000"){
            self.getAllDeskImg();
            self.$message({
                message: "删除成功,"+response.data.data,
                type: 'success',
                center: true,
                duration:2500
                });
              }
          }).catch((error)=>{
            self.$message({
                  message: error,
                  type: 'error',
                  center: true,
                  duration:2500
                  });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration:2000
          });          
      });
    },
    addDeskImg(){
      //添加壁纸
      this.uploadDeskVisible=true;
    },
    getDeskImg(){
      var url="/getStatusDeskImg";
      var self=this;
      this.axios.get(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          this.coverImgUrl=res.data.data;
        }else{
          this.$message({
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
    },

    //搜索
    searchResult(){
      //先去清空ealstic，初始化内容
      var url="/deleteGetAllEs";
      var self=this;
      this.axios.post(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          //清空和初始化。
           var key=self.keywords;
		       self.$router.push({
            path: '/searchResult',
            query: {
            key: key
           }
         })

        }
      })
    },
    tonoSearhInput(){
      this.searchInput=false;
    },
    searchDialog(){
      this.searchInput=true;
    },
    create(){
      this.add=true;
    },
    handleChange(file, fileList){
       if (fileList.length > 0) {
            this.fileList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的文件
          }
    },
    DeskChange(file, fileList){
      if (fileList.length > 0) {
            this.deskList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的文件
        }
    },
    editChange(file, fileList){
         if (fileList.length > 0) {
            this.editList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的文件
         }
    },
    beforeAvatarUpload (file) {
      //上传前不做处理
    },
    DeskAvatarUpload(){
       //上传前不做处理
    },
    editAvatarUpload(file){
       //上传前不做处理
    },  

    DeskSuccess(res, file, fileList){
      //上传成功处理
      if(res.code=='0000'){
        this.DeskImgUrl=res.data;
        this.saveDestopImg();
      }else{
         this.$message({
              message: res.message,
              type: 'error',
              center: true,
              duration:2500
            });
       }
       this.deskList=[];
    },

    handleSuccess(res, file, fileList){
       if(res.code=='0000'){
         this.imgurl=res.data;
         this.saveApp();
       }else{
         this.$message({
              message: res.message,
              type: 'error',
              center: true,
              duration:2500
            });
       }
       this.fileList=[];
    },

    beforeprogressUpload(event, file, fileList){
      let loadProgress = Math.floor(event.percent) //这就是当前上传的进度
    },
    DeskprogressUpload(event, file, fileList){
      let loadProgress = Math.floor(event.percent) //这就是当前上传的进度
    },
    editprogressUpload(event, file, fileList){
       let loadProgress = Math.floor(event.percent) //这就是当前上传的进度
    },

    addApp(){
      var self=this;
      if(this.appname!="" && this.fileList.length>0){
         this.$refs.upload.submit();
      }else{
       if(this.appname==''){
            this.$message({
              message: '应用名称不能为空',
              type: 'warning',
               center: true,
               duration:2500
            });
             return;
           };
           if(this.fileList.length<=0){
             this.$message({
              message: '需上传应用图标',
              type: 'warning',
              center: true,
               duration:2500
            });
             return;
           }
      }
     
    },
    cancelAdd(){
      this.$refs.upload.abort();
      this.add=false;
      this.fileList=[];
      this.appname='';
    },
    getAllDeskImg(){
      //拿到所有壁纸
      var url="/findAllDeskImg";
      var self=this;
      this.axios.get(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          this.deskAllImgs=res.data.data;
        }else{
          self.$message({
              showClose: true,
              message:res.data.message,
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
    },
    //保存到数据库
    saveDestopImg(){
      //console.log(this.DeskImgUrl);
      var url="/saveDeskImg?url="+this.DeskImgUrl;
      var self=this;
      this.axios.post(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          self.deskList=[];
          self.getDeskImg();
          self.uploadDeskVisible=false;
          self.desktopImgs=false;
          self.$message({
              showClose: true,
              message: "图片已上传,且已设置为壁纸",
              type: 'success',
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
    saveApp(){
      var url="/saveApp?"+Math.random();
      var param={appName:this.appname,img:this.imgurl,userId:this.userId};
      var self=this;
      this.axios.post(url, qs.stringify(param)).then((response) => {
          if(response.data.code == '0000'){
            
            this.add=false;
            this.getAllApp();
            this.fileList=[];
            this.appname='';
            self.$message({
              showClose: true,
              message: "成功新增应用",
              type: 'success',
              center: true,
              duration:2500
            });
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
    getAllApp(){
      var url="/getAllAapp?"+Math.random();
      var self=this;
      this.axios.get(url,{}).then((response)=>{
        if(response.data.code=="0000"){
          self.allApps=response.data.data;
          self.initDesktop();
        }else{
          self.$message({
              message: response.data.message,
              type: 'warning',
              center: true,
              duration:2500
              });
        }
      }).catch((error)=>{
        self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
            });
      })
    },

    editApp(appItem){
      var uid=$(appItem).children(".appusers").text();
      var appstatus=$(appItem).children(".appstatus").text();
      if(appstatus=="解锁"){
        if(uid!=this.userId){
          this.suoDialogVisible=true;
          return;
        }
      };
      var id=$(appItem).children(".appId").text();
      var url="/getOneApp?id="+id;
      var self=this;
      axios.get(url,{}).then((response)=>{
        if(response.data.code=="0000"){
         // console.log(response.data);
         // console.log(response.data.data.appName);
          self.editName=response.data.data.appName;
          self.editStatus=response.data.data.status;//状态
          self.editUserId=response.data.data.users.id;//用户
          //console.log(self.editUserId+self.editStatus);
          self.editList[0].url=response.data.data.img;
          this.editId=response.data.data.id;
          this.storeName=response.data.data.img.replace('http://localhost:9090/mysite/files/','');
          self.editList[0].name=response.data.data.img.replace('http://localhost:9090/mysite/files/','');
          //editList:[{name:'',url:''}],
          self.editShow=true;
        }else{
          self.$message({
              message: response.data.message,
              type: 'error',
              center: true,
              duration:2500
            });
        }
      }).catch((error)=>{
        self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
            });
      })
    },
    editSubmit(){
      if(this.editList[0].name==this.storeName){
        //判断是否是原图标，是则只保存名称。
        //this.editImgUrl=this.editList[0].url;
        this.onlyName();
      }else{
         //否，则上传图片，并保存图标。
        this.$refs.editUpload.submit();
      }
    },
    onlyName(){
      var url="/putAppName?id="+this.editId+"&editName="+this.editName;
      var self=this;
      //var param={id:this.editId,editName:this.editName};
      axios.put(url,{}).then((response)=>{
        if(response.data.code=='0000'){
          self.getAllApp();
          self.$message({
              showClose: true,
              message: "修改成功",
              type: 'success',
              center: true,
              duration:2500
            });
          self.editShow=false;
          self.editName="";
          self.editList=[{name:'',url:''}];
          self.editId=-1;
        }
      }).catch((error)=>{
        self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
      })
    },
    editSuccess(res, file, fileList){
       if(res.code=='0000'){
         this.editImgUrl=res.data;
         this.saveEdit();
       }else{
         this.$message({
              message: res.message,
              type: 'error',
              center: true,
              duration:2500
            });
       }
       this.fileList=[];

    },
    saveEdit(){
      var url="/saveEditApp?oldImgName="+this.storeName+"&userId="+this.editUserId;
      var param={id:this.editId,appName:this.editName,img:this.editImgUrl,status:this.editStatus};
      var self=this;
      this.axios.put(url, param).then((response) => {
          if(response.data.code == '0000'){
            self.getAllApp();
            self.editShow=false;
            self.editName="";
            self.editList=[{name:'',url:''}];
            self.editId=-1;
            self.$message({
              showClose: true,
              message: "修改成功,且"+response.data.data,
              type: 'success',
              center: true,
              duration:2500
            });
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
    cancelEdit(){
      this.$refs.editUpload.abort();
      this.editShow=false;
      this.editName="";
      this.editList=[{name:'',url:''}];
    },
    suoapp(appItem){
      //console.log(appItem);
      //加锁：非锁定，解锁：已锁定
      var id=$(appItem).children(".appId").text();
      var uid=$(appItem).children(".appusers").text();
      var appstatus=$(appItem).children(".appstatus").text();

      if(uid==this.userId){
        this.realsuo(id,appstatus);
      }else{
        this.$message({
            message: "非应用创建者，无法对应用进行加解锁操作！",
            type: 'warning',
            center: true,
             duration:3500
          });
      }
    },
    realsuo(id,appstatus){
      var remessage='';
      if(appstatus=="加锁"){
         remessage="已将应用加锁，其他用户无法再对此应用进行任何操作";
      }else{
         remessage="已解锁应用";
      }


      var url="/suoapp?id="+id;
      var self=this;
      this.axios.post(url, {}).then((res)=>{
        if(res.data.code=="0000"){
          self.getAllApp();
           self.$message({
             showClose: true,
              message: remessage,
              type: 'success',
              center: true,
              duration:4000
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
    deleteApp(appItem){
      var uid=$(appItem).children(".appusers").text();
      var appstatus=$(appItem).children(".appstatus").text();
      if(appstatus=="解锁"){
        if(uid!=this.userId){
          this.suoDialogVisible=true;
          return;
        }
      };
      //参数
      var id=$(appItem).children(".appId").text();
      var url="/deleteApp/"+id;
      var self=this;

      this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           self.axios.delete(url,{}).then((response)=>{
        if(response.data.code=="0000"){
          self.getAllApp();
          self.$message({
              message: "删除成功,且"+response.data.data,
              type: 'success',
              center: true,
              duration:2500
                });
            }
          }).catch((error)=>{
            self.$message({
                  message: error,
                  type: 'error',
                  center: true,
                  duration:2500
                  });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration:2000
          });          
      });
    
    },
    
    openFrame(appItem){
      //状态，是否锁定。
      var uid=$(appItem).children(".appusers").text();
      var appstatus=$(appItem).children(".appstatus").text();
      if(appstatus=="解锁"){
        if(uid!=this.userId){
          this.suoDialogVisible=true;
          return;
        }
      };
      localStorage.setItem("changeId",'');
      var id=$(appItem).children(".appId").text();
      //console.log(appItem); 
      //alert(id);
      //带id参数，做路由的跳转
       this.$router.push({
          path: '/frame',
          query: {
            id: id
          }
        })
    },

    //传参
    getParam(appItem){
          var that=this;
          var contextmenu = desktop.querySelector('.contextmenu');
          var menuItem = contextmenu.querySelectorAll('li');
            var dialog = desktop.querySelector('.dialog');
            var dialogControl = dialog.querySelectorAll('span');
            for (var j = 0; j < menuItem.length; j++) {
              menuItem[j].onclick = function () {
                var dataVal = this.getAttribute('data-value');
                
                switch(dataVal) {

                  case 'create': //创建
                    that.create();
                  break;

                  case 'edit': //编辑
                    that.editApp(appItem);
                  break;

                  case 'refresh':  //刷新
                    history.go();
                  break;

                  case 'cancel':  //取消
                    alert("点击了取消按钮，已生效");
                  break;

                  case 'del'://删除
                    that.deleteApp(appItem);
                  break;

                  case 'rollback': //撤销
                    that.applyMore();
                  break;

                  case 'allScreen'://全屏
                    that.seeAllDesktopImg();
                  break;

                  case 'open'://打开
                    that.openFrame(appItem);
                  break;

                  case 'suo'://打开
                    that.suoapp(appItem);
                  break;

                  case 'search'://搜索
                     that.searchDialog();
                  break;

                  case 'exit'://退出登录
                    that.exitLogin();
                  break;
                }
              };
            }
    },

//初始化桌面jq
initDesktop(){
    var that=this;
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    this.$nextTick(() => {
      var desktop = document.querySelector('#desktop');
      var appList = desktop.querySelector('.list')
      var appItem = appList.querySelectorAll('li');
      var contextmenu = desktop.querySelector('.contextmenu');
      var dateWrapper = desktop.querySelector('.date');

      var publicFn = {
        appColumn: function () {}
      };
      
      // 竖向排列,应用排列
      ;(function (window, undefined) {
        publicFn.appColumn = function () {
          var appItem = appList.querySelectorAll('li');
          if(appItem.length>0){
            var appItem_h = appItem[0].offsetHeight + 20;
             var appItem_w = appItem[0].offsetWidth + 10;
          };
         
          for (var i = 0; i < appItem.length; i++) {
            var column = (i - i % 5) / 5;

            appItem[i].style.left = column * appItem_w + 'px';
            appItem[i].style.top = i % 5 * appItem_h + 'px';
          }
        };
        publicFn.appColumn();
      })(window);

      // 框选APP
      ;(function (window, undefined) {
        var startX = 0, startY = 0;
        var ifLeft = false, ifTop = false;
        var offsetL = 0, offsetT = 0;

        desktop.onmousedown = function (ev) {
      
      //桌面点击，去除选中样式
       var appItem = appList.querySelectorAll('li');
        for (var i = 0; i < appItem.length; i++) {
          tools.removeClass(appItem[i], 'hover');
         }
        };
      })(window);
      
      // APP 事件 && document 事件
      ;(function (window, undefined) {
        var during = 30;
        var clickNum = 0;
        
        //鼠标按下选中
        for (var i = 0; i < appItem.length; i++) {
          appItem[i].onmousedown = function (ev) {
            that.suoName=$(this).children(".appstatus").text();
            that.getParam(this);
            ev.stopPropagation();
            return false;
          };

          appItem[i].onclick = function () {
          for (var i = 0; i < appItem.length; i++) {
            tools.removeClass(appItem[i], 'hover');
          }
          tools.toggleClass(this, 'hover');
          };
        
        //应用双击事件，打开应用页面
          appItem[i].ondblclick = function () {
            that.openFrame(this);
          };

          appItem[i].oncontextmenu = function (ev) {
            if (tools.hasClass(this, 'hover')) {
              //鼠标放上去

              var fnContextmenu = new Contextmenu(this, ev, contextmenu);
            }

            ev.stopPropagation();
            return false;
          };
        }

        document.oncontextmenu = function (ev) {
          //鼠标点击
           //appStatus:'加锁',
           
          var fnContextmenu = new Contextmenu(this, ev, contextmenu);

          return false;
        };
      })(window);
      that.getParam();//初始化

      // 右键菜单点击
     /* ;(function (window, undefined) {
        //var appItem = null;
        
      })(window);*/

      NProgress.done();
      })
      }
  },
}
</script>

<style scoped>
@import '../assets/css/nprogress.css';
@import '../assets/css/style.css';
.el-upload-dragger{
  height: 20px;
}


.uploadimg{
  display: block;
  border: none;
  outline: none;
  background: none;
  width: 60%;
  height: 100px;
  padding: 0 10px;
  line-height: 40px;
  margin: 0 auto 10px;
  border: 1px solid #000;
  background-color: rgba(0, 0, 0, .6);
  border-radius: 8px;
  color: #ccc;
  font-family: "Microsoft Yahei";
}

/* 边框效果 */
.myselectClass{
  padding:10px;
border:1px solid #000;
-moz-box-shadow:3px 3px 4px #000;
-webkit-box-shadow:3px 3px 4px #000;
box-shadow:3px 3px 4px #000;
background:#fff;
filter:progid:DXImageTransform.Microsoft.Shadow(Strength=4,Direction=135,Color='#000000');
}
.deskimgSpan{
  display: inline-block;
  width: 80px;
  height: 40px;
  margin: 0 6px;
  line-height: 40px;
  text-align: center;
  border-radius: 6px;
  color: #ccc;
  background-color: rgba(0, 0, 0, .6);
  cursor: default;
}


/* 上传图片样式更改 */
   div /deep/ .el-list-enter-active,
   div /deep/ .el-list-leave-active {
      transition: none;
    }
 
   div /deep/ .el-list-enter,
   div /deep/ .el-list-leave-active {
      opacity: 0;
    }
    div  /deep/ .el-upload-list {
      height: 40px;
    }

</style>
<style>
.defineClass{
    margin-top:-38%;
   
    }
  [v-cloak] {
display: none;
}
</style>