<template>
  <div class="inParkCar">
    <div class="search-header">
      <!-- <div class="title-out">
        <div class="title">数据筛选</div>
      </div> -->
      <cys-form-search
        ref="form"
        :data="form.data"
        :btns="form.btns"
        :direction="'vertical'"
        :props="{ showRest: true }"
      />
    </div>
    <div class="table-wraper-radius">
      <p class="msf">在场车<span>{{ statisticInfo.total || 0 }}</span>辆，其中月租车<span>{{ statisticInfo.monthCarNum || 0 }}</span>辆，免费车<span>{{ statisticInfo.freeCarNum || 0 }}</span>辆，临时车<span>{{ statisticInfo.tempCarNum || 0 }}</span>辆，专项车<span>{{ statisticInfo.specialCarNum || 0 }}</span>辆</p>
      <div class="action-out">
        <el-button class="self-button--minor-2" type="primary" @click="batchOut()">
          <i class="iconfont icon-billtubiao-piliangchuchang1" />
          批量出场
        </el-button>
        <el-button @click="importCar">
          <i class="iconfont icon-billtubiao-daoru" />
          导入
        </el-button>
        <el-button @click="exportInParkExcle">
          <i class="iconfont icon-billtubiao-daochu" />
          导出
        </el-button>
      </div>
      <cys-table
        ref="cys-ref-table"
        :options="table.options"
        :striped="true"
        @selection-change="selectionChange"
      >
        <empty slot="empty" />
        <div slot="action" slot-scope="scope" class="table-action-td">
          <a
            class="text-btn-edite tr-action"
            @click="seeDetail(scope.row)"
          >详情</a>
          <!-- <a
            class="text-btn-edite tr-action"
            @click="seeDetail(scope.row)"
          >查看照片</a> -->
          <!-- <a
            class="text-btn-edite tr-action"
            @click="exceptionOut(scope.row)"
          >手动异常出场</a> -->
        </div>
      </cys-table>
    </div>

    <self-dialog
      title="车辆入场信息"
      width="488px"
      button-confirm-text="手动出场"
      :visible.sync="isShowBigPic"
      @confirm="batchOut(detail)"
      @closeDialog="isShowBigPic = false"
    >
      <div class="see-pic-out">
        <div class="car-num-out">
          <div class="come-info" style="flex: 1;">
            <div class="time-info">
              <span class="car-num">{{ detail.carNo }}</span>
              <em class="tag-info">{{ detail.carTypeName }}</em>
            </div>
            <div class="come-adress">停车时长：{{ detail.inParkDurationTime }}</div>
          </div>

        </div>
        <div class="come-info">
          <div class="time-info">入场时间：{{ detail.inTime }}</div>
          <div class="come-adress">入场地点：{{ detail.inChannelName }}</div>
        </div>
        <div class="big-pic">
          <el-image
            style="width: 100%"
            :src="imageUrlPrefix + detail.inImageUrl"
            :preview-src-list="[imageUrlPrefix + detail.inImageUrl]"
          >
            <div slot="error" class="image-slot">
              <img src="./img/img-error.png">
            </div>
          </el-image>
        </div>
      </div>
    </self-dialog>

    <self-dialog
      title="出场提示"
      width="530px"
      :visible.sync="outVisible"
      @confirm="batchManualExceptionCarOut"
      @closeDialog="outVisible = false"
    >
      <div class="out-car">
        <span v-for="(item, index) in carNos" :key="index" class="out-car-item">
          {{ item }}
        </span>
      </div>
      <div class="other-info">
        <i class="el-icon-warning-outline" />
        <div style="padding: 20px 0 7px;">这 <span>{{ carNos.length }}</span> 辆车确定手动出场吗？</div>
        <span style="font-size: 16px;">请仔细审核!</span>
      </div>
    </self-dialog>

    <importCar
      ref="importCar"
      v-model="isShowImportDialog"
      :import-request-back-info="importRequestBackInfo"
      :import-template-json="importTemplateJson"
      :export-template-json="exportTemplateJson"
      :export-template-by-url="exportTemplateByUrl"
      :export-template-data="exportTemplateData"
      @dialogChange="carDialogChange"
      @startUpload="startUpload"
    >
      <template slot="extral">
        <el-form
          ref="importForm"
          :model="importFormData"
          :rules="importFormRules"
          label-width="88px"
          class="importForm"
        >
          <!-- <el-form-item label="车辆类型：" prop="carTypeId">
            <el-select
              v-model="importFormData.carTypeId"
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in carTypeRuleOption"
                :key="item.ruleId"
                :label="item.carTypeName"
                :value="item.ruleId"
              />
            </el-select>
          </el-form-item>  -->
          <el-form-item style="width:100%;" label="停放区域：" prop="areaId">
            <el-select
              v-model="importFormData.areaId"
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in areaListOption"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item style="width:100%;" label="入场通道：" prop="inChannelId">
            <el-select
              v-model="importFormData.inChannelId"
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in channelListOption"
                :key="item.channelId"
                :label="item.channelName"
                :value="item.channelId"
              />
            </el-select>
          </el-form-item> -->
        </el-form>
      </template>
    </importCar>
  </div>
