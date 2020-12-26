<template>
  <div id="app">   
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      
    }
  },
  methods:{
   
  },
  created: function(){
    
  },
  mounted(){
    //终止加载动画
    document.body.removeChild(document.getElementById('Loading'));
  }
}
</script>

