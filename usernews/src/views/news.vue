<!--  -->
<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main v-loading="loading">
        <el-timeline reverse="true">
          <el-timeline-item
            :timestamp="item.createTime"
            placement="top"
            v-for="item in newsList"
            :key="item.id"
          >
            <el-card class="box-card">
              <router-link :to="{name:'NewsDetail',params:{id:item.id}}">{{item.title}}</router-link>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-main>
    </el-container>
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
      newsList: {},
      loading: false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getNewsList() {
      this.loading = true;
      this.$http
        .get("/user/news")
        .then(res => {
          this.newsList = res.data.data;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getNewsList();
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
  overflow: hidden;
  margin: 0px;
  padding: 0;
  width: 100%;
  height: 100%;
}
.el-container {
  margin: 0;
  padding: 0;
  background-color: rgba(254, 249, 249, 0.966);
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 160px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  width: 60%;
  margin: 0 auto;
  margin-top: 52px;
}
.box-card {
  background-color: #eee;
  width: 550px;
  margin: 0 auto;
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
}
.box-card:hover {
  transform: translate3d(-2px, -2px, 0);
}
a {
  text-decoration: none;
  color: #9a9da2;
}
.el-timeline-item {
  text-align: left;
}
</style>
