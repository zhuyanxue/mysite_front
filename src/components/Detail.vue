<template>
  <div class="detail" style="overflow:auto">
    <div title="Go now !" @click="toHOmePage" class="logoset" style="float:right;" >Home</div>
  <div  align="center">
		<div class="search">
			<el-input v-model="keywords" @keyup.enter.native="searchResult" placeholder="请输入搜索关键字">
			 	<el-button slot="append" @click="searchResult" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		</div>	
  <el-divider></el-divider>
    <el-container>
      <el-header style="margin-top:0%;margin-left:3%;margin-right:3%">
        <el-progress v-if="false" :text-inside="true" :stroke-width="24" :percentage="showProgress" status="success"></el-progress>
      </el-header>

      <el-main  v-bind:style="{minHeight: Height+'px'}">
        <el-container>
          <el-aside width="18%" style="margin-left:2%">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-size:1.1em;"><b>{{blockTitle}}</b></span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                <span v-if="admin" style="float:right;font-size:1.5em;cursor:pointer;"><i @click="newMinFrame=true" class="el-icon-plus"></i></span>
              </div>
              <div style="margin-left:-10%">
               <el-menu   :default-active="defaultMinFrameId"  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">

                <el-menu-item v-for="(minFrame,indexs) in allMinFrame" :index="minFrame.id.toString()" :key="indexs" @click.native="getDetailcontent(minFrame.id)">
                  <span  slot="title">{{minFrame.minTitle}}</span>
                  <span v-if="admin" style="float:right">
                      <i @click.stop="editMinFrame(minFrame)" class="el-icon-edit"></i>
			            	  <i @click.stop="deleteMinFrame(minFrame)" class="el-icon-delete"></i>
                  </span>
                </el-menu-item>

                </el-menu>
              </div>
            </el-card>
          </el-aside>

          <el-main style="margin-right:3%">
            <div align="center">
              <div style="width:70%;margin-right:15%">
                <el-collapse>
                  <el-collapse-item>
                    <div slot="title" style="margin-left:45%">
                      <span style="font-size:1.1em"><span ><i class="el-icon-star-on"></i></span>解读视频</span>
                      <span v-if="admin" style="font-size:1.2em;">
                         &nbsp;&nbsp; &nbsp;
                        <span style="color:#409EFF">
                        <i @click.stop="newVideo" class="el-icon-plus"></i> &nbsp;&nbsp;
			            	    <i @click.stop="editVideo" class="el-icon-edit"></i>
                        </span>
                      </span>
                    </div>
                    <div style="width:88%"  v-if="showVideo">
                      <!-- 视频播放器 -->
                      <video-player  class="video-player vjs-custom-skin"
                        ref="videoPlayer" 
                        :playsinline="true" 
                        :options="playerOptions"
                      ></video-player>
                    </div>
                    <div style="margin-top:5%;cursor:pointer;font-family: Kaiti;font-size:1.2em">
                      <span @click="editVideo">以往的视频？去了解</span>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>

            <!-- 显示、隐藏控制 -->
            <div align="center">
              <div style="margin-right:15%;margin-top:8%;margin-bottom:1%;">
              <el-switch style="font-family: Kaiti;"
               
                @change="control"
                v-model="showControl"
                active-text="全显"
                inactive-text="全隐"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>

              </div>
            </div>

            <!-- 主题 -->
            <div>
              <div v-for="(detail,indexs) in allDetails" :key="indexs">
              <el-card  class="box-card" shadow="hover" style="margin-top:3%">
                <div slot="header" class="clearfix">
                  <span>主题{{indexs+1}}：<b>{{detail.title}}</b></span>
                    <span v-if="admin" style="float:right;cursor:pointer;" >
                    <i @click.stop="editDetail(detail)" class="el-icon-edit"></i>  &nbsp;&nbsp;&nbsp;
                    <i @click.stop="deleteDetail(detail)" class="el-icon-delete"></i>
                    </span>
                </div>
                <div v-show="mycontent">
                    <div class="ql-editor" v-html="detail.details">
                      {{detail.details}}
                   </div>
                </div>
              </el-card>
                <el-collapse accordion>
                    <el-collapse-item>
                      <div slot="title" style="font-size:1.2em;margin-left:2%">
                        <i class="el-icon-notebook-2"></i>笔记
                         <el-divider direction="vertical"></el-divider>
                         <i @click.stop="newNote(detail.id)" class="el-icon-circle-plus-outline"></i>
                        &nbsp; &nbsp;
                        <el-tooltip v-if="switchInfo" class="item" effect="light" content="点击显示所有人的笔记" placement="top-start">
                          <el-button @click.stop="getAllNote" style="margin-top:-15px;" size="small" type="info" round>切换</el-button>
                        </el-tooltip>

                        <el-tooltip v-if="!switchInfo" class="item" effect="light" content="点击仅显示自己的笔记" placement="top-start">
                          <el-button @click.stop="getmMyNoye" style="margin-top:-15px;" size="small" type="primary" round>切换</el-button>
                        </el-tooltip>
                      </div>

                        <!-- 仅自己的笔记 -->
                      <div  v-if="switchInfo">
                      <div  style="margin-left:2%"  v-for="note in Array.prototype.reverse.call(detail.noteList)" :key="note.id">
                        <div style="margin-top:2%" v-if="userId==note.user.id">
                          &reg;<span>笔记作者：<span style="color:#409effcf">{{note.user.name}}</span>，添加时间：<span style="color:#409effcf">{{note.createDate | formatDate}}</span></span>
                           &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span  v-if="admin"><i @click.stop="deleteNote(note)" class="el-icon-delete"></i></span>
                           &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span  v-if="admin"><i style="font-size:1.01em" @click.stop="editNote(note)" class="el-icon-edit"></i></span>
                          <div>
                           &nbsp; &nbsp; &nbsp; &nbsp;<span style="font-size:1.1em">{{note.content}}</span>
                          </div>
                        </div>
                      </div>
                      </div>

                      <!-- 所有人的笔记 -->
                       <div v-show="!switchInfo">
                      <div   style="margin-left:2%"  v-for="note in Array.prototype.reverse.call(detail.noteList)" :key="note.id">
                        <div style="margin-top:2%">
                          &reg;<span>笔记作者：<span style="color:#409effcf">{{note.user.name}}</span>，添加时间：<span style="color:#409effcf">{{note.createDate | formatDate}}</span></span>
                           &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span  v-if="admin"><i  @click.stop="deleteNote(note)" class="el-icon-delete"></i></span>
                           &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span  v-if="admin"><i  style="font-size:1.01em" @click.stop="editNote(note)" class="el-icon-edit"></i></span>
                          <div>
                           &nbsp; &nbsp; &nbsp; &nbsp;<span style="font-size:1.1em">{{note.content}}</span>
                          </div>
                        </div>
                      </div>
                       </div>

            


                    </el-collapse-item>
                </el-collapse>
              </div>

              <!--<el-card  class="box-card" shadow="hover" style="margin-top:3%">
                <div slot="header" class="clearfix">
                  <span><b>主题2</b></span>
                    <span v-if="admin" style="float:right;cursor:pointer;" >
                    <i @click.stop="newbmin=true" class="el-icon-edit"></i>  &nbsp;&nbsp;&nbsp;
                    <i @click.stop="newbmin=true" class="el-icon-delete"></i>
                    </span>
                </div>
                <div v-show="mycontent">
                   <div class="ql-editor" v-html="detailContent">
                      {{detailContent}}
                   </div>
                </div>
              </el-card>-->


              <!-- 新增 -->
              <div v-if="admin" style="margin-top:3%;margin-left:42%;cursor:pointer;">
                <span style="font-size:2em">
                <i @click="newDetail" class="el-icon-plus"></i>
                </span>
              </div>

            </div>
          </el-main>

        </el-container>
      </el-main>

      <el-footer>
        <div align="center" style="color:#677f9a">
          <span>&reg;{{footerContent}}</span>
        </div>	
      </el-footer>
    </el-container>

    <!-- 新增minFrame -->
    <el-dialog
    title="新增"
    :visible.sync="newMinFrame"
    width="30%"
    :modal-append-to-body='false'
    center>
      <el-input
      placeholder="请输入小导航名称(12字以内)"
      maxlength="12"
      v-model="minFrameTitle"
      clearable>
      <span slot="prepend">小导航</span>
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSubFrame">取 消</el-button>
      <el-button type="primary" @click="subNewMinFrame">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增详情，使用富文本编辑器 -->


   
    <!-- min删除对话框 -->
    <el-dialog
    :modal-append-to-body='false'
    title="提示"
    :visible.sync="minDeleteVisible"
    width="30%"
    :before-close="handleClose"
    center>
    <div align="center"><span>你确定删除<span style="color:#409effcf">&nbsp;{{deleteMinTitle}}&nbsp;</span>小导航吗？</span></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="minDeleteVisible=false">取 消</el-button>
      <el-button type="primary" @click="submitDeleteMin">确 定</el-button>
    </span>
    </el-dialog>

    <!-- min编辑 -->
    <el-dialog
    title="编辑"
    :visible.sync="editminFrame"
    width="30%"
    :modal-append-to-body='false'
    center>
      <el-input
      placeholder="请输入小导航名称(12字以内)"
      maxlength="12"
      v-model="editMinTitle"
      clearable>
      <span slot="prepend">小导航</span>
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editminFrame=false">取 消</el-button>
      <el-button type="primary" @click="submitEditMin">确 定</el-button>
    </span>
	</el-dialog>

  <!-- 视频上传 -->
    <el-dialog
    title="上传解读视频"
    :visible.sync="videoVisible"
    width="30%" 
    :show-close="false" 
    center>
    <div align="center">
      <div style="margin-bottom:5%">
        置顶
      <el-switch
        v-model="controlTop"
        active-color="#13ce66"
        inactive-color="#eee6e0">
      </el-switch>
      </div>
     <el-upload
              class="upload-demo"
              ref="upload"
              action="http://localhost:9090/mysite/api/uploadVideo"
              name="video"
              :file-list="fileList"
              :multiple="false"
              accept="video/*"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :on-progress="beforeprogressUpload"
              :on-change="handleChange" 
              :on-success="handleSuccess"
              :auto-upload="false">
              <video style="height:100%;width:100%" slot="file" :src="file.url" slot-scope="{file}"/>
              <el-progress v-if="videoFlag" type="circle" :percentage="videoUploadPercent" style="margin-top:8%"></el-progress>
              
              <i  v-if="!videoFlag" class="el-icon-plus"></i>

              <!-- 视频上传进度条 -->

             <!-- <el-button  type="info" round>选择视频文件</el-button>-->
               <div slot="tip" class="el-upload__tip">每次只能上传一个视频文件，且不超过3GB！</div>
        </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelVideo">取 消</el-button>
      <el-button type="primary" @click="addVideo">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
  :visible.sync="detailDialogVisible"
  width="55%"
  center
  style="margin-top:-5%;margin-left:3%">
  <div slot="title">
    <!--<span>新增主题</span> -->
    <el-button @click="clearAll" plain>新增主题<span style="color:#409effcf"><i class="el-icon-eleme"></i>点击清空</span></el-button>
  </div>
  <div>
    <span>
      <el-input placeholder="请输入主题名称(57字以内)"  maxlength="57" v-model="detailNewTitle">
        <span slot="prepend">主题</span>
      </el-input>
    </span>
    <div style="height:405px">
     <!-- <editor v-model="detailNewContent"  @func="getDeleteImg" :value="detailNewContent"/> -->
      <editor v-model="detailNewContent" :imgOrignAll="imgOrignAll"  @func="getDeleteImg" :value="detailNewContent"/>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="detailDialogVisible = false">取 消</el-button>
    <el-button v-show="addedit" type="primary" @click="submitNewDetail">提交新增</el-button>
    <el-button v-show="!addedit" type="primary" @click="submitEditDetail">提交编辑</el-button>
  </span>
  </el-dialog>  

  <!--新增： 把html字符串变为元素，存入这里 -->
  <div v-show="false" id="htmlContainer">
    <div class="ql-editor" v-html="contentContainer">
        {{contentContainer}}
    </div>
  </div>

  <!--删除： 把html字符串变为元素，存入这里 -->
  <div v-show="false" id="htmlContainerDelete">
    <div class="ql-editor" v-html="contentContainerDelete">
        {{contentContainerDelete}}
    </div>
  </div>

  <!--编辑： 把html字符串变为元素，存入这里 -->
  <div v-show="false" id="htmlContainerEdit">
    <div class="ql-editor" v-html="contentContainerEdit">
        {{contentContainerEdit}}
    </div>
  </div>


    <el-dialog
    title="新增笔记"
    :visible.sync="newNoteDialogVisible"
    width="40%"
    center>
    <div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15}"
        placeholder="请输入笔记内容"
        v-model="newNoteContent">
      </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="newNoteDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitNewNote">确 定</el-button>
    </span>
   </el-dialog>

   <!-- 编辑 -->
    <el-dialog
    title="修改笔记"
    :visible.sync="editNoteDialogVisible"
    width="40%"
    center>
    <div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15}"
        placeholder="请输入笔记内容"
        v-model="editNoteContent">
      </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editNoteDialogVisible = false;">取 消</el-button>
      <el-button type="primary" @click="submiteidtNote">确 定</el-button>
    </span>
   </el-dialog>


  </div>
