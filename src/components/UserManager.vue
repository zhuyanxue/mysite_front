<template>
  <div class="detail" style="overflow:auto;font-family: Kaiti;" >
     <div align="center">
       <div style="margin-top:2%">
        <img src="../assets/img/logo.png" width="6%"/>
        <div style="margin-top:3%;font">
          <span style="font-size:1.4em;color:green;">
              <span style="border-radius: 50%; margin-top:2.5px;margin-right:-5px;   height: 20px;    width: 20px;    display: inline-block;    background: #f30303;      vertical-align: top;">  
              <span style="display: block;    color: #FFFFFF;    height: 20px;    line-height: 20px;    text-align: center">沐</span>  
          </span>
            管理员用户授权界面</span>
        </div>
      </div>

      <div style="margin-top:5%;width:30%">
           <el-input placeholder="请输入你要进行授权的用户(可空)" @keyup.enter.native="getSearchNameList" v-model="keyName" class="input-with-select">
             <el-button @click="getSearchNameList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
      </div>

      <div v-show="tableData" style="margin-top:3%;margin-left:2%;font-size:2.6em;width:55%;">
          <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :data="userList"
           style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="登录名"
            width="200">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            >
          </el-table-column>
          <el-table-column
            prop="role"
            width="90"
            label="角色">
          </el-table-column>
          <el-table-column 
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleRole(scope.row.id, scope.row.role,scope.row.name)">调整角色</el-button>
            <el-button
              size="mini"
              type="success"
              @click="handleEmail(scope.row.id, scope.row.email,scope.row.name)">修改邮箱</el-button>
          </template>
        </el-table-column>
        </el-table>
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
  name: 'usermanager',
  data () {
    return {
     keyName:'',
     userList:[],
     tableData:false,
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
    axios.defaults.baseURL = global_.API_BASEURL;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$root.getToken() ;
  },
  methods:{
    //拿到搜索到的用户列表
    getSearchNameList(){
      var url="/searchResultName?key="+this.keyName;
      var self=this;
      this.axios.get(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          self.userList=res.data.data;
          self.tableData=true;
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
    },
    handleRole(id,role,name){
     // alert("此:id"+id+",角色:"+role);
      var sendName="";
      if(role=="用户"){
        sendName="管理员";
      }else{
        sendName="用户";
      }

      var url="/changeUserStatus?changeRole="+sendName+"&id="+id;
      var self=this;
      this.axios.post(url,{}).then((res)=>{
        if(res.data.code=="0000"){
          self.getSearchNameList();
          self.$message({
            type: 'success',
            message: '用户【'+name+"】，角色已修改为:"+sendName,
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
    handleEmail(id,email,name){
       var self=this;
       this.$prompt('请输入新的邮箱号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          //邮箱处理
         var url="/updateUserEmail?id="+id+"&email="+value;
         self.axios.post(url,{}).then((res)=>{
           if(res.data.code=="0000"){
              self.getSearchNameList();
              self.$message({
                type: 'success',
                message: '已将【'+name+'】的绑定修改邮箱为: ' + value
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
          self.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
    },

  }
}
</script>

<style scoped>


</style>
