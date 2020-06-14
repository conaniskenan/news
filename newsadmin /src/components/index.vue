<!--  -->
<template>
  <div class="container" v-loading="loading">
    <!-- logo -->
    <div class="box">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form :model="formData" :rules="rules" ref="form" label-width class="login_form">
        <el-form-item label prop="username">
          <el-input v-model="formData.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input
            v-model="formData.password"
            placeholder="密码"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- form -->
  </div>
</template>

<script>
// import qs from "qs";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      loading: false,
      formData: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleReset() {
      this.$refs.form.resetFields();
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.loading = true;
        this.$http
          .post("/token", this.formData)
          .then(res => {
            if (res.data.code !== 200) {
              setTimeout(() => {
                this.loading = false;
                this.$message.error("用户名或密码错误");
                return;
              }, 1000);
            } else {
              const data = res.data.data;
              localStorage.setItem("token", data);
              setTimeout(() => {
                this.loading = false;
                this.$router.push("/home");
                this.$message.success("登陆成功");
              }, 1000);
            }
          })
          .catch(() => {});
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
.container {
  background-color: #2b4b6b;
  height: 100%;
}
.box {
  height: 260px;
  width: 400px;
  background-color: rgba(238, 228, 228, 0.721);
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logo {
  height: 100px;
  width: 100px;
  border: 1px solid rgb(233, 224, 224);
  background-color: #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 5px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logo img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