</template>

<script>
//富文本
import editor from "./Editor.vue"

//引入axios
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import global_ from './../global'
import {formatDate} from './../formDate.js'

//解决axios的post传参问题
import qs from 'qs'

Vue.use(VueAxios, axios)

export default {
  data () {
    return {
      videoUploadPercent:0,
      videoFlag:false,
      //笔记
      newNoteDialogVisible:false,
      newNoteContent:'',
      userId:0,
      switchInfo:true,
      editNoteContent:'',
      editNoteId:0,
      editNoteDialogVisible:false,

      //展示详情
      allDetails:[],
      addedit:true,

      //转换
      contentContainer:'',
      contentContainerDelete:'',//删除
      contentContainerEdit:'',//编辑
      detailEditId:0,

      deleteMsg:'',
      //新增主题
      detailTitle:'久荣',
      detailDialogVisible:false,
      detailNewTitle:'',
      detailNewContent:'',
      imgOrignAll:[],

      showVideo:false,
      active:3, //主题条控制
      blockTitle:'变量',
      keywords:'',
      btn_name:'隐',
      showControl:true,
      mycontent:true,
      admin:false,
      //进度条计算
      one_value:0,
      orignAtr:[],
      takeAtr:[],

      //视频操作
      videoVisible:false,
      fileList:[],
      videoUrl:'',
      videoName:'',
      videoStatus:0,
      controlTop:true,
      video:{id:0,url:'',name:'',name:'',status:0},
      needEditName:[],
      

      //minFrame相关
      blockId:0,
      progress:0,//进度条
      showProgress:100,
      defaultMinFrameId:'',//默认选中,计算得出。
      changeMinFrameId:'',//动态值，由点击赋值。
      minFrameTitle:'',

      deleteMinId:0,
      deleteMinTitle:'',
      minDeleteVisible:false,

      editMinId:0,
      editMinTitle:'',
      editminFrame:false,

      //操作
      newMinFrame:false,
      allMinFrame:[],
      userRoleName:'',
      Height:0,
      footerContent:'',


      //视频播放器设置
       playerOptions : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "" //url地址
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth, //播放器宽度
          notSupportedMessage: '本视频暂时无法播放，请与管理员联系！', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
      },
    }
  },
  filters:{
	//过滤器一：（使用时没有参数，即{{msg|filterA}}）
	      formatDate(value){
	        return formatDate(value, 'yyyy-MM-dd hh:mm:ss');
        },
	},
  beforeRouteLeave(to, form, next) {
    //路由变化前，删除未保存的图片
    var submitImgs=[];  //要提交的所有图片
      var imgs=document.getElementById("htmlContainer").getElementsByTagName("img");
      for(var i=0;i<imgs.length;i++){
          submitImgs.push(imgs[i].src);
    };
    //////console.log(submitImgs);
    this.deleImgs(submitImgs);
    next(); 
  },
  created(){
     //拦截器。判断是否刷新token值。
    axios.interceptors.request.use((config) => {
      var haveToken=localStorage.getItem("haveToken");
      var token=localStorage.getItem("token");
      var now=new Date();
      var diff=now.getTime()-parseInt(haveToken);
      var hhDiff=diff/(3600*1000*24);
      if(hhDiff>14){
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
    //拿到Id和进度
    this.userRoleName=localStorage.getItem("userRole");
    this.blockId=this.$route.query.id;
    this.blockTitle=this.$route.query.title;
    this.progress=parseInt(this.$route.query.progress);
    this.showProgress=Math.floor(this.progress);
    this.changeMinFrameId=this.$route.query.defaultminid;
    this.isAdmin();

    this.getShowFooter();
    this.getMinFrame();
    this.getVideo();
    
    this.userId=parseInt(localStorage.getItem("userId"));
   
    //刷新
    //window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
    //window.addEventListener('unload', e => this.unloadHandler(e));
   //动态设置内容高度 让footer始终居底   header+footer的高度是100
    this.Height = document.documentElement.clientHeight - 285;  
　　//监听浏览器窗口变化　
    window.onresize = ()=> {this.Height = document.documentElement.clientHeight -285}

  },
  /*destroyed() {
      window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
      window.removeEventListener('unload', e => this.unloadHandler(e))
  },*/
  components: {
    editor
  },
  methods:{
    toHOmePage(){
		  this.$router.push({path:'/'});
	  },
    getShowFooter(){
		//拿到状态为1的底部
		var url="/getFooterOne?"+Math.random() ;
		var self=this;
		this.axios.get(url,{}).then((res)=>{
			if(res.data.code=="0000"){
				self.footerContent=res.data.data.content;
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
    //判断是否管理员
    isAdmin(){
       if(this.userRoleName=="管理员"){
         this.admin=true;
       }else{
         this.admin=false;
       }
    },
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
    deleteNote(note){
      var person=note.user.name;
      var data=note.createDate;
       this.$confirm('此操作将永久删除'+person+'于'+formatDate(data, 'yyyy年MM月dd日 hh:mm:ss')+'创建的笔记, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.submitDeleteNote(note.id);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    submitDeleteNote(nid){
      var url="/deleteNote?nid="+nid;
      var self=this;
      axios.delete(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          self.getAllDetails();
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
    editNote(note){
      this.editNoteContent=note.content;
      this.editNoteId=note.id;
      this.editNoteDialogVisible=true;
    },
    submiteidtNote(){
      var url="/editSaveNote";
      var param={nid: this.editNoteId,content:this.editNoteContent};
      var self=this;
      this.axios.put(url,qs.stringify(param)).then((res)=>{
        if(res.data.code=="0000"){
           self.getAllDetails();
          self.$message({
					showClose: true,
					message: "笔记修改成功",
					type: 'success',
					center: true,
					duration:2500
          });
          this.editNoteDialogVisible=false;
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

    handleOpen(){
      
    },
    handleClose(){

    },
    getmMyNoye(){
      this.switchInfo=true;
    },
    getAllNote(){
     this.switchInfo=false;
    },
    newNote(param){
      this.newNoteDialogVisible=true;
      localStorage.setItem("did",param);
    },
    
    submitNewNote(did){
      var url="/newRealNote";
      var did=localStorage.getItem("did"); 
      var param={content:this.newNoteContent,uid:parseInt(this.userId),did:parseInt(did)};
     // ////console.log(this.userId);
     // ////console.log(did);
      var self=this;
      this.axios.post(url,qs.stringify(param)).then((res)=>{
        if(res.data.code=="0000"){
          self.$message({
					showClose: true,
					message: "新增笔记成功",
					type: 'success',
					center: true,
					duration:2500
          });
          self.newNoteDialogVisible=false;
          self.newNoteContent="";
          self.getAllDetails();
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

    //删除详情主题
    deleteDetail(param){
      this.$confirm('此操作将永久删除改主题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
       this.contentContainerDelete=param.details;
      var allImg=document.getElementById("htmlContainerDelete").getElementsByTagName("img");
      //////console.log(allImg);
      var deleteImg=[];
      for(var i=0;i<allImg.length;i++){
          deleteImg.push(allImg[i].src);
      };
      //var deleteImg=this.getDetailDeImgs("delete");
      this.deleImgs(deleteImg);//删除图片
      var url="/deleteDetail?id="+param.id;
      var self=this;
      this.axios.delete(url,{}).then((res)=>{
        self.getAllDetails();
        if(res.data.code=="0000"){
        
          if(self.deleteMsg=="success"){
              self.deleteMsg="已经删除主题所有图片";
          }else{
              self.deleteMsg="但未删除主题包含的图片";
          };
           this.$message({
            type: 'success',
            message: "已经删除主题，"+self.deleteMsg
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
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
      //转换
      
    },
    //编辑详情主题
    editDetail(param){
      //判断是否有新增内容
      if(this.detailNewContent!=""||this.detailNewTitle!=""){
        this.$message({
              message: "进行主题编辑之前，请先将保存新增的内容",
              type: 'warning',
              center: true,
              duration:2500
              });
              return;
      }else{
      //转换
      this.contentContainerEdit=param.details;
      var allImgs=document.getElementById("htmlContainerEdit").getElementsByTagName("img");
      var editImg=[];
      for(var i=0;i<allImgs.length;i++){
          editImg.push(allImgs[i].src);
      };
      this.imgOrignAll=editImg;

      this.detailNewContent=param.details;
      this.detailNewTitle=param.title;
      this.detailEditId=param.id;
      this.addedit=false;
      this.detailDialogVisible=true;
      }
    },

    getDetailDeImgs(param){
      //计算得到要删除的所有图片数组
      var submitImgs=[];  //要提交的所有图片
      var imgs=[];
      if(param=="add"){
        imgs=document.getElementById("htmlContainer").getElementsByTagName("img");
      }else if(param=='delete'){
          imgs=document.getElementById("htmlContainerDelete").getElementsByTagName("img");
      }else{
        //编辑
        imgs=document.getElementById("htmlContainerEdit").getElementsByTagName("img");
      };

      for(var i=0;i<imgs.length;i++){
          submitImgs.push(imgs[i].src);
      };
      var allImgs=this.imgOrignAll;//已经上传的所有图片

      var deleteImgs=[];//要删除的所有图片
      for(var m=0;m<allImgs.length;m++){
        if(submitImgs.indexOf(allImgs[m])==-1){
          deleteImgs.push(allImgs[m]);
        }
      };
      return deleteImgs;
    },
    submitEditDetail(){

      var deleteImgs=this.getDetailDeImgs("add");
      this.deleImgs(deleteImgs);//删除图片

      var url="/saveEditDetail";
      var param={id:this.detailEditId,title:this.detailNewTitle,details:this.detailNewContent};
      var self=this;
      this.axios.put(url,qs.stringify(param)).then((res)=>{
        if(res.data.code=="0000"){
          //////console.log("消息="+self.deleteMsg);
          if(this.deleteMsg=="success"){
            this.deleteMsg="修改成功，且已删除废弃图片";
          }else{
            this.deleteMsg="修改成功，未产生废弃图片";
          };
          //重新查询所有详情内容
          self.getAllDetails();
          self.$message({
            showClose: true,
            message: this.deleteMsg,
            type: 'success',
            center: true,
            duration:3100
        });
        
          self.detailDialogVisible=false;
          self.detailNewTitle='';
          self.detailNewContent='';
          self.deleteMsg='';
          //告诉编辑，重新计算上传值
          this.imgOrignAll=[];
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
    submitNewDetail(){
      //拿到要删除的图片数组
      var deleteImgs=this.getDetailDeImgs("add");
      //获得min参数。
      var minId="";//所属小导航
      if(this.changeMinFrameId==''){
        minId=this.defaultMinFrameId;
      }else{
         minId=this.changeMinFrameId;
      }
      //判断空
      if(this.detailNewTitle!=""&&this.detailNewContent!=""){
      this.deleImgs(deleteImgs);
      //axios上传
      var url="/newSubmitDetail";
      var param={title:this.detailNewTitle,details:this.detailNewContent,mfid:parseInt(minId)};
      var self=this;
      this.axios.post(url,qs.stringify(param)).then((res)=>{
        if(res.data.code=="0000"){
          //////console.log("消息="+self.deleteMsg);
          if(this.deleteMsg=="success"){
            this.deleteMsg="新增详情成功，且已删除废弃图片";
          }else{
            this.deleteMsg="新增详情成功，未产生废弃图片";
          };
          //重新查询所有详情内容
          self.getAllDetails();
          self.$message({
            showClose: true,
            message: this.deleteMsg,
            type: 'success',
            center: true,
            duration:3100
        });
        
          self.detailDialogVisible=false;
          self.detailNewTitle='';
          self.detailNewContent='';
          self.deleteMsg='';
          //告诉编辑，重新计算上传值
          this.imgOrignAll=[];
        }
      }).catch(function (error) {
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
        });}else{
          if(this.detailNewTitle==''){
            this.$message({
              message: "主题标题不能为空",
              type: 'warning',
              center: true,
              duration:2500
              });
              return;
          };
          if(this.detailNewContent==''){
            this.$message({
              message: "主题内容不能为空",
              type: 'warning',
              center: true,
              duration:2500
              });
              return;
          }


        }
    },
    getDeleteImg(data){
      this.contentContainer=this.detailNewContent;//转换
      this.imgOrignAll=data;
    },

    //删除废弃图片
    deleImgs(params){
      //////console.log(params);
      this.deleteMsg='';
      var url="/detaleOutImgs";
      var param=params;
      var self=this;
      axios.post(url,param).then((res)=>{
        if(res.data.code=="0000"){
          self.deleteMsg="success";
        }else{
          self.deleteMsg="fail";
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
    clearAll(){
      this.$confirm('此操作将该清空你所编辑的所有内容(包括标题), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.detailNewTitle='';
          this.detailNewContent='';
          //删除已上传图片
          var realDeleteImg=[];
          var deleteEdit=this.getDetailDeImgs("edit");
          var deleteAdd=this.getDetailDeImgs("add");
          if(deleteAdd.length==0){
             realDeleteImg=deleteEdit;
          }else{
             realDeleteImg=deleteAdd;
          };
          this.deleImgs(realDeleteImg);
           //告诉编辑，重新计算上传值
          this.imgOrignAll=[];
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清空'
          });          
      });
    },
    //新增详情
    newDetail(){
      if(this.defaultMinFrameId!=''){
         //console.log("导航？"+this.defaultMinFrameId);
         this.addedit=true;
         this.detailDialogVisible=true;
      }else{
         //console.log("导航？"+this.defaultMinFrameId);
        this.$message({
				message: "还未添加所属小导航",
				type: 'warning',
				center: true,
				duration:2500
				});
      }
    },

    //点击
    getDetailcontent(param){
      this.changeMinFrameId=param;
      //////console.log("点击得到的值："+param);

      //进度变化
      if(this.progress<100){
        //是否重复元素
       
        //是否相等
        //////console.log(this.takeAtr);
        if(this.takeAtr.sort().toString()!=this.orignAtr.sort().toString()){
          this.progress=this.progress+this.one_value;
          ////console.log(this.progress);
          this.updateProgress(this.progress);
        };
         if(this.takeAtr.indexOf(param)==-1){
           this.takeAtr.push(param);
        };
      }else{
        this.progress=100;
        ////console.log("大于100时,不再上传保存："+this.progress);
        //this.updateProgress(this.progress);
      }
      this.showProgress=Math.floor(this.progress);

      this.getAllDetails();
    },


    //进度，暂时不做。单独出来表。
    updateProgress(param){
      var url="/updateProgress";

    },
    //视频操作
    getVideo(){
      var url="/getCanVideo?bid="+this.blockId+"&timestap="+Math.random() ;
      var self=this;
      axios.get(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          this.video=res.data.data;
          this.playerOptions['sources'][0]['src']=res.data.data.url;
          this.showVideo=true;
        }else{
          if(res.data.data==1){
            
          }else{
            this.needEditName=res.data.data;
            //////console.log();
            self.$message({
              message: res.data.message,
              type: 'error',
              center: true,
              duration:2500
              });
          }
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
    newVideo(){
      this.videoVisible=true;
      this.controlTop=true;
    },
    editVideo(){
      //传参，带bid即可；
      var id=this.blockId;
      this.$router.push({
          path: '/videos',
          query: {
			    id: id
          }
        })
    },
    beforeAvatarUpload (file) {
      var fileSize = file.size / 1024 / 1024 < 3072;
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
              layer.msg("请上传正确的视频格式");
               return false;
          }
        if (!fileSize) {
              layer.msg("视频大小不能超过3GB");
        return false;
      }
    },
     beforeprogressUpload(event, file, fileList){
       this.videoFlag=true;
      //let loadProgress = Math.floor(event.percent) //这就是当前上传的进度
      this.videoUploadPercent=parseInt(file.percentage.toFixed(0), 10);
    },
    handleChange(file, fileList){
       if (fileList.length > 0) {
            this.fileList = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的csv文件
          }
    },
    addVideo(){
      if(this.fileList.length>0){
        this.$refs.upload.submit();
      }else{
        this.$message({
              message: '视频选择不能为空！',
              type: 'warning',
              center: true,
               duration:2500
          });
      }
    },
    cancelVideo(){
      this.$refs.upload.abort();
      this.videoFlag=false;
      this.videoVisible=false;
      this.fileList=[];
      this.videoName="";
    },

    //上传成功的回调
    handleSuccess(res, file, fileList){
       if(res.code=='0000'){
         this.videoUrl=res.data;
         this.videoName=res.data.replace('http://localhost:9090/mysite/files/','');
         this.saveVideo();
         this.videoFlag=false;
       }else{
         this.$message({
              message: res.message,
              type: 'error',
              center: true,
              duration:2500
            });
       }
    },
    //保存视频数据到数据库。三参数
    saveVideo(){
      //alert("视频已上传，名称："+this.videoName+",路径："+this.videoUrl);
      if(this.controlTop==true){
        this.videoStatus=1;//置顶，新增默认。
      }else{
        this.videoStatus=0;
      };
      //alert(this.controlTop);
      var url="/saveVideo";
      var param={bid:this.blockId,videoUrl:this.videoUrl,name:this.videoName,status:this.videoStatus};
      var self=this;
      axios.post(url,qs.stringify(param)).then((res)=>{
        self.$message({
					showClose: true,
					message: "视频上传成功！",
					type: 'success',
					center: true,
					duration:3500
        });
        self.getVideo();
        self.videoVisible=false;
        self.fileList=[];
        self.videoName='';
      }).catch(function (error) {
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
        });
    },


    getMinFrame(){
    var url="/getMinFrame?bid="+this.blockId+"&timestap="+Math.random();
    var self=this;
    this.axios.get(url,{}).then((res)=>{
      if(res.data.code=='0000'){
        self.allMinFrame=res.data.data;
        if(self.defaultMinFrameId==''){
          self.defaultMinFrameId=res.data.data[0].id.toString();
          self.changeMinFrameId=self.defaultMinFrameId;
          ////console.log("找到："+self.defaultMinFrameId);
        };
        self.getAllDetails();
        //进度条计算所需值
        for(var i=0;i<res.data.data.length;i++){
          self.orignAtr[i]=res.data.data[i].id;
        };
        if(self.allMinFrame.length>0){
          var basic=this.allMinFrame.length; 
          self.one_value=100/basic;
          ////console.log("基本值："+this.one_value);
          ////console.log("得到的原始数组："+this.orignAtr);
        }
      }
      }).catch(function (error) {
         
        });
    },
    getAllDetails(){
      var self=this;
      var minId='';//所属小导航
      ////console.log("值"+self.defaultMinFrameId);
      if(self.changeMinFrameId!=''){
        minId=self.changeMinFrameId;
      }else{
         minId=self.defaultMinFrameId;
      };
      ////console.log("参数:"+minId);
      var url="/getAllDetails?mfid="+parseInt(minId)+"&timestap="+Math.random() ;
      
      this.axios.get(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          if(res.data.data.length>0){
             self.allDetails=res.data.data;
          }     
        }else{
          self.allDetails=res.data.data;
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

    //控制显示
    control(val){
      if(val=true){
       this.mycontent=!this.mycontent;
      };
      if(val=false){
        this.mycontent=!this.mycontent;
      };
    },


    //minFrame操作
    deleteMinFrame(param){
      this.deleteMinId=param.id;
      this.deleteMinTitle=param.minTitle;
      this.minDeleteVisible=true;
    },
    submitDeleteMin(){
      var url="/deleteMinFrame?mid="+this.deleteMinId;
      var self=this;
      this.axios.delete(url,{}).then((res)=>{
        if(res.data.code=='0000'){
          //self.getMinFrame();
          self.$message({
          showClose: true,
          message: "已经删除"+self.deleteMinTitle,
          type: 'success',
          center: true,
          duration:2500
        });
        self.getMinFrame();
        self.minDeleteVisible=false;
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
    editMinFrame(param){
      this.editMinId=param.id
      this.editMinTitle=param.minTitle;
      this.editminFrame=true;
    },
    submitEditMin(){
      var url="/editMinFrame";
      var param={id:this.editMinId,minTitle:this.editMinTitle};
      var self=this;
      this.axios.put(url,qs.stringify(param)).then((res)=>{
        self.$message({
					showClose: true,
					message: "修改成功！",
					type: 'success',
					center: true,
					duration:2500
        });
         self.getMinFrame();
         self.editMinTitle='';
         self.editminFrame=false;
      }).catch(function (error) {
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
      });
    },

    cancelSubFrame(){
      this.newMinFrame = false;
      this.minFrameTitle='';
    },
    subNewMinFrame(){
      var url="/submitMinFrame";
      var param={mintitle:this.minFrameTitle,bid:this.blockId};
      var self=this;
      this.axios.post(url,qs.stringify(param)).then((res)=>{
        if(res.data.code=='0000'){
          self.getMinFrame();
          self.newMinFrame = false;
          self.minFrameTitle='';
          self.$message({
          message: "新增小导航成功",
          type: 'success',
          center: true,
          duration:2500
          });
        }
      }).catch(function (error){
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
  .el-menu {
      border-right: 0;
      width: 110%;
    }
    
.video-js .vjs-icon-placeholder {
    width: 100%;
    height: 100%;
    display: block;
}

.search{
  width:50%;
  margin-top:3%; 
}
.logoset{
  margin-top: 3%;
  margin-right:4.7% ;
  font-size: 1.5em;
  cursor:pointer;
  color: rgba(45, 128, 128);
}
.logoset:hover{
  color: rgba(0, 162, 255, 0.829);
  text-decoration:underline;
}

/* 上传样式更改 */
  div  /deep/ .el-list-enter-active,
  div  /deep/ .el-list-leave-active {
      transition: none;
    }
 
  div  /deep/ .el-list-enter,
  div  /deep/ .el-list-leave-active {
      opacity: 0;
    }
  div  /deep/ .el-upload-list {
      height: 40px;
    }

</style>
