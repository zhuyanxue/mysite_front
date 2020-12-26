<template>
  <div class="footers" style="margin: 0px;border: 0px;padding: 0px;font-family: Kaiti;">
    <div align="center">
      <div style="margin-top:2%">
        <img src="../assets/img/logo.png" width="6%"/>
        <div style="margin-top:1%;font">
          <span style="font-size:1.4em;color:green;">
              <span style="border-radius: 50%; margin-top:2.5px;margin-right:-5px;   height: 20px;    width: 20px;    display: inline-block;    background: #f30303;      vertical-align: top;">  
              <span style="display: block;    color: #FFFFFF;    height: 20px;    line-height: 20px;    text-align: center">沐</span>  
          </span>
            查看所有页脚内容</span>
        </div>
      </div> 
    </div>  
    <div style="margin-top:5%;margin-left:35%">
          <div v-for="(footer,index) in Array.prototype.reverse.call(allfooter)" :key="index" style="margin-top:2%;">
              
              <span style="cursor:pointer;" @click="topFooter(footer)"><i class="el-icon-s-promotion"></i></span> &nbsp;&nbsp;
              <span style="cursor:pointer;" @click="deleteFooter(footer)"><i class="el-icon-delete"></i></span>&nbsp;
              {{index}}.
              <span>{{footer.content}}</span>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
      </div>
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
        allfooter:[],
    }
  },
  mounted () {
    axios.defaults.baseURL = global_.API_BASEURL;
    this.getAllFooter();
  },
  methods: {
      getAllFooter(){
          var url="/getAllFooter";
          var self=this;
          this.axios.get(url,{}).then((res)=>{
              if(res.data.code=="0000"){
                  self.allfooter=res.data.data;
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
      topFooter(param){
         var self=this; 
         this.$confirm('此操作会将【'+param.content+'】放在页面底部显示, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var url="/setStatusOne?id="+param.id;
          self.axios.put(url,{}).then((res)=>{
              if(res.data.code=="0000"){
                    self.$message({
                    type: 'success',
                    message: '操作成功,可到页面查看'
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
            message: '已取消操作'
          });          
        });
      },
      deleteFooter(param){
         var self=this; 
         this.$confirm('此操作将永久删除【'+param.content+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var url="/deleteFooter?id="+param.id;
          self.axios.delete(url,{}).then((res)=>{
              if(res.data.code=="0000"){
                  self.getAllFooter();
                  self.$message({
                    type: 'success',
                    message: '删除成功!'
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
            message: '已取消删除'
          });          
        });
      }
  }
}
</script>
<style scoped>


</style>