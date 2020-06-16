<!--  -->
<template>
  <div class="content" v-loading="loading">
    <el-card class="box-card">
      <el-page-header @back="goBack" content></el-page-header>
      <div class="title">{{ currentNews.title }}</div>
      <div class="msg">
        <span class="time">{{ currentNews.createTime }}</span>
        <span class="author">来源: {{ currentNews.author }}</span>
        <span class="category">分类: {{ currentNews.category }}</span>
        <span class="viewCount">浏览量: {{ currentNews.viewCount }}</span>
      </div>
      <el-divider></el-divider>
      <div class="news" v-html="currentNews.content"></div>
    </el-card>
    <div class="input">
      <el-form :model="form" ref="commentForm" :rules="rules">
        <el-form-item label prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            placeholder="说两句吧。。。"
            v-model="form.content"
            prop="comment"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="btn">
        <el-button type="primary" v-if="isLogin" @click="toComment">发布</el-button>
        <el-button type="primary" v-else @click="toLogin">登录后发表评论</el-button>
      </div>
    </div>

    <el-card v-for="item in currentComments" :key="item.id" class="comment">
      <div>
        <span class="commentUsername">{{ item.userName }}</span>
        <span class="commentTime">{{ item.createTime }}</span>
        <div class="commentContent">{{ item.content }}</div>
      </div>
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
    var checkContent = (rule, value, callback) => {
      var len = value.length;
      if (len == 0) {
        callback(new Error("评论不能为空"));
      } else {
        return callback();
      }
    };
    return {
      currentNews: {},
      currentComments: {},
      form: { comment: "", nid: this.$route.params.id },
      loading: false,
      isLogin: false,
      rules: {
        content: [
          {
            validator: checkContent,
            trigger: "blur"
          }
        ]
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    // $route: ["getCurrentNews", "getCurrentComments"],
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
    },
    getCurrentComments() {
      this.$http
        .get("/user/" + this.$route.params.id)
        .then(res => {
          this.currentComments = res.data.data;
          console.log(this.currentComments);
        })
        .catch(error => {
          console.log(error);
        });
    },
    toComment() {
      this.$http
        .post("/user/comments", this.form)
        .then(res => {
          if (res.data.code !== 201) {
            setTimeout(() => {
              this.$message.error("发布评论失败");
            }, 1000);
          } else {
            setTimeout(() => {
              this.$refs.commentForm.resetFields();
              this.getCurrentNews();
              this.getCurrentComments();
              this.$message.success("发表评论成功");
            }, 1000);
          }
        })
        .catch(() => {});
    },
    toLogin() {
      this.$router.push({
        path: "/news",
        query: {
          login: false
        }
      });
    },
    checkIsLogin() {
      if (localStorage.token) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCurrentComments();
    this.checkIsLogin();
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
  color: #2d2d2d;
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
.category {
  margin-right: 10px;
}
.news {
  font-size: 18px;
}
.el-page-header {
  margin-bottom: 20px;
  color: rgb(175, 115, 115);
}
.input {
  width: 700px;
  height: 200px;
  margin: 0 auto;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  margin-right: 5px;
}
.comment {
  width: 700px;
  margin: 0 auto;
  margin-top: 8px;
  background-color: rgb(247, 242, 242);
  box-shadow: 0 2px 12px 0 rgba(88, 64, 64, 0.1);
  height: 100px;
}
.comment:hover {
  transform: translate3d(-2px, -2px, 0);
}
.commentUsername {
  margin-left: 20px;
  color: rgb(155, 115, 115);
  font-weight: 700;
}
.commentTime {
  margin-left: 20px;
  font-size: 12px;
  color: #aeaeae;
}
.commentContent {
  margin-top: 12px;
  margin-left: 20px;
  color: rgb(134, 98, 98);
  font-weight: 700;
}
</style>
