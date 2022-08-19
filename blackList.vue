<template>
  <div class="blackCar">
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
      <div class="action-out">
        <el-button
          class="self-button--minor-2"
          type="primary"
          @click="doAdd"
          v-atb="{
            $route: $route,
            type: window.applyApp === 'erp' ? 'hide' : 'show',
            name: 'add'
          }">
          <i class="icon-billtubiao-xinzeng iconfont" />
          新增
        </el-button>
      </div>
      <cys-table ref="cys-ref-table" :options="table.options" :striped="true" :col-empty-text="'-'">
        <div
          slot="remark"
          slot-scope="scope"
        >
          <el-popover
            v-if="scope.row.remark && scope.row.remark.length > 10"
            placement="top"
            width="200"
            :open-delay="500"
            trigger="hover"
            :content="scope.row.remark"
          >
            <span slot="reference">
              <div class="ellipsis-1">
                {{ scope.row.remark }}
              </div>
            </span>
          </el-popover>
          <template v-else>
            {{ scope.row.remark || '-' }}
          </template>
        </div>
        <empty slot="empty" />
        <div slot="action" slot-scope="scope" class="table-action-td">
          <!-- <a
            class="text-btn-edite tr-action"
            @click="doEdite(scope.row)"
          >编辑</a> -->
          <a
            class="text-btn-delete tr-action"
            @click="doDel(scope.row)"
            v-atb="{
              $route: $route,
              type: window.applyApp === 'erp' ? 'hide' : 'show',
              name: 'del'
            }"
          >移出黑名单</a>
        </div>
      </cys-table>
    </div>

    <self-dialog
      :title="`${editeTitle}黑名单`"
      width="800px"
      :show-close="false"
      :visible.sync="isShowEditeDialog"
      :loading.sync="editeLoading"
      @confirm="doOK"
      @closeDialog="cancel"
    >
      <el-form
        ref="editeForm"
        :model="editeFormData"
        label-width="120px"
        :inline="false"
        :rules="rules"
      >
        <div class="form-line">
          <el-form-item label="车牌号码：" prop="carNo" class="carNo-whith-province">
            <el-input v-model="editeFormData.carNo" placeholder="请输入车牌号" class="input-with-select chose-province-out">
              <div
                id="carProvince"
                slot="prepend"
                v-clickoutside="handleClose"
                class="chose-province"
                @click="handleChange"
              >
                <i>{{ carProvince }}</i>
                <span slot="prepend" class="el-icon-arrow-down" :class="{'is-reverse': carProvinceShow}" />
              </div>
            </el-input>
          </el-form-item>
        </div>
        <div class="form-line">
          <el-form-item label="车主姓名：" prop="carOwnerName">
            <el-input v-model="editeFormData.carOwnerName" placeholder="请输入车主姓名" />
          </el-form-item>
          <el-form-item label="车主电话：" prop="carOwnerPhone">
            <el-input v-model="editeFormData.carOwnerPhone" placeholder="请输入车主电话" />
          </el-form-item>
        </div>
        <el-form-item label="原因：" prop="remark">
          <el-input
            v-model="editeFormData.remark"
            rows="4"
            type="textarea"
            maxlength="100"
            show-word-limit
            placeholder="请输入原因"
          />
        </el-form-item>
      </el-form>
    </self-dialog>

    <carProvinceDialog
      ref="carProvinceChose"
      v-model="carProvince"
      sticky-el-id="carProvince"
      :show.sync="carProvinceShow"
    />
  </div>
