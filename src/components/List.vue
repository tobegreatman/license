<template>
  <div style="height: 100%;display:flex;flex-direction: column;">
    <div style="display: flex;padding:5px;align-items: center;">
      <div style="flex: auto;display:flex;">
        <el-input placeholder="License编码、项目名称、PO" v-model="searchText" class="grid-query" size="small" style="width:40%;"></el-input>
        <a class="opt-search" style="margin-left: 10px;" @click="reloadTask"></a>
      </div>
      <el-button type="primary" size="mini" @click="showSlide">申请</el-button>
    </div>
    <el-table :data="tableData" height="100%" border size="mini">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="op" label="操作" width="45">
        <template slot-scope="scope">
          <div class="opt-more operator" @click="optClick(scope.row)" v-clickoutside="handerClose" ></div>
        </template>
      </el-table-column>
      <el-table-column prop="productType" label="产品" width="80">
      </el-table-column>
      <el-table-column prop="code" label="License编码" width="140">
      </el-table-column>
      <el-table-column prop="createStatus" label="生成状态" width="80">
        <template slot-scope="scope">
          {{scope.row.createStatus==2? '失败':(scope.row.createStatus==1?'完成':'等待')}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" width="200">
      </el-table-column>
      <el-table-column prop="proposer" label="申请人" width="80">
      </el-table-column>
      <el-table-column prop="proposeTime" label="申请日期" width="150">
      </el-table-column>
      <el-table-column prop="dueDays" label="有效天数" width="80">
      </el-table-column>
      <el-table-column prop="po" label="PO" width="120">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          {{scope.row.status==2? '拒绝':(scope.row.status==1?'审批完成':'审批中')}}
        </template>
      </el-table-column>
      <el-table-column prop="approver" label="审批人" width="80">
      </el-table-column>
      <el-table-column prop="createTime" label="生成日期" width="150">
      </el-table-column>
      <el-table-column prop="desc" label="描述" min-width="200" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSize"
      @current-change="handleCurrent">
    </el-pagination>
    <Slide :modal="true" :title="'申请'" :footer="false" ref="slide" position="right" >
      <Apply ref="applyForm" @submit="handerApply" :loading="isLoading"></Apply>
    </Slide>

    <Slide :modal="true" :title="'查看'" :footer="false" ref="viewslide" position="right" >
      <Apply :readonly="true" :data="taskData" :isapply="true" :loading="isLoading"></Apply>
    </Slide>

    <Slide :modal="true" :title="'延期'" :footer="false" ref="delayslide" position="right" >
      <Apply :readonly="true" :data="taskData" :isapply="false" @submit="handerDelay" :loading="isLoading"></Apply>
    </Slide>

    <Slide :modal="true" :title="'审批'" :footer="false" ref="editslide" position="right" >
      <Approve ref="approveForm" :data="approveData" @submit="handleApprove" :loading="isLoading"></Approve>
    </Slide>
    <el-cmenu ref="menu" :data="menus" @click="menuClick"></el-cmenu>
  </div>
</template>
<script>
  import Slide from '@/components/Slide'
  import elCmenu from '@/components/el-cmenu'
  import Apply from '@/components/Apply'
  import Approve from '@/components/Approve'

  export default {
    data() {
      return {
        tableData: [],
        approveShow: false,
        downShow: false,
        delShow: false,
        delayShow: false,
        page: 1,
        pageSize: 10,
        searchText: '',
        total: 0,
        currentPage: 1,
        taskData: {},
        approveData: {},
        selectedRow: {},
        isLoading: false
      }
    },
    computed: {
      menus(){
        return [
          {label:'查看',cls:'opt-view',code:'view'},
          {label:'审批',cls:'opt-edit',code:'edit',show: this.approveShow},
          {label:'下载',cls:'opt-download',code:'download',show: this.downShow},
          {label:'删除',cls:'opt-delete',code:'delete',show: this.delShow},
          {label:'延期',cls:'opt-delay',code:'delay',show: this.delayShow}
        ];
      },
      queryChange(){
        return this.page+this.pageSize;
      }
    },
    watch: {
      queryChange(){
        this.reloadTask();
      }
    },
    components:{
      Slide,Apply,'el-cmenu':elCmenu,Approve
    },
    methods:{
      indexMethod(index){
        return index + (this.page-1)*this.pageSize + 1;
      },
      async reloadTask(){
        let param = {page: this.page,size: this.pageSize,searchText: this.searchText};
        let res = await this.$http.getTaskList(param);
        if(res.data) {
          this.tableData = res.data.pageInfo.items;
          this.total = res.data.pageInfo.totalCount;
          this.currentPage = res.data.pageInfo.currentPage;
        }
      },
      handleCurrent(val){
        this.page = val;
        this.currentPage = val;
      },
      handleSize(val){
       this.pageSize = val;
      },
      showSlide(){
        this.$refs.slide.showSlide();
        this.$refs.applyForm.reset();
      },
      optClick(row,ev){
        var codes = {
              0: 'approving',
              1: 'approved',
              2: 'rejected'
            };
        this.selectedRow = row;
        var status = codes[row.status];
        if(status == 'approving') {
          this.approveShow = true;
          this.downShow = false;
          this.delShow = true;
          this.delayShow = false;
        }else if(status == 'approved'){
          this.approveShow = false;
          this.downShow = true;
          this.delShow = true;
          this.delayShow = true;
        }else if(status == 'rejected'){
          this.approveShow = false;
          this.downShow = false;
          this.delShow = true;
          this.delayShow = false;
        }else{
          this.approveShow = false;
          this.downShow = false;
          this.delShow = false;
          this.delayShow = false;
        }
        this.$refs.menu.show(event);
      },
      menuClick(row,ev){
        var codes = {
              view: this.viewInfo,
              edit: this.approve,
              delay: this.delay,
              delete: this.comfirmRemove,
              download: this.download
            };
        this.isLoading = false;
        if(codes[row.code]) codes[row.code]();
      },
      async viewInfo(){
        let row = this.selectedRow,
            param = {code: row.code};
        let res = await this.$http.getTaskInfo(param);
        if(res && res.data && res.data.success) {
          this.taskData = Object.assign({eNbFeatures: [],cpeFeatures: [],tools:[]},res.data.taskInfo);
          this.$refs.viewslide.showSlide();
        }else{
          this.$message.error('获取数据异常');
        }
      },
      async approve(){
        this.$refs.approveForm.reset();

        let row = this.selectedRow,
            param = {code: row.code};
        let res = await this.$http.getTaskInfo(param);
        if(res && res.data && res.data.success) {
          this.approveData = Object.assign({eNbFeatures: [],cpeFeatures: [],tools:[]},res.data.taskInfo);
          this.$refs.editslide.showSlide();
        }else{
          this.$message.error('获取数据异常');
        }
      },
      async delay(){
        let row = this.selectedRow,
            param = {code: row.code};
        let res = await this.$http.getTaskInfo(param);
        if(res && res.data && res.data.success) {
          this.taskData = Object.assign({eNbFeatures: [],cpeFeatures: [],tools:[]},res.data.taskInfo);
          this.$refs.delayslide.showSlide();
        }else{
          this.$message.error('获取数据异常');
        }
      },
      comfirmRemove(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
        }).then(() => {
          this.removeLicense();
        })
      },
      async removeLicense(){
        let row = this.selectedRow,
            param = {code: row.code};
        let res = await this.$http.deleteLicense(param);
        if(res && res.data && res.data.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.reloadTask();
        }else{
            this.$message.error('删除异常');
        }
      },
      async download(){
        let row = this.selectedRow,
            param = {taskId: row.taskId, code: row.code};
        //let res = await this.$http.downloadLicense(param);
        var url = '/licensemanage/manager/download?code=' + row.code;
        this.downByUrl(url);
      },
      downloadFile(content, filename) {
        filename = filename || 'omc.lic';
        const blob = new Blob([content]);
        if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
          navigator.msSaveBlob(blob, filename);
        } else {                                 //  chrome/firefox
          let aTag = document.createElement('a');
          aTag.download = filename;
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          URL.revokeObjectURL(aTag.href);
        }
      },
      downByUrl(url,filename) {
          var vm = this;
          filename = filename || 'omc.lic';
          var req = new XMLHttpRequest();
          req.open("GET", url, true);
          //监听进度事件
          req.addEventListener("progress", function (evt) {
              if (evt.lengthComputable) {
                  var percentComplete = evt.loaded / evt.total;
                  console.log(percentComplete);
              }
          }, false);
          //下载完成
          req.addEventListener("load", function (evt) {
            vm.$message({
              message: '下载成功',
              type: 'success'
            });
          }, false);

          req.responseType = "blob";
          req.onreadystatechange = function () {
              if (req.readyState === 4 && req.status === 200) {
                  if (typeof window.chrome !== 'undefined') {
                      // Chrome version
                      var link = document.createElement('a');
                      link.href = window.URL.createObjectURL(req.response);
                      link.download = filename;
                      link.click();
                  } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                      // IE version
                      var blob = new Blob([req.response], { type: 'application/force-download' });
                      window.navigator.msSaveBlob(blob, filename);
                  } else {
                      // Firefox version
                      var file = new File([req.response], filename, { type: 'application/force-download' });
                      window.open(URL.createObjectURL(file));
                  }
              }else{
                vm.$message.error('下载异常');
              }
          };
          req.send();
      },
      handerClose(){
        this.$refs.menu.hide();
      },
      async handerApply(form){
        let param = Object.assign({},form);
        if(!param.cpeStatus) {
          param.cpeNum = '';
          param.cpeFeatures = [];
        }
        if(!param.epcStatus) {
          param.epcNum = '';
        }
        if(!param.egwStatus) {
          param.egwNum = '';
        }
        if(!param.upsStatus) {
          param.upsNum = '';
        }
        var hasAlarm = false, hasPm = false;
        ['alarmView','alarmMonitor','alarmConfirm','alarmClear','alarmRestore','alarmDelete','alarmFilterAndConfirm','alarmLibrary','alarmNotification'].map(function(item){
          if(form.eNbFeatures.includes(item)) hasAlarm = true;
        });

        ['performanceKpiQuery','performanceTemplateManagement','performanceMeasureManagement','performanceCustomizeKpi'].map(function(item){
          if(form.eNbFeatures.includes(item)) hasPm = true;
        });

        if(hasAlarm) form.eNbFeatures.push('alarm');
        if(hasPm) form.eNbFeatures.push('performance');

        this.isLoading = true;
        let res = await this.$http.applyLicense(param);
        this.isLoading = false;
        if(res && res.data && res.data.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$refs.slide.hide();
          this.reloadTask();
        }else{
          this.$message.error('保存失败');
        }
      },
      async handerDelay(form){
        let param = {
              code: form.code,
              endDate: form.endDate
            };
        this.isLoading = true;
        let res = await this.$http.delayLicense(param);
        this.isLoading = false;
        if(res && res.data && res.data.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$refs.delayslide.hide();
          this.reloadTask();
        }else{
          this.$message.error('保存失败');
        }
      },
      async handleApprove(form){
        let param = {
              code: form.code,
              resultDesc: form.resultDesc,
              isPass: form.isPass
            };
        this.isLoading = true;
        let res = await this.$http.approvalLicense(param);
        this.isLoading = false;
        if(res && res.data && res.data.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$refs.editslide.hide();
          this.reloadTask();
        }else{
          this.$message.error('保存失败');
        }
      }
    },
    mounted(){
     this.reloadTask()
    }
  };
</script>
<style>
.grid-query input {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-radius: 0px;
}
.operator{
  cursor: pointer;
  width: 100%;
  height: 20px;
}
</style>
