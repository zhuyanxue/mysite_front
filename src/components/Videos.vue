<template>
  <div class="video" style="overflow:auto">
    <el-container>
        
    <el-header>
        <div align="center" style="margin-top:3%">
            <div v-if="iserro" style="font-family: Kaiti;font-size:1.3em">《{{title}}》模块的所有视频如下</div>
            <div v-if="!iserro"  style="font-family: Kaiti;font-size:1.3em">{{title}}</div>
            <span>(作者：青彦)</span>
        </div>
    </el-header>

    <el-main style="margin-top:5%;margin-left:5%;margin-right:5%">
        <div>
        <div class="card"  v-for="(video,indexs) in allVideos" :key="indexs"  @click="playerVideo(video)">
			<el-card style="height:350px;">
				<div slot="header" class="clearfix">
					<span style="font-size:0.75em"><b>{{video.name}}</b></span>
				</div>
				<div class="content">
					<div align="center">
                        <video style="height:210px;width:100%;"  :src="video.url" />
                        <p></p>
                        <p></p>
                        <span>
                            <span  v-if="admin" style="margin-left:5%;float:left;"><i @click.stop="edit_video(video)" class="el-icon-upload2"></i></span>
					                   <span v-if="admin" style="margin-right:5%;float:right;"><i @click.stop="deleteVideo(video)" class="el-icon-delete"></i></span>
                        </span>
                    </div>
				</div>
			  </el-card>
		</div>
        </div>
    </el-main>
    </el-container>
    <el-dialog
    :showClose="false"
    :close-on-click-modal="false"
    title="播放视频"
    :visible.sync="videoPlayVisible"
    style="margin-top:-5%"
    width="48%"
    center>
    <div>
         <div align="center" style="margin-bottom:2%">
             <span style="font-size:1.1em">{{playerName}}</span>
         </div>
        <!-- 视频播放器 -->
                      <video-player  class="video-player vjs-custom-skin"
                        ref="videoPlayer" 
                        :playsinline="true" 
                        :options="playerOptions"
                      ></video-player>
                     
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exitPlayer">退出播放</el-button>
    </span>
    </el-dialog>

    <!-- 删除提示 -->
    <el-dialog
    title="删除提示"
    :visible.sync="deleteDialogVisible"
    width="30%"
    center>
    <span>您确定永久删除<span style="color:#409effcf">&nbsp;{{deleteName}}</span>这一视频吗？（注意：此操作无法撤销）</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDelete">确 定</el-button>
    </span>
    </el-dialog>

     <!-- 置顶提示 -->
    <el-dialog
    title="置顶提示"
    :visible.sync="editDialogVisible"
    width="30%"
    center>
    <span>你确定将<span style="color:#409effcf">&nbsp;{{editName}}</span>这一视频置顶吗？</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
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
  name: 'videos',
  data () {
    return {
      admin:false,
      iserro:true,
      bid:0,
      block:{},
      allVideos:[],
      title:'',
      videoPlayVisible:false,
      playerName:'',

      //操作
      editDialogVisible:false,
      deleteDialogVisible:false,
      deleteName:'',
      deleteId:0,
      editName:'',
      editId:0,
      userRoleName:'',

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
  mounted(){
    this.axios.defaults.baseURL = global_.API_BASEURL;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$root.getToken() ;
    this.userRoleName=localStorage.getItem("userRole");
    this.isAdmin();
    this.bid=this.$route.query.id;
    this.getBlock();
  },
  created(){
     //拦截器。判断是否刷新token值。
    axios.interceptors.request.use((config) => {
      var haveToken=localStorage.getItem("haveToken");
      var token=localStorage.getItem("token");
      var now=new Date();
      var diff=now.getTime()-parseInt(haveToken);
      var hhDiff=diff/(3600*1000);
      if(hhDiff>2){
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
  methods:{
   isAdmin(){
       if(this.userRoleName=="管理员"){
         this.admin=true;
       }else{
         this.admin=false;
       }
    },
    edit_video(param){
      this.editName=param.name;
      this.editId=param.id;
      this.editDialogVisible=true;
    },
    submitEdit(){
        var url="/editTopVideo?vid="+this.editId+"&bid="+this.bid;
        var self=this;
        this.axios.put(url,{}).then((res)=>{
            if(res.data.code=="0000"){
                self.$message({
				showClose: true,
				message: "已将视频置顶，可在详情页解读视频中查看！",
				type: 'success',
				center: true,
				duration:3500
                });
                 self.getByBlockVideos();
                 self.editDialogVisible=false;
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
    deleteVideo(param){
        this.deleteId=param.id;
        this.deleteName=param.name;
        this.deleteDialogVisible=true;
    },
    submitDelete(){
        var url="/deleteVideo?vid="+this.deleteId;
        var self=this;
        this.axios.delete(url,{}).then((res)=>{
            if(res.data.code=="0000"){
               self.$message({
                showClose: true,
                message: res.data.data,
                type: 'success',
                center: true,
                duration:3500
                });
             self.deleteDialogVisible=false;
             self.getByBlockVideos();
            }
        }).catch(function (error) {
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:3500
              });
        });
    },
      getBlock(){
          var url="/inGetBlock?bid="+this.bid;
          var self=this;
          this.axios.get(url,{}).then((res)=>{
              if(res.data.code=="0000"){
                  self.block=res.data.data;
                  self.title=res.data.data.title;
                  self.getByBlockVideos();
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
      getByBlockVideos(){
          var url="/getAllVideoByBlock?bid="+this.bid;
          var self=this;
          this.axios.get(url,{}).then((res)=>{
              if(res.data.code=="0000"){
                  self.allVideos=res.data.data;
              }else{
                  self.title=res.data.message;
                  self.allVideos=res.data.data;
                  self.iserro=false;
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
      playerVideo(param){
          this.playerOptions['sources'][0]['src']=param.url;
          this.playerName=param.name;
          this.videoPlayVisible=true;
      },
      exitPlayer(){
          this.videoPlayVisible=false;
          this.playerOptions['sources'][0]['src']='';
          this.playerName='';
      }
  }
}
</script>

<style scoped>
.card{	
	float:left;
	margin-top:2.1%;
	margin-left: 3%;
    width: 30%;
    height:350px;
	cursor:pointer;
}

</style>
