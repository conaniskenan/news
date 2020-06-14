<!--  -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/news' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="7">
          <!-- 搜索 -->
          <div class="grid-content bg-purple">
            <el-input
              v-model="searchData"
              placeholder="请输入用户姓名进行搜索"
              clearable
              style="width:380px"
              @clear="search"
              @change="search"
              @click="search"
              @input="search"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!-- 主体列表 -->
      <el-table :data="filterList" border stripe size="mini" v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="250">
          <template v-slot="scope">
            <span>{{(page - 1) * limit + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="username" width="350" align="center"></el-table-column>
        <el-table-column label="密码" prop="password" align="center"></el-table-column>
        <el-table-column label="注册时间" prop="createtime" align="center"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[1, 2,5, 10]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >></el-pagination>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      loading: false,
      filterList: [],
      filterLists: [],
      data: [],
      limit: 10,
      total: null,
      page: 1,
      searchData: "",
      userList: []
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getUserList() {
      this.loading = true;
      this.$http
        .get("/admin/users")
        .then(res => {
          this.userList = res.data.data;
          this.getFilterList();
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getFilterList() {
      //  es6过滤得到满足搜索条件的展示数据list
      this.filterLists = this.userList.filter((item, index) =>
        item.username.toLowerCase().includes(this.searchData.toLowerCase())
      );
      //过滤分页
      this.filterList = this.filterLists.filter(
        (item, index) =>
          index < this.page * this.limit &&
          index >= this.limit * (this.page - 1)
      );
      //分页的总数据
      this.total = this.filterLists.length;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getFilterList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getFilterList();
    },
    search() {
      this.page = 1;
      this.getFilterList();
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getUserList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {
    this.getUserList();
  } //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
/* @import url(); 引入公共css类 */
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
