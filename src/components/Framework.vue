<template>
  <div id="framework" style="overflow:auto">
	<div class="logo">
	<div @click="usermanager" style="float:left;margin-left:1%"><img src="../assets/img/logo.png" width="55%"/></div>
	<div  style="float:right;margin-right:2%">
		<span @click="tel_me" style="font-size:1.3em;cursor:pointer;">联系我</span></div>
		<span style="font-size:2.1em;margin-left:32%">{{myAppName}}</span>
	</div>
	<div>
    <el-container style="clear:both">
	<el-header>
		<div  align="center">
		<div class="search">
			<el-input v-model="keywords" @keyup.enter.native="searchResult" placeholder="请输入搜索关键字">
			 	<el-button slot="append" @click="searchResult" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		</div>	
		<div  v-if="admin" v-show="adminshow"  style="font-size:1.3em;margin-left:1%;cursor:pointer;margin-top:-1.5%">
				<i @click="newframe" class="el-icon-plus"></i> &nbsp;
				<i @click="editframe" class="el-icon-edit"></i>  &nbsp;
				<i @click="delete_frame" class="el-icon-delete"></i>
		</div>
	</el-header>

	<el-main  v-bind:style="{minHeight: Height+'px'}">
		<el-container>
			<div>
			<span class="change" @click="change"><i class="el-icon-menu" style="margin-bottom: 1%;font-size:1.5em;margin-left:7%;"><span style="font-size:0.9em;font-family: Kaiti;">{{msg}}</span></i></span>
			
			<el-menu style="margin-left:-5%"  :default-active="defaultFrame"  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
			
			<el-menu-item v-for="(frame,indexs) in allFrame" :index="frame.id.toString()" :key="indexs" @click="clickData(frame.id)">
				<i class="el-icon-location-information"></i>
				<span slot="title">{{frame.frameName}}</span>
			</el-menu-item>
			

			</el-menu>

			

			</div>

			<div style="width:100%">

				<div class="card"  v-for="(blockByFrame,index) in blockByFrames" :key="index">
					<el-card @click.native="detail(blockByFrame)" style="height:190px">
						<div slot="header" class="clearfix">
							<span style="font-size:1.3em"><b>{{blockByFrame.title}}</b></span>

							<span v-if="admin" style="float:right">
							<i @click.stop="edit_block(blockByFrame)" class="el-icon-edit"></i>  &nbsp;
							<i @click.stop="deleteblock(blockByFrame)" class="el-icon-delete"></i>
							</span>
						</div>
						<div class="content">
							{{blockByFrame.describes}}
						</div>
					</el-card>
				</div>

				
				<!-- 增加 -->
				<div class="card" v-if="admin">
					<div @click="newblocks" align="center" style="font-size:3em;margin-top:15%">
					<i  class="el-icon-plus"></i> 
					</div>
				</div>
				
			</div>
		</el-container>

	</el-main>

	<el-footer>
		<div align="center" style="color:#677f9a">
			<span><span v-if="admin" style="cursor:pointer;" @click="seeAllFooter">&reg;</span><span v-if="!admin">&reg;</span>{{footerContent}}</span><span style="cursor:pointer;"  v-if="admin"><i @click="newFooter" class="el-icon-circle-plus-outline"></i></span>
		</div>		
	</el-footer>

	</el-container>
	</div>

	<!-- 新增 导航 -->
	<el-dialog
	title="新增导航栏"
	:visible.sync="dialognew"
	width="30%"
	:modal-append-to-body='false'
	center>
		<el-input
		placeholder="请输入导航名称(10字以内)"
		maxlength="10"
		v-model="frameName"
		clearable>
		<span slot="prepend">导航栏</span>
		</el-input>
	<span slot="footer" class="dialog-footer">
		<el-button @click="cancelNewFrame">取 消</el-button>
		<el-button type="primary" @click="real_newframe">确 定</el-button>
	</span>
	</el-dialog>

	<!-- 块新增 -->
	<el-dialog
	title="新增"
	:visible.sync="newblock"
	width="30%"
	:modal-append-to-body='false'
	center>
		<el-input
		placeholder="请输入小标题(10字以内)"
		maxlength="10"
		v-model="blockTitle"
		clearable>
		<span slot="prepend">小标题</span>
		</el-input>

		<el-input style="margin-top:2%"
		type="textarea"
		:rows="4"
		placeholder="请输入进行简要描述(83字以内)"
		maxlength="83"
		v-model="blockDescribes">
		</el-input>
		<span slot="footer" class="dialog-footer">
		<el-button @click="canselNewBlock">取 消</el-button>
		<el-button type="primary" @click="real_newblock">确 定</el-button>
	</span>
	</el-dialog>

	<!-- 块编辑 -->
	<el-dialog
	title="编辑"
	:visible.sync="editblock"
	width="30%"
	:modal-append-to-body='false'
	center>
		<el-input
		placeholder="请输入小标题(10字以内)"
		maxlength="10"
		v-model="editBlockTitle"
		clearable>
		<span slot="prepend">小标题</span>
		</el-input>

		<el-input style="margin-top:2%"
		type="textarea"
		:rows="4"
		placeholder="请输入进行简要描述(83字以内)"
		maxlength="83"
		v-model="editBlockDescribe">
		</el-input>
		<span slot="footer" class="dialog-footer">
		<el-button @click="editblock=false">取 消</el-button>
		<el-button type="primary" @click="submitEditBlock">确 定</el-button>
	</span>
	</el-dialog>

	<!-- 编辑 -->
	<el-dialog width="40%"  title="选择编辑项" :visible.sync="dialogedit" :modal-append-to-body='false' :append-to-body="true" center>
    <el-dialog 
	  style="margin-top:3.5%"
      width="35%"
      title="保存编辑"
      :visible.sync="dialogeditnext"
      append-to-body center>
	   <el-input
		placeholder="请输入导航内容(10字以内)"
		maxlength="10"
		v-model="editName.frameName"
		clearable>
		<span slot="prepend">导航</span>
		</el-input>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cancelEditFrame">取 消</el-button>
			<el-button type="primary" @click="real_editframe">确 定</el-button>
		</span>
    </el-dialog>
	<div align="center">
	<div align="center" style="margin-bottom:1%">
	  <el-button  type="info" round>调整</el-button>
	</div>
	<el-select v-model="editFrameName" clearable placeholder="请选择">
    <el-option
      v-for="item in editOptions"
      :key="item.id"
      :label="item.frameName"
      :value="item.id">
    </el-option>
  	</el-select>
	</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogedit = false">返回</el-button>
      <el-button type="primary" @click="getFrameInfo">下一步</el-button>
    </div>
   </el-dialog>

	<!-- 删除 -->
	<el-dialog width="40%"  title="选择删除项" :visible.sync="outerVisible" :modal-append-to-body='false' :append-to-body="true" center>

    <el-dialog
      width="35%"
      title="确认删除"
      :visible.sync="innerVisible"
      append-to-body center>
		<span>您确定要删除<span style="color:#409effcf">&nbsp;{{deleteName}}&nbsp;</span>这一导航吗？</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="innerVisible = false;outerVisible=false">取 消</el-button>
			<el-button type="primary" @click="real_deleteframe()">确 定</el-button>
		</span>
    </el-dialog>

	<div align="center">
	<el-select v-model="deleteFrame" clearable placeholder="请选择删除项" @change="deleteChange">
    <el-option 
      v-for="item in deleteOptions"
      :key="item.id"
      :label="item.frameName"
      :value="item.id">
    </el-option>
  	</el-select>
	</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="outerVisible = false">返回</el-button>
      <el-button type="primary" @click="innerVisible = true">下一步</el-button>
    </div>
  </el-dialog>

	<!-- 块删除对话框 -->
	<el-dialog
	:modal-append-to-body='false'
	title="提示"
	:visible.sync="blockVisible"
	width="30%"
	:before-close="handleClose"
	center>
	<div align="center"><span>你确定删除<span style="color:#409effcf">&nbsp;{{deleteBlockTitle}}&nbsp;</span>吗？此操作无法撤销！</span></div>
	<span slot="footer" class="dialog-footer">
		<el-button @click="cancelDeleteBlock">取 消</el-button>
		<el-button type="primary" @click="submitDeleteBlock">确 定</el-button>
	</span>
	</el-dialog>

	<!-- 关注 -->
	<el-dialog
	style="margin-top:-5%"
	title="提示"
	:visible.sync="takemeDialogVisible"
	width="30%"
	center>
	<div align="center">
	<span style="font-size:1.1em">联系方式：哔哩哔哩up主 <span style="color:#409effcf">青彦沐</span></span>
	</div>
	<span slot="footer" class="dialog-footer">
		<el-button type="primary" @click="takemeDialogVisible = false">确 定</el-button>
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
  name: 'Framework',
  data () {
    return {
		Height: 0,
		keywords:'',
		setClass:'framework1',
		setFooter:'footer',
		isCollapse: false,
		msg:'收',
		
		adminshow:true,
		admin:false,//
		appid:0,
		//查询
		allFrame:[],
	    defaultFrame:'',
		

		//删除
		outerVisible:false,
		innerVisible:false,
		deleteOptions:[],
		deleteFrame:'',
		deleteName:'',

		//新增
		dialognew:false,
		frameName:'',
		editName:{frameName:'',id:'',appid:''},
		editFrameName:'',

		//编辑
		dialogedit:false,
		dialogeditnext:false,
		editOptions:[],

		/* 块 */
		newblock:false,
		blockTitle:'',
		blockDescribes:'',
		changeFrameId:'',

		blockVisible:false,
		deleteBlockId:'',
		deleteBlockTitle:'',
		editblock:false,
		editBlockId:'',
		editBlockTitle:'',
		editBlockDescribe:'',

		//查询，每次点击导航，改变此值
		blockByFrames:[],

		//高度,控制底部
		clientHeight:0,
		contentHeight:0,

		footerContent:'',

		//app名
		myAppName:'',
		takemeDialogVisible:false,
		userRoleName:'',
		
    }
  },
  watch:{
	  isCollapse:{
		   handler(newVal){
			   if(newVal==true){
				   this.msg='开';
				   this.adminshow=!this.adminshow;
			   }else{
				   this.msg='收';
				   this.adminshow=!this.adminshow;
			   }
			},
			deep:true
	  },
	  contentHeight:{
		  handler(newVal){
			  ////console.log("高度在变化"+newVal);
		  }
	  },
	   deep:true
  },
  created(){
     //拦截器。判断是否刷新token值。
    axios.interceptors.request.use((config) => {
      var haveToken=localStorage.getItem("haveToken");
      var token=localStorage.getItem("token");
      var now=new Date();
      var diff=now.getTime()-parseInt(haveToken);
	  var hhDiff=diff/(3600*1000);
	  // //console.log("间隔时间"+hhDiff);
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
  
  mounted(){
	  axios.defaults.baseURL = global_.API_BASEURL;
	  axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$root.getToken() ;
	  this.appid=this.$route.query.id;
	  this.changeFrameId=this.$route.query.defaultfid;
	  this.userRoleName=localStorage.getItem("userRole");
	  this.getAppName();
	  //获得缓存状态
	  this.getStatus();
	  this.isAdmin(); 
	  this.getAllFrame();
	  this.getHeight();	
	  this.getShowFooter();

   //动态设置内容高度 让footer始终居底   header+footer的高度是100
    this.Height = document.documentElement.clientHeight - 230;  
　　//监听浏览器窗口变化　
    window.onresize = ()=> {this.Height = document.documentElement.clientHeight -230}
  },
  methods:{
	  //底部
	  newFooter(){
		var self=this;
		this.$prompt('请输入邮箱', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
		  //新增
		  var url="/newFooter?content="+value;
		  self.axios.post(url,{}).then((res)=>{
			  if(res.data.code=="0000"){
				  //更改显示
				  self.getShowFooter();
				   self.$message({
					type: 'success',
					message: '新增成功'
				});
			  }
		  })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
	  },
	  getShowFooter(){
		//拿到状态为1的底部
		var url="/getFooterOne";
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
	  seeAllFooter(){
		 this.$router.push('/allfooter');
	  },

	  //判断是否青彦登录
	isAdmin(){
       if(this.userRoleName=="管理员"){
         this.admin=true;
       }else{
         this.admin=false;
       }
    },
	  usermanager(){
		  if(this.admin){
		  //为管理员,用户管理
		  	this.$router.push('/usermanager');
		  }
	  },
	  getAppName(){
		  var url="/getAppName?id="+this.appid;
		  var self=this;
		  this.axios.get(url,{}).then((res)=>{
			  if(res.data.code=="0000"){
				  self.myAppName=res.data.data;
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
	  getStatus(){
		 this.changeFrameId=localStorage.getItem("changeId"); 
	  },
	  clickData(frameId){
		  this.changeFrameId=frameId;
		  //将之存入缓存
		  localStorage.setItem("changeId",this.changeFrameId);
		  this.getBlockByFrame();
	  },
	  getHeight(){		 	
		  	/*var clientH=window.innerHeight
					|| document.documentElement.clientHeight
					|| document.body.clientHeight;

			var contentH=document.getElementById("#framework").offsetHeight;	*/		
			
			/*this.clientHeight=clientH;
			this.contentHeight=contentH;*/
			////console.log("浏览器："+this.clientHeight);
			/*////console.log("页面："+this.contentHeight);*/
			/*if(contentH<=clientH){
				this.setClass="framework1";
				this.setFooter="footer1";
			}*/
	  },

	  //菜单
	  change(){
		  this.isCollapse=!this.isCollapse;
	  },
	   
	   //
	   handleOpen(key, keyPath) {
         ////console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        
	  },


	  tel_me(){
		  this.takemeDialogVisible=true;
	  },

	
	//框架
	getAllFrame(){
		var appid=this.appid;
		var url="/getAllFrames?appid="+appid;
		var self=this;
		this.axios.get(url,{}).then((res)=>{
			if(res.data.code=="0000"){
				self.allFrame=res.data.data;
				self.deleteOptions=res.data.data;
				self.editOptions=res.data.data;
				if(res.data.data.length>0){
					if(self.changeFrameId!=''){
						self.defaultFrame=self.changeFrameId.toString();
					}else{
						self.defaultFrame=res.data.data[0].id.toString();
					}
					self.getBlockByFrame();
				}
				//////console.log("默认："+self.defaultFrame);
			}else{
			
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
	  newframe(){
		  this.dialognew=true;
	  },
	  cancelNewFrame(){
		  this.dialognew = false;
		  this.frameName='';
	  },
	  real_newframe(){
		  //保存新增
		  var url="/newFrame"
		  var param={frameName:this.frameName,appid:this.appid};
		  var self=this;
		  this.axios.post(url,qs.stringify(param)).then((res)=>{
			  if(res.data.code=='0000'){
				self.getAllFrame();
				self.dialognew=false;
				self.frameName="";
				self.$message({
				showClose: true,
				message: "新增导航栏成功",
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

	  delete_frame(){
		  this.outerVisible=true;
	  },
	  real_deleteframe(){
		  //删除处理
		 //////console.log(this.deleteFrame);
		var id=this.deleteFrame;
		var url="/deleteRealFrame/"+id;
		var self=this;
		this.axios.delete(url,{}).then((res)=>{
			if(res.data.code=="0000"){
				self.$message({
				showClose: true,
				message: "已经删除"+this.deleteName,
				type: 'success',
				center: true,
				duration:2500
				});
			   self.getAllFrame();
			   self.innerVisible = false;
			   self.outerVisible=false;
			   self.deleteName='';
			   self.deleteFrame='';
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
	  deleteChange(val){
		let obj = {};
		obj = this.deleteOptions.find((item)=>{//这里的userList就是上面遍历的数据源
			return item.id === val;//筛选出匹配数据
		});
		//////console.log(obj);
		this.deleteName=obj.frameName;
	  },
	  editframe(){
		  this.dialogedit=true;
	  },
	  getFrameInfo(){
		  //后台去拿到信息
		var url="/getOneInfo?id="+this.editFrameName;
		var self=this;
		this.axios.get(url,{}).then((res)=>{
			if(res.data.code=="0000"){
				self.editName=res.data.data;
				//////console.log(self.editName);
				self.dialogeditnext=true;
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
	  real_editframe(){
		  //保存编辑
		  var url="/updataFrame";
		  var param=this.editName;
		  var self=this;
		  this.axios.put(url,param).then((res)=>{
			  if(res.data.code=="0000"){
				self.$message({
				showClose: true,
				message: "修改成功！",
				type: 'success',
				center: true,
				duration:2500
				});
				self.getAllFrame();
				self.dialogedit=false;
		   		self.dialogeditnext=false;
		   		self.editFrameName='';
		   		self.editName={frameName:'',id:'',appid:''};
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
	  cancelEditFrame(){
		   this.dialogedit=false;
		   this.dialogeditnext=false;
		   this.editFrameName='';
		   this.editName={frameName:'',id:'',appid:''};
	  },

	  //块
	  //拿到所属块
	  getBlockByFrame(){
		  var fid='';
		  if(this.changeFrameId==''){
			  fid=this.defaultFrame;
		  }else{
			  fid=this.changeFrameId;
		  }
		  //////console.log("打印："+this.defaultFrame);
		  var url="/defaultGetBlock?fid="+parseInt(fid) ;
		  var self=this;
		  this.axios.get(url,{}).then((res)=>{
			  if(res.data.code=="0000"){
				this.blockByFrames=res.data.data;
				//////console.log(this.blockByFrames);
			  }else{
				  this.blockByFrames=res.data.data;
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
	  newblocks(){
		 if(this.defaultFrame!=''){
			 this.newblock=true;
		 }else{
			 this.$message({
				message: "还未添加所属导航",
				type: 'warning',
				center: true,
				duration:2500
				});
		 }
	  },
	  real_newblock(){
		  //保存
		  var url="/newBlockSave";
		  var frameSaveId='';
		  if(this.changeFrameId!=''){
			  frameSaveId=this.changeFrameId;
		  }else{
			  frameSaveId=this.defaultFrame;
		  };
		  var param={frameid:frameSaveId,title:this.blockTitle,describes:this.blockDescribes,progress:0};
		  var self=this;
		  this.axios.post(url,qs.stringify(param)).then((res)=>{
			  if(res.data.code=='0000'){
				  	//查询；
					self.$message({
					showClose: true,
					message: "新增板块成功",
					type: 'success',
					center: true,
					duration:2500
				});
				self.newblock=false;
				self.getBlockByFrame();
				self.blockTitle='';
				self.blockDescribes='';
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
	  canselNewBlock(){
		this.newblock=false;
		this.blockTitle='';
		this.blockDescribes='';
	  },
	  
	  edit_block(param){
		this.editblock=true;
		this.editBlockId=param.id;
		this.editBlockTitle=param.title;
		this.editBlockDescribe=param.describes
	  },
	  submitEditBlock(){
		  var url="/updataBlock";
		  var param={id:parseInt(this.editBlockId),title:this.editBlockTitle,describes:this.editBlockDescribe};
		  var self=this;
		  this.axios.put(url,qs.stringify(param)).then((res)=>{
			  if(res.data.code=="0000"){
				self.$message({
				showClose: true,
				message: "修改成功！",
				type: 'success',
				center: true,
				duration:2500
				});
				self.getBlockByFrame();
				self.editblock=false;
			}
		  }).catch((error)=>{
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
        });
	  },
	  deleteblock(param){
		this.blockVisible=true;
		this.deleteBlockId=param.id;
		this.deleteBlockTitle=param.title;
	  },
	  submitDeleteBlock(){
		  var url="/deleteBlock?bid="+parseInt(this.deleteBlockId);
		  var self=this;
		  this.axios.delete(url,{}).then((res)=>{
			  if(res.data.code=="0000"){
				self.getBlockByFrame();
				self.$message({
				showClose: true,
				message: "已经删除->"+this.deleteBlockTitle,
				type: 'success',
				center: true,
				duration:2500
				});
				self.blockVisible=false;
			}
		  }).catch((error)=>{
          self.$message({
              message: error,
              type: 'error',
              center: true,
              duration:2500
              });
        });
	  },
	  cancelDeleteBlock(){
		  this.blockVisible=false;
	  },
	  
	  detail(param){
		  var id=param.id;
		  var title=param.title;
		  var progress=param.progress;
		  this.$router.push({
          path: '/detail',
          query: {
			id: id,
			progress:progress,
			title:title
          }
        })
	  }
  }
}
</script>

<style scoped>
.content{
	height: 70px;
	word-wrap: break-word;
    word-break: normal;
}
.card{	
	float:left;
	margin-top:2.1%;
	margin-left: 3%;
	width: 30%;
	cursor:pointer;
}

.logo{
	margin-top: 1.5%;
	font-family: Kaiti;
}

.framework2{	
	position: fixed;	
	top:0%;
	left:0%;
	right: 0%;
}
.search{
  width:50%;
  margin-top:1%; 
}
.footer1{
	position: fixed;
	bottom: 2%;
}
.footer2{
	bottom: 2%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .change{
	  cursor:pointer;
  }
</style>
