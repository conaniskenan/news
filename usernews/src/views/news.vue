<!--  -->
<template>
  <div>
    <el-container>
      <el-header>
        <div class="header">
          <img src="../assets/logo.png" alt />
          <span>柠檬新闻网</span>
        </div>
        <div class="login" v-if="isLogin">
          <span>欢迎您 {{ loginUsername }}</span>
          <el-button type="info" size="mini" @click="handleLogout"
            >退出</el-button
          >
        </div>
        <div class="logout" v-else>
          <el-button type="primary" size="mini" @click="handleLogin"
            >登录</el-button
          >
        </div>
      </el-header>
      <el-main v-loading="loading">
        <el-timeline>
          <el-timeline-item
            :timestamp="item.createTime"
            placement="top"
            v-for="item in newsList"
            :key="item.id"
          >
            <el-card class="box-card">
              <router-link
                :to="{ name: 'NewsDetail', params: { id: item.id } }"
                >{{ item.title }}</router-link
              >
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-main>
    </el-container>
    <!-- 登录 -->
    <el-dialog
      v-loading="loading"
      :visible.sync="loginDialogVisible"
      width="25%"
      @close="loginDialogClosed"
      ><el-form
        :model="formData"
        :rules="loginRules"
        ref="loginForm"
        label-width
      >
        <div class="input">
          <el-form-item label prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item label prop="password">
            <el-input
              v-model="formData.password"
              placeholder="密码"
              show-password
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
        </div>

        <el-form-item class="btn">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="loginDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="toRegister">
        <el-link type="info" :underline="false" @click="handleToRegister"
          >没有账号？去注册吧</el-link
        >
      </div>
    </el-dialog>
    <!-- 注册 -->
    <el-dialog
      v-loading="loading"
      :visible.sync="registerDialogVisible"
      width="27%"
      @close="registerDialogClosed"
      ><el-form
        :model="registerData"
        :rules="registerRules"
        ref="registerForm"
        label-width
      >
        <div class="input2">
          <el-row :gutter="20">
            <el-form-item label prop="username">
              <el-col :span="22">
                <el-input
                  v-model="registerData.username"
                  placeholder="用户名"
                  prefix-icon="el-icon-user"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <i
                  class="el-icon-success color-green"
                  v-if="corretData.username"
                >
                </i>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label prop="password"
              ><el-col :span="22">
                <el-input
                  v-model="registerData.password"
                  placeholder="密码"
                  show-password
                  prefix-icon="el-icon-lock"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <i
                  class="el-icon-success color-green"
                  v-if="corretData.password"
                >
                </i> </el-col></el-form-item
          ></el-row>
          <el-row :gutter="20">
            <el-form-item label prop="cpassword"
              ><el-col :span="22">
                <el-input
                  v-model="registerData.cpassword"
                  placeholder="确认密码"
                  show-password
                  prefix-icon="el-icon-lock"
                ></el-input
              ></el-col>
              <el-col :span="2">
                <i
                  class="el-icon-success color-green"
                  v-if="corretData.cpassword"
                >
                </i>
              </el-col> </el-form-item
          ></el-row>
          <el-row :gutter="20">
            <el-form-item label prop="phone"
              ><el-col :span="22">
                <el-input
                  v-model="registerData.phone"
                  placeholder="手机号"
                  prefix-icon="el-icon-mobile-phone"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <i class="el-icon-success color-green" v-if="corretData.phone">
                </i> </el-col></el-form-item
          ></el-row>
          <el-row :gutter="20">
            <el-form-item label prop="email"
              ><el-col :span="22">
                <el-input
                  v-model="registerData.email"
                  placeholder="邮箱"
                  prefix-icon="el-icon-message"
                ></el-input
              ></el-col>
              <el-col :span="2">
                <i class="el-icon-success color-green" v-if="corretData.email">
                </i>
              </el-col>
            </el-form-item>
          </el-row>
        </div>

        <el-form-item class="btn">
          <el-button type="primary" @click="onRegister">注册</el-button>
          <el-button @click="registerDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="toRegister">
        <el-link type="info" :underline="false" @click="handleToLogin"
          >已有账号？立即登录</el-link
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
// import qs from "qs"

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    var checkUserName1 = (rule, value, callback) => {
      var len = value.length
      const regChinese = /.*[\u4e00-\u9fa5].*/
      if (len == 0) {
        callback(new Error("用户名不能为空"))
      } else if (len < 3 || len > 10) {
        callback(new Error("长度在 3 到 10 个字符"))
      } else if (value.indexOf(" ") != -1) {
        callback(new Error("用户名不能含有空格"))
      } else if (regChinese.test(value)) {
        callback(new Error("用户名不能含有中文字符"))
      } else {
        return callback()
      }
    }
    var checkUserName = (rule, value, callback) => {
      this.corretData.username = false
      const regChinese = /.*[\u4e00-\u9fa5].*/
      var len = value.length
      if (len == 0) {
        callback(new Error("用户名不能为空"))
      } else if (len < 3 || len > 10) {
        callback(new Error("长度在 3 到 10 个字符"))
      } else if (value.indexOf(" ") != -1) {
        callback(new Error("用户名不能含有空格"))
      } else if (regChinese.test(value)) {
        callback(new Error("用户名不能含有中文字符"))
      } else {
        this.$http
          .post("/user/check/" + value)
          .then(() => {
            this.corretData.username = true
            return callback()
          })
          .catch(() => {
            callback(new Error("此用户名已被注册"))
          })
      }
    }
    var checkPassword = (rule, value, callback) => {
      this.corretData.password = false
      var len = value.length
      if (len == 0) {
        callback(new Error("密码不能为空"))
      } else if (len < 6 || len > 15) {
        callback(new Error("长度在 6 到 15 个字符"))
      } else if (value.indexOf(" ") != -1) {
        callback(new Error("密码不能含有空格"))
      } else {
        this.corretData.password = true
        return callback()
      }
    }
    var checkcPassword = (rule, value, callback) => {
      this.corretData.cpassword = false
      var len = value.length
      if (len == 0) {
        callback(new Error("密码不能为空"))
      } else if (len < 6 || len > 15) {
        callback(new Error("长度在 6 到 15 个字符"))
      } else if (value.indexOf(" ") != -1) {
        callback(new Error("密码不能含有空格"))
      } else if (value !== this.registerData.password) {
        callback(new Error("两次输入密码不一致"))
      } else {
        this.corretData.cpassword = true
        return callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      this.corretData.phone = false
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (value.length == 0) {
        callback(new Error("手机号不能为空"))
      } else if (!regPhone.test(value)) {
        callback(new Error("请输入合法的手机号"))
      } else {
        this.corretData.phone = true
        return callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      this.corretData.email = false
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (value.length == 0) {
        callback(new Error("邮箱不能为空"))
      } else if (!regEmail.test(value)) {
        callback(new Error("请输入合法的邮箱"))
      } else {
        this.corretData.email = true
        return callback()
      }
    }

    return {
      newsList: {},
      loading: false,
      isLogin: false,
      loginDialogVisible: false,
      registerDialogVisible: false,
      formData: { username: "", password: "" },
      registerData: {
        username: "",
        password: "",
        cpassword: "",
        email: "",
        phone: "",
      },
      corretData: {
        username: false,
        password: false,
        cpassword: false,
        email: false,
        phone: false,
      },
      loginUsername: localStorage.username,
      loginRules: {
        username: [
          {
            validator: checkUserName1,
            trigger: "blur",
          },
        ],
        password: [
          {
            validator: checkPassword,
            trigger: "blur",
          },
        ],
      },
      registerRules: {
        username: [
          {
            validator: checkUserName,
            trigger: "blur",
          },
        ],
        password: [
          {
            validator: checkPassword,
            trigger: "blur",
          },
        ],
        cpassword: [
          {
            validator: checkcPassword,
            trigger: "blur",
          },
        ],
        email: [
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        phone: [
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
      },
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getNewsList() {
      this.loading = true
      this.$http
        .get("/user/news")
        .then((res) => {
          this.newsList = res.data.data
          this.getLoginUsername()
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return
        this.loading = true
        this.$http
          .post("/user/login", this.formData)
          .then((res) => {
            if (res.data.code !== 200) {
              setTimeout(() => {
                this.loading = false
                this.$message.error("用户名或密码错误")
                return
              }, 1000)
            } else {
              const data = res.data.data
              localStorage.setItem("token", data.token)
              localStorage.setItem("username", data.userName)
              setTimeout(() => {
                this.loading = false
                this.loginDialogVisible = false
                this.getNewsList()
                this.isLogin = true
                this.$message.success("登陆成功")
              }, 1000)
            }
          })
          .catch(() => {})
      })
    },
    onRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (!valid) return
        this.loading = true
        this.$http
          .post("/user/register", this.registerData)
          .then((res) => {
            if (res.data.code !== 201) {
              setTimeout(() => {
                this.loading = false
                this.$message.error("注册失败")
                return
              }, 1000)
            } else {
              setTimeout(() => {
                this.loading = false
                this.registerDialogVisible = false
                this.$message.success("注册成功！")
                this.loginDialogVisible = true
              }, 1000)
            }
          })
          .catch(() => {})
      })
    },
    handleLogin() {
      this.loginDialogVisible = true
    },
    handleLogout() {
      localStorage.clear()
      this.getNewsList()
      this.checkIsLogin()
    },
    loginDialogClosed() {
      this.$refs.loginForm.resetFields()
    },
    registerDialogClosed() {
      this.$refs.registerForm.resetFields()
      for (let key in this.corretData) {
        this.corretData[key] = false
      }
    },
    checkIsLogin() {
      if (localStorage.getItem("token")) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    getLoginUsername() {
      this.loginUsername = localStorage.username
    },
    handleToRegister() {
      this.loginDialogVisible = false
      this.registerDialogVisible = true
    },
    handleToLogin() {
      this.registerDialogVisible = false
      this.loginDialogVisible = true
    },
    getParams() {
      // 取到路由带过来的参数
      if (this.$route.params.toLogin && !localStorage.token) {
        this.loginDialogVisible = true
        this.$message.warning("请登录后发表评论")
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getNewsList()
    this.checkIsLogin()
    this.getParams()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
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
  background-color: rgba(253, 247, 247, 0.966);
}
.el-header {
  background-color: #7a7d83;
  color: #333;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
}
.header {
  margin-left: 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header span {
  font-weight: 700;
  letter-spacing: 3px;
  font-size: 18px;
  text-shadow: 2px 2px rgb(169, 175, 141);
}
.header img {
  width: 50px;
  height: 50px;
  border: 2px solid #eee;
  border-radius: 50%;
  background-color: rgba(223, 201, 201, 0.934);
  margin-right: 10px;
}
.el-main {
  background-color: #b7babe;
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
  color: rgb(143, 37, 37);
}
.el-dialog {
  border-radius: 10%;
}
.input {
  width: 80%;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 40px;
}
.input2 {
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.login span {
  font-size: 15px;
  font-weight: 700;
  color: rgb(210, 211, 183);
  margin-right: 10px;
}
.logout {
  margin-right: 20px;
}
.toRegister {
  margin-top: 20px;
}
.toRegister a {
  font-size: 12px;
}
</style>
