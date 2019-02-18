<template>
  <div style="height: 100%;display:flex;flex-direction: column;">
    <div style="display: flex;padding:5px;align-items: center;">
      <div style="flex: auto;display:flex;">
        <el-input v-model="searchText" placeholder="姓名 / 类型" class="grid-query" size="small" style="width:40%;"></el-input>
        <a class="opt-search" style="margin-left: 10px;" @click="getLogList"></a>
      </div>
    </div>
    <el-table :data="tableData" height="100%" border size="mini">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="operator" label="操作人姓名">
      </el-table-column>
      <el-table-column prop="time" label="操作时间">
      </el-table-column>
      <el-table-column prop="type" label="操作类型">
      </el-table-column>
      <el-table-column prop="desc" label="描述">
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      :total="total"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSize"
      @current-change="handleCurrent">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {

  },
  data(){
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      searchText: ''
    }
  },
  computed: {
    queryChange(){
      return this.page + this.pageSize;
    }
  },
  watch: {
    queryChange(){
      this.getLogList();
    }
  },
  methods: {
    indexMethod(index){
      return index + (this.page-1)*this.pageSize + 1;
    },
    handleCurrent(val){
      this.page = val;
      this.currentPage = this.val;
    },
    handleSize(val){
      this.pageSize = val;
    },
    async getLogList(){
      let param = {page: this.page, size: this.pageSize,searchText: this.searchText};
      let res = await this.$http.getSysLog(param);

      if(res && res.data && res.data.success) {
        this.tableData = res.data.result.items;
        this.total= res.data.result.totalCount;
        this.currentPage = res.data.result.currentPage;
      }else{
        this.$message.error('获取数据异常');
      }
    }
  },
  mounted(){
    this.getLogList();
  }
}
</script>
