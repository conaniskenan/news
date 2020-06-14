<!--  -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/comment' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="7">
          <!-- 搜索 -->
          <div class="grid-content bg-purple">
            <el-input
              v-model="searchData"
              placeholder="请输入新闻标题进行搜索"
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
        <el-table-column type="index" label="序号" align="center">
          <template v-slot="scope">
            <span>{{(page - 1) * limit + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="新闻标题" prop="title" width="350" align="center"></el-table-column>
        <el-table-column label="评论用户" prop="userName" align="center"></el-table-column>
        <el-table-column label="评论内容" prop="content" align="center"></el-table-column>
        <el-table-column label="评论时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCommentsById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10,15, 20]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >></el-pagination>
    </el-card>
    <!-- 弹出表单-编辑 -->
    <el-dialog title="编辑评论" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="editForm.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论用户" prop="userName">
          <el-input v-model="editForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="editForm.content"></el-input>
        </el-form-item>
        <el-form-item label="评论时间" prop="createTime">
          <el-input v-model="editForm.createTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editComment">确 定</el-button>
      </span>
    </el-dialog>
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
      limit: 10,
      total: null,
      page: 1,
      searchData: "",
      commentList: [],
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        content: [
          {
            required: true,
            message: "请输入评论内容",
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
    getCommentList() {
      this.loading = true;
      this.$http
        .get("/admin/comments")
        .then(res => {
          this.commentList = res.data.data;
          this.getFilterList();
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      this.$http
        .get("/admin/comments/" + id)
        .then(res => {
          this.editForm = res.data.data;
          console.log(id);
        })
        .catch(error => {
          return error;
        });
    },
    editComment() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .put("admin/comments", this.editForm)
          .then(() => {
            this.$message.success("编辑评论成功");
            this.editDialogVisible = false;
            this.getCommentList();
          })
          .catch(() => {
            this.$message.error("编辑评论失败");
          });
      });
    },
    removeCommentsById(id) {
      this.$confirm("此操作将永久删除该条评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/admin/comments/" + id)
            .then(() => {
              this.$message.success("删除评论成功");
              this.getCommentList();
            })
            .catch(() => {
              this.$message.error("删除评论失败");
            });
        })
        .catch(error => {
          return error;
        });
    },
    getFilterList() {
      //  es6过滤得到满足搜索条件的展示数据list
      //过滤分页
      let list = this.commentList.filter((item, index) =>
        item.title.toLowerCase().includes(this.searchData.toLowerCase())
      );
      this.filterList = list.filter(
        (item, index) =>
          index < this.page * this.limit &&
          index >= this.limit * (this.page - 1)
      );
      this.total = list.length;
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
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCommentList();
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
    this.getCommentList();
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
.el-form .el-input {
  width: 80%;
}
.el-select {
  width: 80%;
}
.el-textarea {
  width: 80%;
}
</style>
