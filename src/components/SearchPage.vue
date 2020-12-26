<template>
  <div class="resultSearch" style="overflow:auto;font-family: Kaiti;">
    <div align="center">
       <div style="margin-top:2%">
        <img src="../assets/img/logo.png" width="6%"/>
        <div style="margin-top:1%;font">
          <span style="font-size:1.4em;color:green;">
              <span style="border-radius: 50%; margin-top:2.5px;margin-right:-5px;   height: 20px;    width: 20px;    display: inline-block;    background: #f30303;      vertical-align: top;">  
              <span style="display: block;    color: #FFFFFF;    height: 20px;    line-height: 20px;    text-align: center">沐</span>  
          </span>
            搜索结果页面</span>
        </div>
      </div>
    </div>

    <div  align="center" style="width:35%;margin-left:32%;margin-top:2%">
		<div class="search">
			<el-input v-model="keyWords" @keyup.enter.native="searchResult" placeholder="请输入搜索关键字">
			 	<el-button slot="append" @click="searchResult" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		</div>	
    
    <!-- 搜索结果 -->
    <div  id="result" style="margin-top:5%;margin-left:13%;margin-right:1%;margin-bottom:5%;font-size:1.3em">

      <div v-show="haveData" v-for="(detail,index) in searchResults" :key="index" style="margin-top:2%">
        <div>
        <el-button size="small" @click="seeDetail(index)" style="margin-top:-50" type="primary" round>具体</el-button>
        <i class="el-icon-d-arrow-right"></i>
        <span style=" cursor:pointer; "><a @click="goHome">
        <span>应用：</span>
        <span  style="color:#409effcf;"><u>{{detail.minFrame.block.frame.app.appName}}</u></span>
        </a></span>

        <el-divider direction="vertical"></el-divider>
        <span style=" cursor:pointer; "><a  @click="goFramework(detail.minFrame.block.frame.app.id,detail.minFrame.block.frame.id)">
         <span>模块：</span>
        <span  style="color:#409effcf"><u>{{detail.minFrame.block.title}}</u></span>
        </a></span>

        <el-divider direction="vertical"></el-divider>
        <span style=" cursor:pointer; "><a @click="goDetail(detail.minFrame.block.id,detail.minFrame.block.title,detail.minFrame.id)">
         <span>步骤：</span>
        <span  style="color:#409effcf"><u>{{detail.title}}</u></span>
        </a></span>
        </div>
        <div v-show="isShow==index?true:false" style="margin-left:3%;margin-top:0%" class="ql-editor"  v-html="detail.details">
             {{detail.details}}
        </div>
      </div>

      <div v-if="!haveData" style="margin-top:2%">
        <span>您好，未查到相关数据！</span>
      </div>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import global_ from './../global'

//解决axios的post传参问题
import QS from 'qs'

Vue.use(VueAxios, axios)

export default {
  name: 'result',
  data () {
    return {
      keyWords:'',
      searchResults:[],
      haveData:false,
      isShow:-1,
    }
  },
  methods:{
      goHome(){
        this.$router.push({path:'/'}); 
      },
      goFramework(aid,fid){
        this.$router.push({
          path:'/frame',
          query: {
          id:aid,
          defaultfid:fid
          }
          }); 
      },
      goDetail(bid,title,minfid){
         this.$router.push({
          path:'/detail',
          query: {
          id:bid,
          progress:0,
          title:title,
          defaultminid:minfid
          }
          }); 
      },
      seeDetail(index){//处理，只显示对应的内容
        this.isShow=index;
      },
      searchResult(){
      //先去清空ealstic，初始化内容
      var url="/deleteGetAllEs";
      var self=this;
      this.axios.post(url,{}).then((res)=>{
        if(res.data.code=="0000"){
         self.getResults();
        }
      })
    },
      getResults(){
          var url="/getSearchResult?keyWords="+this.keyWords;
          var self=this;
          this.axios.get(url,{}).then((res)=>{
              if(res.data.code=="0000"){
                  this.haveData=true;
                  this.searchResults=res.data.data;
                 // console.log(this.searchResults);
              }else{
                  this.haveData=false;
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
  mounted(){
    this.axios.defaults.baseURL = global_.API_BASEURL;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$root.getToken() ;
    this.keyWords=this.$route.query.key;
    this.getResults();
  }
}
</script>

<style scoped>


</style>