</template>
<script>
import { getImageUrlPrefix } from './api/system'
import importCar from './components/importCar'
import { carType } from './api/carType'
import { getFormatDate_XLSX } from './utils/dateFormat'
import {
  inParkCarPageList,
  inParkCarList,
  manualExceptionCarOut,
  getChannelList,
  inParkCarImport,
  batchManualExceptionCarOut,
  getInParkCarstatisticInfo
} from './api/inParkCar'
import { getFreeAreaList } from './api/setarea'
import dayjs from 'dayjs'
import mixin from "./mixin/index"
export default {
  name: 'InParkCar',
  mixins: [mixin],
  components: { importCar },
  props:{
    // npm封装参数
    packParams: {
      type: Object,
      default: {}
    }
  },  
  data() {
    return {
      imageUrlPrefix: "",
      importTemplateJson: [
        { field: 'carNo', title: '车牌号' },
        { field: 'inTime', title: '入场时间' },
        { field: 'remark', title: '备注' }
      ],
      exportTemplateByUrl: process.env.NODE_ENV === 'development' ? 'http://iot-page1.api1.cheweiguanjia.com/xlsl/在场车.xlsx' : 'http://siot.tingcheqianbao.com/xlsl/在场车.xlsx',
      exportTemplateJson: [
        { field: 'carNo', title: '车牌号', width: 20 },
        { field: 'inTime', title: '入场时间', width: 20 },
        { field: 'remark', title: '备注', width: 40 }
      ],
      exportTemplateData: [
        {
          carNo: '京A12345',
          inTime: '2010-01-01 12:00:00',
          remark: '此为导入模板范例'
        }
      ],
      carTypeRuleOption: [],
      channelListOption: [],
      areaListOption: [],
      importRequestBackInfo: {
        successNum: 0,
        importFixedCarFailVOs: [],
        failNum: 0
      },
      importFormData: {
        carTypeId: '',
        areaId: '',
        inChannelId: ''
      },
      importFormRules: {
        // carTypeId: [{ required: true, message: '必填', trigger: 'blur' }],
        // areaId: [{ required: true, message: '必填', trigger: 'blur' }],
        inChannelId: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      curentDetail: {},
      isShowImportDialog: false,
      selectionArr: [],
      detail: {},
      form: {
        btns: [
          {
            label: '查询',
            action: 'search'
          }
        ],
        data: [
          {
            type: 'input',
            label: '车牌号',
            field: 'carNo',
            value: '',
            placeholder: '车牌号码',
            clearable: true
          },
          {
            type: 'select',
            label: '车辆类型',
            field: 'carTypeId',
            value: '',
            // interface: carType,
            placeholder: '车辆类型',
            options: [],
            filterable: true,
            optionLabel: 'carTypeName',
            optionValue: 'ruleId',
            clearable: true,
            interface: carType
          },
          {
            type: 'datetimerange',
            label: '入场时间',
            field: 'date',
            value: [],
            placeholder: '入场时间',
            clearable: true,
            arr2Obj: {
              inTimeStart: '',
              inTimeEnd: ''
            }
          }
        ]
      },
      isShowBigPic: false,
      table: {
        options: {
          isPagination: true,
          isLoading: false,
          isIndex: true,
          isSelection: true,
          indexWidth: '60px',
          thead: {
            column: [
              {
                label: '车牌号码',
                prop: 'carNo'
              },
              {
                label: '车辆类型',
                prop: 'carTypeName'
              },
              {
                label: '入场时间',
                prop: 'inTime'
              },
              {
                label: '入场地点',
                prop: 'inChannelName'
              },
              {
                label: '已停时长',
                prop: 'inParkDurationTime'
              },
              {
                label: '操作',
                prop: 'action',
                slotName: 'action',
                fixed: 'right',
                style: {
                  width: '250px'
                }
              }
            ]
          },
          method: {
            interface: inParkCarPageList, // 调用表格数据接口方法
            parmas: {} // 参
          }
        }
      },
      outVisible: false,
      carInIds: [],
      carNos: [],
      statisticInfo: {}
    }
  },
  created() {
    // 行云原来放在store中，现在为了封装npm包，直接在包中调用接口获取图片url地址
    getImageUrlPrefix().then(res => {
      if (res.errorCode === '0') {
        this.imageUrlPrefix = res.data || "";
      }
    })
    this.getInParkCarstatisticInfo()
  },
  methods: {
    async getInParkCarstatisticInfo() {
      const { errorCode, data } = await getInParkCarstatisticInfo({})
      if (errorCode === '0') {
        this.statisticInfo = data
      }
    },
    async carType() {
      const data = await carType({})
      if (data.errorCode === '0') {
        console.log(data)
        this.carTypeRuleOption = data.data
      }
    },
    async seeDetail(row) {
      this.detail = row
      this.isShowBigPic = true
    },
    async exportInParkExcle() {
      const cols = [
        {
          title: '车牌号',
          field: 'carNo',
          width: 15
        },
        {
          title: '车辆类型',
          field: 'carTypeName',
          width: 20
        },
        {
          title: '入场时间',
          field: 'inTime',
          width: 30
        },
        {
          title: '入场通道',
          field: 'inChannelName',
          width: 20
        },
        {
          title: '已停时长',
          field: 'inParkDurationTime',
          width: 20
        }
      ]
      const { errorCode, data } = await inParkCarList({})
      const { default: excelUtil } = await import(/* webpackChunkName: "excelUtil" */ './utils/excelUtil')
      if (errorCode === '0') {
        const nowTime = dayjs(new Date()).format('YYYY年MM月DD日HH时mm分ss秒')
        const bookName = `${nowTime}_${this.packParams.parkName}_在场车辆.xlsx`
        excelUtil.export(cols, data, { bookName })
      }
    },
    async manualExceptionCarOut() {
      const { carInId } = this.curentDetail
      const { errorCode } = await manualExceptionCarOut(carInId)
      if (errorCode === '0') {
        this.$message.success('放行成功')
        this.$refs['cys-ref-table'].getTableData()
      }
    },
    exceptionOut(row) {
      this.curentDetail = row
      this.showConfirm({
        customClass: 'normal-confirm',
        promiseCallBack: this.manualExceptionCarOut,
        confirmButtonClass: 'self-confirm-warn',
        promiseCallBackParams: {},
        defaultMsgboxEle: [
          this.$createElement('i', {
            class: {
              'el-icon-warning-outline': true
            }
          }),
          this.$createElement('p', {
            class: {
              'normal-text': true
            }
          }, [
            this.$createElement('span', null, '确定'),
            this.$createElement('em', { class: { confirmCarNo: true }}, `${row.carNo}`),
            this.$createElement('span', null, '进行手动出场吗？')
          ])
        ],
        title: '出场提示'
      })
    },
    startUpload(excleData) {
      const timeReg = /(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})/
      const carNumReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
      if (!excleData || excleData.length < 1) {
        return this.$message.warning('请选择文件')
      }
      for (let i = 0; i < excleData.length; i++) {
        const e = excleData[i]
        if (!carNumReg.test(e.carNo)) {
          this.importRequestBackInfo.importFixedCarFailVOs.push({
            carNo: e.carNo,
            failCause: `表格第${i + 1}车牌号格式错误`
          })
          return
        }
        if (!timeReg.test(e.inTime)) {
          if (typeof e.inTime === 'number') {
            e.inTime = getFormatDate_XLSX(e.inTime, 'YYYY-MM-DD HH:mm:ss')
            if (!timeReg.test(e.inTime)) {
              this.importRequestBackInfo.importFixedCarFailVOs.push({
                carNo: e.carNo,
                failCause: `表格第${i + 1}行入场时间格式错误！时间格式例： 2010/01/01 00:00:00`
              })
              return
            }
          } else {
            this.importRequestBackInfo.importFixedCarFailVOs.push({
              carNo: e.carNo,
              failCause: `表格第${i + 1}行入场时间格式错误！时间格式例： 2010/01/01 00:00:00`
            })
          }
        }
      }
      this.$refs.importForm.validate((status) => {
        if (status) {
          const params = Object.assign({}, this.importFormData, {
            data: excleData
          })
          inParkCarImport(params).then(res => {
            if (res.errorCode === '0') {
              this.importRequestBackInfo = res.data
              this.$refs['cys-ref-table'].getTableData()
            }
          })
        }
      })
    },
    async carDialogChange(val) {
      this.isShowImportDialog = val
      if (!val) {
        this.$refs.importCar.resetFields()
        this.importRequestBackInfo = {
          successNum: 0,
          importFixedCarFailVOs: [],
          failNum: 0
        }
      }
    },
    async importCar() {
      const { errorCode: channelErrorCode, data: channelData } = await getChannelList({})
      if (channelErrorCode === '0') {
        this.channelListOption = channelData
      }
      const { errorCode: areaErrorCode, data: areaData } = await getFreeAreaList({})
      if (areaErrorCode === '0') {
        this.areaListOption = areaData
      }
      this.carType()
      this.isShowImportDialog = true
    },
    batchOut(detail) {
      console.log('detadasd', detail)
      var selectionArr = this.selectionArr
      if (detail) {
        selectionArr = [detail]
      } else if (selectionArr.length < 1) {
        return this.$message.warning('请勾选表格数据')
      }
      this.carInIds = selectionArr.map(item => item.carInId)
      this.carNos = selectionArr.map(item => item.carNo)
      this.outVisible = true
      // this.showConfirm({
      //   customClass: 'normal-confirm',
      //   promiseCallBack: this.batchManualExceptionCarOut,
      //   confirmButtonClass: 'self-confirm-warn',
      //   promiseCallBackParams: carInIds,
      //   defaultMsgboxEle: [
      //     this.$createElement('i', {
      //       class: {
      //         'el-icon-warning-outline': true
      //       }
      //     }),
      //     this.$createElement('p', {
      //       class: {
      //         'normal-text': true
      //       }
      //     }, [
      //       this.$createElement('span', null, '确定批量为'),
      //       this.$createElement('em', { class: { confirmCarNo: true }}, `${carNos.join('、')}`),
      //       this.$createElement('span', null, `等${selectionArr.length}辆车进行手动出场吗？`)
      //     ])
      //   ],
      //   title: '出场提示'
      // })
    },
    async batchManualExceptionCarOut(data) {
      const { errorCode } = await batchManualExceptionCarOut(this.carInIds)
      if (errorCode === '0') {
        this.$message.success('手动出场成功')
        this.$refs['cys-ref-table'].getTableData()
        this.outVisible = false
      }
    },
    selectionChange(val) {
      this.selectionArr = val
      console.log('选中的', val)
    }
  }
}
</script>
<style lang="scss">
.out-car{
  margin: -20px -20px 0 -20px;
  background-color: #F6F8FA;
  padding: 26px 10px 16px 20px;
  overflow: hidden;
  font-size: 16px;
  .out-car-item{
    display: inline-block;
    padding: 10px 20px;
    margin: 0 10px 10px 0;
    background-color: #FFFFFF;
    box-shadow: 0px 2px 5px 0px rgba(66, 68, 70, 0.1);
    border-radius: 4px;
  }
}
.msf {
  margin: 15px 18px 0;
  span {
    color: #186FE8;
    margin: 0 5px;
  }
}
.other-info{
  padding: 29px 0 10px;
  text-align: center;
  font-size: 18px;
  span, i{
    color: #186FE8;
  }
  i{
    font-size: 36px;
  }
}

.inParkCar {
  .el-select {
    width: 100%;
  }
  .see-pic-out {
    .car-num-out {
      display: flex;
      align-items: center;
      margin-top: 5px;
      margin-bottom: 10px;
      .car-num {
        font-size: 18px;
        font-weight: bold;
        color: #000;
      }
      .tag-info {
        background: #186FE8;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        font-style: normal;
        padding: 3px 5px;
        margin-left: 5px;
      }
    }
    .come-info {
      font-size: 14px;
      color: #333;
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .big-pic {
      img {
        width: 100%;
        border-radius: 12px;
      }
      .el-image__error {
        min-height: 200px;
      }
    }
  }
  .importForm {
    display: flex;
    .el-form-item__label {
      padding-right: 0;
      &::before {
        margin-right: 0!important;
      }
    }
  }
}

.varable-confirm {
  width: 360px;
  .el-message-box__container {
    align-items: center;
  }
  .el-icon-warning-outline{
    position: static;
    color: #1879ea;
    font-weight: bold;
    transform: translateY(0%);
    top: 0;
    // font-size: 2em!important;
  }
}
</style>
