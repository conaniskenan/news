<!--  -->
<template>
  <div class="content">
    <el-card class="box-card" v-loading="loading">
      <el-page-header @back="goBack" content></el-page-header>
      <div class="title">{{currentNews.title}}</div>
      <div class="msg">
        <span class="time">{{currentNews.createTime}}</span>
        <span class="author">来源: {{currentNews.author}}</span>
        <span class="category">分类: {{currentNews.category}}</span>
      </div>
      <el-divider></el-divider>
      <div class="news" v-html="currentNews.content"></div>
    </el-card>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      currentNews: {},
      loading: false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    $route: "getCurrentNews"
  },
  //方法集合
  methods: {
    getCurrentNews() {
      this.loading = true;
      this.currentNews = "";
      this.$http
        .get("/user/news/" + this.$route.params.id)
        .then(res => {
          this.currentNews = res.data.data;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    goBack() {
      this.$router.push("/news");
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCurrentNews();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.content {
  width: 60%;
  margin: 0 auto;
  background-color: #ddd;
  padding-top: 30px;
  padding-bottom: 30px;
}
.box-card {
  background-color: #eee;
  width: 700px;
  margin: 0 auto;
  margin-bottom: 20px;
}
.title {
  text-align: center;
  font-size: 30px;
  color: #2D2D2D;
}
.msg {
  font-size: 2px;
  text-align: center;
  color: #b7b7b7;
  margin-top: 10px;
}
.time {
  margin-right: 10px;
}
.author {
  margin-right: 10px;
}
.news {
  font-size: 18px;
}
.el-page-header {
  margin-bottom: 20px;
  color: rgb(175, 115, 115);
}
</style>
