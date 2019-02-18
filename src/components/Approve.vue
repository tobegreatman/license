<template>
  <div class="flex-ctn" style="height: 100%">
    <el-form ref="addForm" :model="addForm" :rules="formRules" class="flex-form flex-item" size="small" label-width="110px" style="padding-right: 50px;">
      <el-form-item label="申请人：" prop="applicant">
        <el-input v-model="addForm.applicant" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="申请时间：" >
        <el-input v-model="addForm.applyDate" readonly></el-input>
        <i v-if="!showMore" class="el-icon-arrow-down" style="position: absolute; right: -45px; top: 10px;color: blue;cursor: pointer;" @click="showMore = true">展开</i>
      </el-form-item>

      <transition :name="'el-zoom-in-top'">
        <div class="flex-form" v-show="showMore" style="padding-right: 0px;">
          <el-form-item label="License名称：" prop="license">
            <el-input v-model="addForm.license" :readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="License编码：" prop="code">
            <el-input v-model="addForm.code" :readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="用途：">
            <el-select v-model="addForm.usages" placeholder="请选择类型" :disabled="readonly">
              <el-option label="商用" value="1"></el-option>
              <el-option label="测试" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="PO：" prop="po">
            <el-input v-model="addForm.po" readonly></el-input>
          </el-form-item>
          <el-form-item label="MAC 地址：" >
            <el-input v-model="addForm.mac" :readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="截止日期：" prop="endDate">
            <el-date-picker :picker-options="pickerOpts"
              v-model="addForm.endDate"
              type="date"
              placeholder="选择日期" :readonly="readonly">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="描述：" style="flex: 1 1 100%;" prop="desc">
            <el-input type="textarea" v-model="addForm.desc" :readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="" v-show="false"></el-form-item>

          <el-form-item label="产品类型：">
            <el-radio-group  v-model="addForm.productType" :readonly="readonly">
              <el-radio label="local" :disabled="readonly">Local版</el-radio>
              <el-radio label="cloud" :disabled="readonly">Cloud版</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label=""></el-form-item>
          <el-form-item label="界面类型：" prop="theme">
            <el-select v-model="addForm.theme" placeholder="请选择类型" :disabled="readonly">
              <el-option label="Baicells" value="baicells"></el-option>
              <el-option label="日海" value="RH"></el-option>
              <el-option label="无Logo" value="nologo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=""></el-form-item>

          <el-form-item label="设备：" style="flex: 1 1 100%;">
            <fieldset class='fieldset'>
              <legend>eNB <el-checkbox  :disabled="readonly" v-model="addForm.eNbStatus"></el-checkbox></legend>

              <el-form-item label="数量：" prop="eNbNum">
                <el-input type="number" style="width:120px" v-model="addForm.eNbNum" :readonly="readonly"></el-input>
              </el-form-item>

              <el-form-item label="网络场景：" prop="eNbModal" style="flex: 1 1 100%;">
                <el-radio-group  v-model="addForm.eNbModal">
                  <el-radio label="" :disabled="readonly">标准模式（集中EPC）</el-radio>
                  <el-radio label="halob" :disabled="readonly">HaloB模式</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="特性支持：" prop="eNbFeatures" style="flex: 1 1 100%;">
                <el-select v-model="addForm.eNbFeatures" multiple placeholder="请选择" :disabled="readonly" style="width: 80%">
                  <el-option
                    v-for="item in enbOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </fieldset>

            <fieldset class='fieldset'>
              <legend>CPE <el-checkbox v-model="addForm.cpeStatus" :disabled="readonly"></el-checkbox></legend>

              <el-form-item label="数量：" prop="cpeNum">
                <el-input type="number" v-model="addForm.cpeNum" style="width:120px" :readonly="readonly"></el-input>
              </el-form-item>

              <el-form-item label="特性支持：" prop="cpeFeatures" style="flex: 1 1 100%;">
                <el-select v-model="addForm.cpeFeatures" multiple placeholder="请选择" :disabled="readonly" style="width: 80%">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </fieldset>

            <fieldset class='fieldset'>
              <legend>EPC <el-checkbox v-model="addForm.epcStatus" :disabled="readonly"></el-checkbox></legend>

              <el-form-item label="数量：" prop="epcNum">
                <el-input type="number" v-model="addForm.epcNum" style="width:120px" :readonly="readonly"></el-input>
              </el-form-item>
            </fieldset>

            <fieldset class='fieldset'>
              <legend>eGW <el-checkbox v-model="addForm.egwStatus" :disabled="readonly"></el-checkbox></legend>

              <el-form-item label="数量：" prop="egwNum">
                <el-input type="number" v-model="addForm.egwNum" style="width:120px" :readonly="readonly"></el-input>
              </el-form-item>
            </fieldset>

            <fieldset class='fieldset'>
              <legend>UPS <el-checkbox v-model="addForm.upsStatus" :disabled="readonly"></el-checkbox></legend>

              <el-form-item label="数量：" prop="upsNum">
                <el-input type="number" v-model="addForm.upsNum" style="width:120px" :readonly="readonly"></el-input>
              </el-form-item>
            </fieldset>
          </el-form-item>
          <el-form-item v-show="false"></el-form-item>

          <el-form-item label="工具：">
            <el-checkbox-group v-model="addForm.tools">
              <el-checkbox label="NTPServer" :disabled="readonly">NTP Server</el-checkbox>
              <el-checkbox label="NInfType" :disabled="readonly">北向接口</el-checkbox>
              <el-checkbox label="DHCPServer" :disabled="readonly">DHCP Server</el-checkbox>
            </el-checkbox-group>
            <i v-if="showMore" class="el-icon-arrow-up" style="position: absolute; right: -45px; top: 10px;color: blue;cursor: pointer;" @click="showMore = false">收起</i>
          </el-form-item>

        </div>
      </transition>

      <el-form-item label="审批意见：" style="flex: 1 1 100%;margin-left: 0px;" prop="resultDesc">
        <el-input type="textarea" v-model="addForm.resultDesc"></el-input>
      </el-form-item>

      <el-form-item label="审批：" prop="isPass">
        <el-radio-group  v-model="addForm.isPass">
          <el-radio label="1">通过</el-radio>
          <el-radio label="2">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="padding: 10px 20px;">
      <el-button type="primary" size="mini" @click="handerSubmit">确定</el-button>
      <el-button size="mini" @click="handerclose">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function(){
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data(){
    var options = [
        {label: '监控',value: 'cpeMonitor'},
        {label: '同步',value: 'cpeSynchronize'},
        {label: '设备注册',value: 'cpeRegister'},
        {label: '快速配置',value: 'cpeQuickConfiguration'},
        {label: '重启',value: 'cpeReboot'},
        {label: 'PCI锁频',value: 'cpePciLock'},
        {label: 'ODU软件版本升级',value: 'cpeOduSoftwareUpdrade'},
        {label: 'IDU软件版本升级',value: 'cpeIduSoftwareUpdrade'},
        {label: '追踪',value: 'cpeTrace'},
        {label: '产品类型',value: 'cpeProductType'}
      ],
      enbOpts = [
        {label: '监控', value:'eNbMonitor'},
        {label: '同步', value:'eNbSynchronize'},
        {label: '设备注册', value:'eNbRegister'},
        {label: '配置', value:'eNbConfiguration'},
        {label: '快速配置', value:'eNbQuickConfiguration'},
        {label: '软件版本升级', value:'eNbSoftwareUpdrade'},
        {label: '软件版本回退', value:'eNbSoftwareRoolback'},
        {label: 'UBOOT升级', value:'eNbUbootUpdrade'},
        {label: 'PATCH升级', value:'eNbPatchUpdrade'},
        {label: '重启', value:'eNbReboot'},
        {label: '密码重置', value:'eNbResetPassword'},
        {label: '日志收集', value:'eNbLogs'},
        {label: '激活', value:'eNbActive'},
        {label: '关联的CPEs', value:'eNbCpes'},
        {label: '软件版本自升级', value:'eNbAutoSoftwareUpgrade'},
        {label: 'UBOOT版本自升级', value:'eNbAutoUbootUpgrade'},
        {label: '频点', value:'eNbFrequencyPci'},
        {label: '信令跟踪', value:'eNbRrcSignalingTrace'},
        {label: '基站IMSI信息清除', value:'eNbClearImsi'},
        {label: 'License管理', value:'eNbLicense'},
        {label: '追踪策略', value:'eNbTrace'},
        {label: '周期上报日志', value:'eNbPeriodReportLog'},
        {label: 'MML脚本', value:'eNbMmlScript'},
        {label: 'APN', value:'qbHalobAPN'},
        {label: '接入控制', value:'eNbNewAccessControl'},
        {label: '自配置', value:'eNbNewSelfConfiguration'},
        {label: '配置恢复', value:'eNbResetConfig'},
        {label: '备份与恢复', value:'backupAndRestore'},
        {label: 'MR任务', value:'performanceMRTast'},
        {label: 'MR文件', value:'performanceMRFile'},
        {label: '无感知重启', value:'StrategySilentReboot'},
        {label: 'SAS业务', value:'eNbSas'},

        {label: '告警视图', value:'alarmView'},
        {label: '告警监控', value:'alarmMonitor'},
        {label: '告警确认', value:'alarmConfirm'},
        {label: '告警清除', value:'alarmClear'},
        {label: '告警恢复', value:'alarmRestore'},
        {label: '告警删除', value:'alarmDelete'},
        {label: '基本设置', value:'alarmFilterAndConfirm'},
        {label: '告警库', value:'alarmLibrary'},
        {label: '告警通知', value:'alarmNotification'},

        {label: '性能查询', value:'performanceKpiQuery'},
        {label: '模板管理', value:'performanceTemplateManagement'},
        {label: '测量管理', value:'performanceMeasureManagement'},
        {label: '自定义指标', value:'performanceCustomizeKpi'}
      ];
    return {
      addForm: {
        applicant: '',
        applyDate: '',
        license: '',
        code: '',
        usages: '',
        po: '',
        endDate: '',
        desc: '',
        productType: '',
        theme: '',
        eNbStatus: true,
        eNbNum: 1000,
        eNbModal:'',
        eNbFeatures: [],
        cpeStatus: true,
        cpeNum: 10000,
        cpeFeatures: [],
        epcStatus: true,
        epcNum: 10000,
        egwStatus: true,
        egwNum: 100,
        upsStatus: true,
        upsNum: 100,
        tools: [],
        resultDesc: '',
        isPass: ''
      },
      formRules: {
        resultDesc: [
          { required: true, message: '请填写审批意见', trigger: 'blur' },
          { max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ],
        isPass: [
          { required: true, message: '请选择通过与否', trigger: 'change' }
        ]
      },
      enbOpts: enbOpts,
      options: options,
      pickerOpts: {
        disabledDate: this.dateRange
      },
      showMore: false
    }
  },
  watch:{
    data(newV,oldV) {
        if(newV) Object.assign(this.addForm,newV);
    }
  },
  methods:{
    handerclose(){
      this.$parent.$parent.hide();
    },
    reset(){
      this.$refs.addForm.resetFields();
    },
    handerSubmit(){
      var vm = this;
      vm.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$emit('submit',this.addForm);
        }
      });
    }
  }
}

</script>
