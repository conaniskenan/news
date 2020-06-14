<!--  -->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/news' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
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
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true">添加新闻</el-button>
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
        <el-table-column label="作者" prop="author" align="center"></el-table-column>
        <el-table-column label="分类" prop="category" align="center"></el-table-column>
        <el-table-column label="发布时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="浏览次数" prop="viewCount" width="100" align="center"></el-table-column>
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
              @click="removeNewsById(scope.row.id)"
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
    <!-- 弹出表单-添加 -->
    <el-dialog title="添加新闻" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" required prop="author">
          <el-select v-model="addForm.author" placeholder="请选择新闻来源">
            <el-option label="新京报" value="新京报"></el-option>
            <el-option label="环球网" value="环球网"></el-option>
            <el-option label="海外网" value="海外网"></el-option>
            <el-option label="人民日报" value="人民日报"></el-option>
            <el-option label="澎湃新闻" value="澎湃新闻"></el-option>
            <el-option label="央视新闻" value="央视新闻"></el-option>
            <el-option label="腾讯新闻" value="腾讯新闻"></el-option>
            <el-option label="网易新闻" value="网易新闻"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" required prop="category">
          <el-select v-model="addForm.category" placeholder="请选择新闻分类">
            <el-option label="国内新闻" value="国内新闻"></el-option>
            <el-option label="国外新闻" value="国外新闻"></el-option>
            <el-option label="热点新闻" value="热点新闻"></el-option>
            <el-option label="游戏新闻" value="游戏新闻"></el-option>
            <el-option label="娱乐新闻" value="娱乐新闻"></el-option>
            <el-option label="社会新闻" value="社会新闻"></el-option>
            <el-option label="军事新闻" value="军事新闻"></el-option>
            <el-option label="体育新闻" value="体育新闻"></el-option>
            <el-option label="科技新闻" value="科技新闻"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻内容" prop="content">
          <el-input type="textarea" v-model="addForm.content" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNews">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出表单-编辑 -->
    <el-dialog title="编辑新闻" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-select v-model="editForm.author" placeholder="请选择新闻来源">
            <el-option label="新京报" value="新京报"></el-option>
            <el-option label="环球网" value="环球网"></el-option>
            <el-option label="海外网" value="海外网"></el-option>
            <el-option label="人民日报" value="人民日报"></el-option>
            <el-option label="澎湃新闻" value="澎湃新闻"></el-option>
            <el-option label="央视新闻" value="央视新闻"></el-option>
            <el-option label="腾讯新闻" value="腾讯新闻"></el-option>
            <el-option label="网易新闻" value="网易新闻"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" required prop="category">
          <el-select v-model="editForm.category" placeholder="请选择新闻分类">
            <el-option label="国内新闻" value="国内新闻"></el-option>
            <el-option label="国外新闻" value="国外新闻"></el-option>
            <el-option label="热点新闻" value="热点新闻"></el-option>
            <el-option label="游戏新闻" value="游戏新闻"></el-option>
            <el-option label="娱乐新闻" value="娱乐新闻"></el-option>
            <el-option label="社会新闻" value="社会新闻"></el-option>
            <el-option label="军事新闻" value="军事新闻"></el-option>
            <el-option label="体育新闻" value="体育新闻"></el-option>
            <el-option label="科技新闻" value="科技新闻"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻内容" prop="content">
          <el-input type="textarea" v-model="editForm.content" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNews">确 定</el-button>
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
      newsList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        author: "",
        category: "",
        content: "",
        title: ""
      },
      editForm: {},
      addFormRules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          },
          {
            min: 4,
            max: 30,
            message: "标题的长度在4~30个字符之间",
            trigger: "blur"
          }
        ],
        author: [
          {
            required: true,
            message: "请选择新闻来源",
            trigger: "blur"
          }
        ],
        category: [
          {
            required: true,
            message: "请选择新闻分类",
            trigger: "blur"
          },
          {
            min: 4,
            max: 30,
            message: "标题的长度在4~30个字符之间",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入新闻内容",
            trigger: "blur"
          },
          {
            min: 10,
            max: 5000,
            message: "新闻内容的长度在10~5000个字符之间",
            trigger: "blur"
          }
        ]
      },
      editFormRules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          },
          {
            min: 4,
            max: 30,
            message: "标题的长度在4~30个字符之间",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入新闻内容",
            trigger: "blur"
          },
          {
            min: 10,
            max: 5000,
            message: "新闻内容的长度在10~5000个字符之间",
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
    getNewsList() {
      this.loading = true;
      this.$http
        .get("/admin/news")
        .then(res => {
          this.newsList = res.data.data;
          this.getFilterList();
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addNews() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .post("/admin/news", this.addForm)
          .then(() => {
            this.$message.success("添加新闻成功");
            this.addDialogVisible = false;
            this.getNewsList();
          })
          .catch(() => {
            this.$message.error("添加新闻失败");
          });
      });
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      this.$http
        .get("/admin/news/" + id)
        .then(res => {
          this.editForm = res.data.data;
        })
        .catch(error => {
          return error;
        });
    },
    editNews() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .put("admin/news", this.editForm)
          .then(() => {
            this.$message.success("更新新闻成功");
            this.editDialogVisible = false;
            this.getNewsList();
          })
          .catch(() => {
            this.$message.error("更新新闻失败");
          });
      });
    },
    removeNewsById(id) {
      this.$confirm("此操作将永久删除该新闻, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete("/admin/news/" + id)
            .then(() => {
              this.$message.success("删除新闻成功");
              this.getNewsList();
            })
            .catch(() => {
              this.$message.error("删除新闻失败");
            });
        })
        .catch(error => {
          return error;
        });
    },
    getFilterList() {
      //  es6过滤得到满足搜索条件的展示数据list
      //过滤分页
      let list = this.newsList.filter((item, index) =>
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
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getFilterList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getFilterList();
    },
    search() {
      this.page = 1;
      this.getFilterList();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
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
  activated() {
    this.getNewsList();
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
