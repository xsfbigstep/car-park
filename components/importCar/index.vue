<template>
  <!-- 导入车辆 -->
  <self-dialog
    button-confirm-text="开始导入"
    :title="title"
    width="632px"
    :show-close="false"
    :visible.sync="show"
    class="import-dialog"
    v-bind="$attrs"
    @confirm="importOk"
    @closeDialog="importCancel"
    v-on="$listeners"
  >
    <div class="extps">请下载<span @click="downloadTemplate">导入模板</span>，填写完成后再上传导入</div>
    <div class="extral-out">
      <slot name="extral" />
    </div>
    <div class="chose-out">
      <div class="fileName-out">
        <span class="line-item">选择文件：</span>
        <el-input v-model="excelFileName" readonly>
          <template slot="append">
            <span @click="importExcle">选择文件</span>
          </template>
        </el-input>
      </div>
      <!-- <el-button
        class="self-button--minor-2"
        type="primary"
        @click="downloadTemplate"
      >下载模板</el-button> -->
    </div>
    <div class="list-wraper">
      <span>批量导入状态：</span>
      <div class="list-out">
        <div
          v-for="(item,index) in importRequestBackInfo.importFixedCarFailVOs"
          :key="index"
          class="list-item"
        >
          <span>表格第{{ index + 1 }}行 {{ item.carNo }} </span>
          <em :class="{'error-line': item.failCause !=='导入成功'}">{{ item.failCause }}</em>
        </div>
      </div>
    </div>
  </self-dialog>

</template>

<script>
export default {
  name: 'ImportCar',
  model: {
    prop: 'isShow',
    event: 'dialogChange'
  },
  props: {
    importName: {
      type: String,
      default: '导入模板.xlsx'
    },
    importTemplateJson: {
      type: Array,
      default: () => {
        return {}
      }
    },
    exportTemplateByUrl: {
      type: String,
      default: ''
    },
    exportTemplateJson: {
      default: () => {
        return {}
      },
      type: Array
    },
    title: {
      default: '导入车辆信息',
      type: String
    },
    isShow: {
      default: false,
      type: Boolean
    },
    importRequestBackInfo: {
      default: () => {
        return {
          successNum: 0,
          importFixedCarFailVOs: [],
          failNum: 0
        }
      },
      type: Object
    },
    exportTemplateData: {
      default: () => {
        return {}
      },
      type: Array
    }
  },
  data() {
    return {
      excleJson: [],
      excelFileName: '',
      show: this.isShow
    }
  },
  watch: {
    isShow() {
      this.show = this.isShow
    }
  },
  methods: {
    resetFields() {
      this.excleJson = []
      this.excelFileName = ''
    },
    importOk() {
      this.$emit('startUpload', this.excleJson)
    },
    importCancel() {
      this.$emit('dialogChange', false)
    },
    async downloadTemplate() {
      // 导入模板
      if (this.exportTemplateByUrl) {
        location.href = this.exportTemplateByUrl
      } else {
        const { default: excelUtil } = await import(/* webpackChunkName: "excelUtil" */ '../../utils/excelUtil')
        excelUtil.export(this.exportTemplateJson, this.exportTemplateData, { bookName: this.importName })
      }
    },
    async importExcle() {
      // 导入数据
      const { default: excelUtil } = await import(/* webpackChunkName: "excelUtil" */ '../../utils/excelUtil')
      try {
        const res = await excelUtil.import(this.importTemplateJson, { rowStart: 2 })
        console.log(res)
        this.excelFileName = res.fileName
        this.excleJson = res.newData
      } catch (e) {
        this.$message.warning('解析失败')
      }
    }
  }
}
</script>

<style lang="scss">
  .extps {
    height: 30px;
    line-height: 30px;
    background: #e9fcff;
    margin: -20px -20px 20px;
    padding: 0 20px;
    span {
      color: #6bbfce;
      cursor: pointer;
    }
  }
  .import-dialog {
    .chose-out {
      display: flex;
      justify-content: space-between;
      button {
        margin-left: 17px;
      }
      .el-input-group__append {
        width: 100px;
        cursor: pointer;
        height: 100%;
        span {
          display: block;
          width: 100%;
          height: 34px;
          line-height: 34px;
        }
        &:hover {
          background-color: #eef4fe;
          color: #186FE8;
        }
      }
      .line-item {
        flex: 0 0 88px;
        // width: 95px;
        // display: flex;
        &::before {
          content: '* ';
          color: #FF4C4C;
        }
      }
      .fileName-out {
        display: flex;
        flex: 1;
        align-items: center;
      }
    }
    .list-wraper {
      margin-top: 20px;
      .list-out {
        padding: 13px;
        margin-top: 7px;
        height: 140px;
        background: #FFFFFF;
        border: 1px solid #BDC4D3;
        border-radius: 6px;
        overflow: auto;
        .list-item {
          margin-bottom: 6px;
        }
        em {
          font-style: normal;
        }
        .error-line {
          color: #ec5f61;
        }
      }
    }
  }
</style>