</template>
<script>
import {
  carBlackListDelete,
  carBlackListAdd,
  carBlackListPageList
} from './api/blackList'
import { pick } from 'lodash'
import carProvinceDialog from './components/carProvinceDialog'
import clickoutside from './utils/clickoutside'
import mixin from "./mixin/index"
export default {
  name: 'BlackCar',
  mixins: [mixin],
  components: {
    carProvinceDialog
  },
  directives: {
    clickoutside
  },
  data() {
    return {
      window: window,
      carProvinceShow: false,
      carProvince: '闽',
      editeLoading: false,
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
            placeholder: '车牌号',
            clearable: true
          }
        ]
      },
      isAdd: true,
      isShowEditeDialog: false,
      editeFormData: {
        carNo: '',
        carOwnerName: '',
        carOwnerPhone: '',
        remark: ''
      },
      rules: {
        carNo: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^[A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
            message: '车牌格式不合法！',
            trigger: 'blur'
          }
        ],
        carOwnerPhone: [
          { required: false, message: '必填', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号不合法', trigger: 'blur' }
        ],
        carOwnerName: [{ required: false, message: '必填', trigger: 'blur' }],
        remark: [{ required: false, message: '必填', trigger: 'blur' }]
      },
      table: {
        options: {
          isPagination: true,
          isLoading: false,
          isIndex: true,
          indexWidth: '60px',
          thead: {
            column: [
              {
                label: '车牌号码',
                prop: 'carNo'
              },
              {
                label: '车主姓名',
                prop: 'carOwnerName'
              },
              {
                label: '车主电话',
                prop: 'carOwnerPhone'
              },
              {
                label: '原因',
                prop: 'remark',
                slotName: 'remark'
              },
              {
                label: '操作',
                prop: 'action',
                slotName: 'action',
                fixed: 'right',
                style: {
                  width: '200px'
                }
              }
            ]
          },
          method: {
            interface: carBlackListPageList, // 调用表格数据接口方法
            parmas: {} // 参
          }
        }
      }
    }
  },
  computed: {
    editeTitle() {
      return this.isAdd ? '新增' : '编辑'
    }
  },
  created() {
  },
  methods: {
    doEdite(data) {
      this.editeLoading = false
      this.editeFormData = pick(data, [
        'carNo',
        'carOwnerName',
        'carOwnerPhone',
        'carTypeId',
        'endTime',
        'monthlyRendCarId',
        'monthlyRendCharge',
        'parkingCode',
        'payTheAmount',
        'remark',
        'roomNo',
        'startTime'
      ])
      this.isAdd = false
      this.isShowEditeDialog = true
    },
    cancel() {
      // this.showConfirm().then(() => {
      this.$refs.editeForm.resetFields()
      this.isShowEditeDialog = false
      // })
    },
    async delRequest(data) {
      const res = await carBlackListDelete({
        recordId: data.recordId,
        carNo: data.carNo
      })
      if (res.errorCode === '0') {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$refs['cys-ref-table'].getTableData()
        return Promise.resolve()
      }
      return Promise.reject(res)
    },
    doDel(data) {
      this.showConfirm({
        promiseCallBack: this.delRequest,
        promiseCallBackParams: data,
        title: '删除黑名单',
        confirmText: '确定从黑名单中移除吗？'
      })
    },
    doAdd() {
      this.isShowEditeDialog = true
      this.isAdd = true
    },
    doOK() {
      this.$refs.editeForm.validate(async(status) => {
        console.log(status)
        if (status) {
          const carNo = this.carProvince + this.editeFormData.carNo
          const parmas = Object.assign({}, this.editeFormData, { carNo })
          var res = {}
          if (this.isAdd) {
            res = await carBlackListAdd(parmas)
          }
          if (res.errorCode === '0') {
            this.$message.success(`${this.editeTitle}成功`)
            this.$refs.editeForm.resetFields()
            this.isShowEditeDialog = false
            this.$refs['cys-ref-table'].getTableData()
          }
        }
      })
    },
    handleChange() {
      if (this.carProvinceShow) {
        this.carProvinceShow = false
        return false
      }
      this.carProvinceShow = true
    },
    handleClose() {
      setTimeout(() => {
        this.carProvinceShow = false
      }, 16)
    }
  }
}
</script>
<style lang="scss">
.blackCar {

}
</style>
