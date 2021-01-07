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
    prelod(){
      let imgs = [
         require('./assets/img/4.jpg'),
         require('./assets/img/2.jpg'),
         require('./assets/img/3.jpg'),
         require('./assets/img/1.jpg')
      ]

      for (let img of imgs) {
        let image = new Image();
        image.src = img;
        image.onload = () => {
          
        }
      }

    }
  },
  created: function(){
  },
  mounted(){
    //进行图片预加载
    this.prelod();
    //终止加载动画 
    document.body.removeChild(document.getElementById('Loading'));
  }
}
</script>

