# mysite
* 前言：因为平时在csdn写程序记录，感到层次感不明显，故而想开发一个网站记录自己的学习。但使用后，我的想法产生了一些变化，觉得层次感不是最重要的，在这之上，要有历史，去改动代价实在太大，准备重新开发一个。所以，这个网站暂时无用，便将其开源。
* mysite网站前台，主要由vue+elementUI实现。网站访问地址：访问地址：47.102.212.127，（管理员测试账户：master,123456）

## Build Setup
项目使用的vue 2.5.2版本
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


### 网站页面说明（部分）   

* 首页
这个页面是下载的模板【地址：https://www.lanrenzhijia.com/source/5482.html】 
，做了部分的修改，以适配于vue项目。
具体的修改：  
（1）删除nprogress.js文件，使用npm安装这个插件；
（2）安装Jquery，在webpack.base.conf.js中引入；
  ```
    //JQuery,引入包
   plugins: [ 
       new webpack.ProvidePlugin({ 
        $:"jquery", 
        jQuery:"jquery", 
       "windows.jQuery":"jquery"
      }) 
  ], 
  ```
   
  （3）将index.js放到到home.vue中，合并index.html页面。
  （4）删除不用的lantern.js，requestAnimate.js，velocity.min.js，其它js改写为vue的属性，通过export，import进行引用。
  （5）其仿window桌面实现逻辑：页面初始化时，通过js dom操作拿到元素，对元素添加鼠标事件，并设置其样式。
* 详情页
这里是网站的核心操作内容，包括富文本的编辑，图片的上传，视频的上传播放等一系列操作



## 项目部署linux
1、修改global.js,将访问基址指向linux的ip地址
```
const  API_BASEURL= "http://47.102.212.127:9090/mysite/api/";
```
2、将Home.vue,Detail.vue,Editor.vue中的localhost替换为linux的ip地址。
localhost——>linux ip；

3、指向npm run build进行打包，测试。  

具体的部署过程：https://blog.csdn.net/qq_33813721/article/details/112307821