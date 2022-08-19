<template>
  <div class="fixedCar">
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
      <div class="ay">
        <div class="sia">
          <div
            class="as"
            :class="table.options.method.parmas.validStatus === '' ? 'on' : ''"
            @click="change('')"
          >
            全部({{ tatisticInfo.totalNum || 0 }})
          </div>
          <div
            class="as"
            :class="table.options.method.parmas.validStatus === 1 ? 'on' : ''"
            @click="change(1)"
          >
            生效中({{ tatisticInfo.valid || 0 }})
          </div>
          <div
            class="as"
            :class="table.options.method.parmas.validStatus === 2 ? 'on' : ''"
            @click="change(2)"
          >
            已过期({{ tatisticInfo.expired || 0 }})
          </div>
          <div
            class="as"
            :class="table.options.method.parmas.validStatus === 0 ? 'on' : ''"
            @click="change(0)"
          >
            未生效({{ tatisticInfo.invalid || 0 }})
          </div>
        </div>
        <div class="action-out">
          <el-button class="delete" @click="doDels"
            v-atb="{
              $route: $route,
              type: window.applyApp === 'erp' ? 'hide' : 'show',
              name: 'del'
            }"> 批量删除 </el-button>
          <el-button @click="doImportCar"
            v-atb="{
              $route: $route,
              type: window.applyApp === 'erp' ? 'hide' : 'show',
              name: 'import'
            }">
            <i class="iconfont icon-billtubiao-daoru" />
            导入
          </el-button>
          <el-button @click="exportCar"
            v-atb="{
              $route: $route,
              type: window.applyApp === 'erp' ? 'hide' : 'show',
              name: 'export'
            }">
            <i class="iconfont icon-billtubiao-daochu" />
            导出
          </el-button>
          <el-button class="self-button--minor-2" type="primary" @click="doAdd" 
            v-atb="{
              $route: $route,
              type: window.applyApp === 'erp' ? 'hide' : 'show',
              name: 'add',
            }">
            <i class="icon-billtubiao-xinzeng iconfont" />
            新增
          </el-button>
        </div>
      </div>
      <cys-table
        ref="cys-ref-table"
        :options="table.options"
        :striped="true"
        @selection-change="selectionChange"
      >
        <empty slot="empty" />
        <div slot="statusDesc" slot-scope="scope" class="table-status-out">
          <span
            v-if="scope.row.statusDesc === '生效中'"
            class="table-cell-normal"
          >{{ scope.row.statusDesc }}</span>
          <span v-else class="table-cell-danger">{{
            scope.row.statusDesc
          }}</span>
        </div>
        <template slot="chargeType" slot-scope="scope">
          {{ scope.row.chargeType | carTypeConvert }}
        </template>
        <div slot="carNo" slot-scope="scope" class="car-number">
          {{ getCarNos(scope.row.carNo).carNo }}
          <span
            v-if="getCarNos(scope.row.carNo).num > 3"
            class="car-number-count"
          >+{{ getCarNos(scope.row.carNo).num }}</span>
        </div>
        <div slot="remark" slot-scope="scope">
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
            {{ scope.row.remark }}
          </template>
        </div>
        <div slot="action" slot-scope="scope" class="table-action-td">
          <!-- <el-popover
            v-if="scope.row.chargeType === 2"
            placement="top"
            width="116"
            trigger="click"
            popper-class="table-charge-popper"
          >
            <div class="table-charge">
              <div class="charge-item" @click="doCharge(scope.row)">
                <i class="icon-billchongzhi iconfont" />
                <span>车辆充值</span>
              </div>
              <div v-if="scope.row.enableReverseRecharge" class="charge-item" @click="doChargeBack(scope.row)">
                <i class="icon-billchexiao iconfont" />
                <span>撤销充值</span>
              </div>
            </div>
            <a
              slot="reference"
              class="text-btn-edite tr-action"
              @click="doChargeSet(scope.row)"
            >充值设置</a>
          </el-popover> -->
          <a
            class="text-btn-edite tr-action"
            @click="doEdite(scope.row)"
          >详情</a>
          <a
           v-atb="{
              $route: $route,
              type: window.applyApp === 'erp' ? 'hide' : 'show',
              name: 'edit'
            }"
            class="text-btn-edite tr-action"
            @click="doEdite(scope.row, 2)"
          >编辑</a>
          <!-- <a
            class="text-btn-delete tr-action"
            @click="doDel(scope.row)"
          >删除</a> -->
          <a
            v-atb="{
              $route: $route,
              type: window.applyApp === 'erp' ? 'hide' : 'show',
              name: 'recharge'
            }"
            v-if="scope.row.chargeType === 2"
            slot="reference"
            class="text-btn-edite tr-action"
            @click="doCharge(scope.row)"
          >充值</a>
          <a v-else class="text-btn-edite tr-action text-btn-disable">充值</a>
        </div>
      </cys-table>
    </div>
    <self-dialog
      title="车辆充值"
      width="424px"
      :show-close="false"
      :visible.sync="isShowChargeDialog"
      class="charge-dialog"
      @confirm="chargeDoOK"
      @closeDialog="chargeCancel"
    >
      <div class="car-info">
        <div class="car-title-out">
          {{ getCarNos(chargeDetail.carNo, "、").carNo }}
          <span
            v-if="getCarNos(chargeDetail.carNo, '、').num > 3"
            class="car-number-count"
          >+{{ getCarNos(chargeDetail.carNo, "、").num }}</span>
        </div>
        <div class="car-title-out">
          <span style="flex: 0 0 auto; margin-left: 0">{{
            chargeDetail.chargeTypeName
          }}</span>
        </div>

        <p>车主姓名：{{ chargeDetail.carOwnerName }}</p>
        <p>车主电话：{{ chargeDetail.carOwnerPhone }}</p>
        <p v-if="chargeDetail.carGroupOpenStatus">
          车位数：{{ chargeDetail.carGroupNum }}
        </p>
        <p>有效结束期：{{ chargeDetail.endTime }}</p>
      </div>
      <el-form
        ref="chargeform"
        :model="chargeFormData"
        label-width="90px"
        :inline="false"
        :rules="chargeFormRule"
      >
        <div class="tab-out">
          <span
            :class="{ active: chargeTab === 0 }"
            @click="handChargeTab(0)"
          >标准模式</span>
          <span
            :class="{ active: chargeTab === 1 }"
            @click="handChargeTab(1)"
          >自定义模式</span>
        </div>
        <div v-if="chargeTab === 0" class="standard">
          <div class="rechargeMonth-out">
            <el-form-item label="每月费用：">
              <span
                v-if="chargeDetail.carGroupOpenStatus"
                style="color: #186fe8"
              >￥{{ chargeDialogRendCharge * chargeDetail.carGroupNum }} / 月
                / 位</span>
              <span
                v-else
                style="color: #186fe8"
              >￥{{ chargeDialogRendCharge }} / 月 / 位</span>
            </el-form-item>
            <el-form-item label="充值月数：" prop="rechargeMonth">
              <el-select
                v-model="chargeFormData.rechargeMonth"
                placeholder="请选择充值月数"
                clearable
              >
                <el-option
                  v-for="item in months"
                  :key="item.month"
                  :label="`${item.month}个月`"
                  :value="item.month"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="充值金额：">
              <span v-if="chargeDetail.carGroupOpenStatus">
                ￥{{
                  Math.max(
                    0,
                    chargeDialogRendCharge *
                      chargeFormData.rechargeMonth *
                      chargeDetail.carGroupNum
                  )
                }}
              </span>
              <span v-else>
                ￥{{
                  Math.max(
                    0,
                    chargeDialogRendCharge * chargeFormData.rechargeMonth
                  )
                }}
              </span>
            </el-form-item>
            <el-form-item v-if="discount" label="优惠金额：">
              <span
                style="margin-top: 5"
              >-￥{{
                chargeDetail.carGroupOpenStatus
                  ? discount * chargeDetail.carGroupNum
                  : discount
              }}</span>
            </el-form-item>
            <el-form-item label="实际支付：" style="color: #eb605c">
              <span v-if="chargeDetail.carGroupOpenStatus">
                ￥{{
                  Math.max(
                    0,
                    (chargeDialogRendCharge * chargeFormData.rechargeMonth -
                      discount) *
                      chargeDetail.carGroupNum
                  )
                }}
              </span>
              <span v-else>
                ￥{{
                  Math.max(
                    0,
                    chargeDialogRendCharge * chargeFormData.rechargeMonth -
                      discount
                  )
                }}
              </span>
            </el-form-item>
            <!-- <div class="charge-month-tips">
              <div class="bill-tips">
                <span>充值费用：<i>
                  <countTo
                    v-if="chargeDetail.carGroupOpenStatus"
                    :start-val="0"
                    :end-val="Math.max(0,((chargeDialogRendCharge * chargeFormData.rechargeMonth - discount) * chargeDetail.carGroupNum))"
                    :duration="300"
                    :decimals="2"
                  />
                  <countTo
                    v-else
                    :start-val="0"
                    :decimals="2"
                    :end-val="Math.max(0,(chargeDialogRendCharge * chargeFormData.rechargeMonth - discount))"
                    :duration="300"
                  />
                </i>
                </span>
                <span v-if="chargeDetail.carGroupOpenStatus">{{ chargeDialogRendCharge * chargeDetail.carGroupNum }}元/月</span>
                <span v-else>{{ chargeDialogRendCharge }}元/月</span>
              </div>
              <p v-if="discount" class="discount-tips">已减免{{ chargeDetail.carGroupOpenStatus ? discount * chargeDetail.carGroupNum : discount }} 元</p>
            </div> -->
            <el-form-item
              label="生效时间："
              prop="startTime"
              style="margin-bottom: 16px"
            >
              <el-date-picker
                v-model="chargeFormData.startTime"
                :disabled="!startTimeEnable"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00"
                prefix-icon="el-icon-date"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="过期时间：">
              <el-date-picker
                v-model="outTime"
                disabled
                type="datetime"
                placeholder="选择日期时间"
                prefix-icon="el-icon-date"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </div>
        </div>
        <div v-else class="custom">
          <el-form-item label="生效时间：" prop="startTime">
            <el-date-picker
              v-model="chargeFormData.startTime"
              type="datetime"
              :disabled="!startTimeEnable"
              placeholder="选择日期时间"
              default-time="00:00:00"
              prefix-icon="el-icon-date"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="过期时间：" prop="startTime">
            <el-date-picker
              v-model="chargeFormData.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              default-time="23:59:59"
              prefix-icon="el-icon-date"
            />
          </el-form-item>
          <el-form-item label="充值金额：" prop="rechargeAmount">
            <el-input
              v-model.number="chargeFormData.rechargeAmount"
              type="number"
              placeholder="请输入充值金额"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </self-dialog>

    <!-- 撤销充值 -->
    <self-dialog
      title="撤销充值"
      width="424px"
      :show-close="false"
      :visible.sync="isShowRevokeChargeDialog"
      class="revoke-charge-dialog"
      button-confirm-text="撤销"
      @confirm="doRevokeChargeOK"
      @closeDialog="revokeChargeCancel"
    >
      <div class="car-info">
        <div class="car-title-out">
          <em>{{ reverseRechargeInfo.carNo }}</em>
        </div>
        <div class="car-title-out">
          <span>{{
            reverseRechargeInfo.chargeTypeName ||
              getCarTypeName(editeFormData.carTypeId)
          }}</span>
        </div>
        <p>
          车主姓名：{{
            reverseRechargeInfo.carOwnerName || editeFormData.carOwnerName
          }}
        </p>
        <p>
          车主电话：{{
            reverseRechargeInfo.carOwnerPhone || editeFormData.carOwnerPhone
          }}
        </p>
        <p>
          车位数：{{
            reverseRechargeInfo.carGroupNum || editeFormData.carGroupNum
          }}
        </p>
        <p>上次充值时间：{{ reverseRechargeInfo.createTime }}</p>
        <p>
          实收金额：<span
            style="color: #eb605c"
          >￥{{ reverseRechargeInfo.rechargeAmount }}</span>
        </p>
        <!-- <p>充值月数：{{ reverseRechargeInfo.rechargeMonth }}个月</p> -->
        <p>生效时间：{{ reverseRechargeInfo.startTime }}</p>
        <p>过期时间：{{ reverseRechargeInfo.endTime }}</p>
      </div>
    </self-dialog>

    <self-dialog
      custom-class="detail-dialog"
      title=""
      :width="tabIndex === 1 ? '808px' : '1100px'"
      :show-close="true"
      :loading.sync="loading"
      :visible.sync="isShowDetailDialog"
      :show-footer="false"
      :before-close="cancel"
    >
      <span slot="title">
        <div class="tbs">
          <span
            :class="1 === tabIndex ? 'on' : ''"
            @click="changeTabIndex(1)"
          >{{ isOnlyEdit ? "编辑车辆" : "车辆详情" }}</span>
          <span
            v-if="editeFormData.chargeType === 2 && !isOnlyEdit"
            :class="{ on: tabIndex === 2, 'disabled-tab': isEdit }"
            @click="changeTabIndex(2)"
          >充值记录</span>
          <span
            v-if="!isOnlyEdit"
            :class="{ on: tabIndex === 3, 'disabled-tab': isEdit }"
            @click="changeTabIndex(3)"
          >操作记录</span>
        </div>
      </span>

      <div v-if="tabIndex === 3 && isShowDetailDialog" key="table3">
        <cys-form-search
          ref="form2"
          pointer="cys-ref-table2"
          :data="form2.data"
          :btns="form2.btns"
          :direction="'vertical'"
          :parent="'FixedCar'"
        />
        <cys-table
          ref="cys-ref-table2"
          :options="table2.options"
          :striped="true"
        >
          <empty slot="empty" />

          <div slot="remark" slot-scope="scope">
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
              {{ scope.row.remark }}
            </template>
          </div>
        </cys-table>
      </div>
      <div v-if="tabIndex === 2 && isShowDetailDialog" key="table2">
        <cys-form-search
          ref="form1"
          :pointer="'cys-ref-table1'"
          :data="form1.data"
          :btns="form1.btns"
          :direction="'vertical'"
          :parent="'FixedCar'"
        />
        <div class="records">
          <i class="el-icon-warning-outline" />
          充值后<span>30分钟</span>内，最后一笔充值记录允许撤销
        </div>
        <cys-table
          ref="cys-ref-table1"
          :options="table1.options"
          :striped="true"
          class="cys-gjy"
        >
          <empty slot="empty" />
          <div slot="time" slot-scope="scope">
            {{ scope.row.startTime.split(" ")[0] }} 至
            {{ scope.row.endTime.split(" ")[0] }}
          </div>
          <div slot="isRevoke" slot-scope="scope" class="table-status-out">
            <span
              v-if="scope.row.isRevoke"
              class="table-cell-danger"
            >已撤销</span>
            <span v-else class="table-cell-normal">正常</span>
          </div>

          <!-- <div
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
                {{ scope.row.remark }}
              </template>
            </div> -->
          <div slot="action" slot-scope="scope" class="table-action-td">
            <a
              v-atb="{
                $route: $route,
                type: window.applyApp === 'erp' ? 'hide' : 'show',
                name: 'recharge'
              }"
              class="text-btn-edite tr-action"
              :class="{ 'text-btn-disable': !scope.row.canRevoke }"
              @click="
                scope.row.canRevoke ? doChargeBack(editeFormDataCopy) : ''
              "
            >撤销充值</a>
          </div>
        </cys-table>
      </div>
      <el-form
        v-if="tabIndex === 1 && isShowDetailDialog"
        ref="editeForm"
        :class="{ 'form-disabled': !isEdit }"
        :model="editeFormData"
        label-width="110px"
        :inline="false"
        :rules="rules"
      >
        <div class="flex-2" style="align-items: center">
          <div class="form-module-title" style="flex: 1">车主信息</div>
          <div class="top-btn">
            <el-button
              v-if="isEdit && !isOnlyEdit"
              plain
              @click="cancelEdit()"
            >返回</el-button>
            <el-button
              v-if="isEdit"
              icon="iconfont icon-billtubiao-baocun"
              type="primary"
              @click="doOK"
            >保存</el-button>
            <el-button
              v-atb="{
                $route: $route,
                type: window.applyApp === 'erp' ? 'hide' : 'show',
                name: 'edit'
              }"
              v-if="!isEdit"
              icon="iconfont icon-billtubiao-bianji"
              type="primary"
              @click="isEdit = !isEdit"
            >编辑</el-button>
          </div>
        </div>
        <div class="flex-2">
          <el-form-item
            class="form-item-1"
            label="车主姓名："
            prop="carOwnerName"
          >
            <el-input
              v-if="isEdit"
              v-model="editeFormData.carOwnerName"
              placeholder="请输入车主姓名"
            />
            <div v-else>{{ editeFormData.carOwnerName }}</div>
          </el-form-item>
          <el-form-item label="车主电话：" prop="carOwnerPhone">
            <el-input
              v-if="isEdit"
              v-model="editeFormData.carOwnerPhone"
              placeholder="请输入车主电话"
            />
            <div v-else>{{ editeFormData.carOwnerPhone }}</div>
          </el-form-item>
        </div>
        <div class="flex-2">
          <el-form-item class="form-item-1" label="门牌号：" prop="roomNo">
            <el-input
              v-if="isEdit"
              v-model="editeFormData.roomNo"
              placeholder="请输入房号"
            />
            <div v-else>{{ editeFormData.roomNo }}</div>
          </el-form-item>
          <el-form-item label="车位编码：" prop="parkingCode">
            <el-input
              v-if="isEdit"
              v-model="editeFormData.parkingCode"
              placeholder="请输入车位编码"
            />
            <div v-else>{{ editeFormData.parkingCode }}</div>
          </el-form-item>
        </div>
        <div class="flex-2">
          <el-form-item label="备注：" prop="remark" class="form-item-1">
            <el-input
              v-if="isEdit"
              v-model="editeFormData.remark"
              rows="3"
              placeholder="请输入备注"
            />
            <div v-else>{{ editeFormData.remark }}</div>
          </el-form-item>
          <div v-if="isEdit" style="width: 50%" />
        </div>
        <div class="form-module-title">车辆信息</div>
        <div class="flex-2">
          <el-form-item class="form-item-1" label="车辆类型：" prop="carTypeId">
            <el-select
              v-if="isEdit"
              v-model="editeFormData.carTypeId"
              clearable
              placeholder="请选择车辆类型"
              @change="carTypeIdChange"
            >
              <el-option
                v-for="item in carTypeRuleOption"
                :key="item.ruleId"
                :label="item.carTypeName"
                :value="item.ruleId"
              />
            </el-select>
            <div v-else>{{ getCarTypeName(editeFormData.carTypeId) }}</div>
          </el-form-item>
          <el-form-item
            v-if="chargeType === 2"
            label="月租费用："
            prop="charge"
            class="flex-50"
          >
            <el-input
              v-if="isEdit"
              v-model="monthlyRendCharge"
              placeholder=""
              disabled
            >
              <span slot="append">元</span>
            </el-input>
            <div v-else>{{ monthlyRendCharge }}</div>
          </el-form-item>
          <div v-if="chargeType !== 2" style="width: 50%" />
        </div>
        <div v-if="chargeType === 2" class="flex-2">
          <el-form-item
            label="多车位共享(车位组)："
            label-width="165px"
          >
            <div v-if="isEdit">
              <el-radio-group
                v-model="editeFormData.carGroupOpenStatus"
                @change="canUseCarGroup"
              >
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">不启用</el-radio>
              </el-radio-group>
              <p v-if="guse" class="exs">
                由于该车辆类型已经设置【拆分计费】，当前无法启用【车为组】功能；<br>您可在车辆类型管理中关闭【拆分计费】或联系运维人员开通此服务。
              </p>
            </div>
            <div v-else>
              {{
                { 1: "启用", 0: "不启用" }[editeFormData.carGroupOpenStatus * 1]
              }}
            </div>
          </el-form-item>
        </div>
        <div v-if="chargeType !== 2" class="flex-2">
          <el-form-item class="form-item-1" label="生效时间：" prop="startTime">
            <el-date-picker
              v-if="isEdit"
              v-model="editeFormData.startTime"
              placeholder="选择日期"
              :disabled="chargeType === 2"
              type="datetime"
              prefix-icon="el-icon-date"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <div v-else>{{ editeFormData.startTime }}</div>
          </el-form-item>
          <el-form-item label="过期时间：" prop="endTime">
            <el-date-picker
              v-if="isEdit"
              v-model="editeFormData.endTime"
              :disabled="chargeType === 2"
              placeholder="选择日期"
              type="datetime"
              prefix-icon="el-icon-date"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <div v-else>{{ editeFormData.endTime }}</div>
          </el-form-item>
        </div>
        <!-- <el-form-item
          v-if="chargeType === 2"
          label="多车位共享(车位组)："
          prop="carGroupOpenStatus"
          class="car-group"
        >
          <el-radio-group
            v-if="isEdit"
            v-model="editeFormData.carGroupOpenStatus"
          >
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">不启用</el-radio>
          </el-radio-group>
          <div v-else>
            {{ editeFormData.carGroupOpenStatus ? "启用" : "不启用" }}
          </div>
        </el-form-item> -->
        <div
          v-if="!editeFormData.carGroupOpenStatus || chargeType !== 2"
          class="car-out"
        >
          <div key="car-wraper" class="car-wraper">
            <el-form-item
              label="车牌号码："
              prop="carNo"
              class="carNo-whith-province form-item-1"
            >
              <el-input
                v-if="isEdit"
                v-model="editeFormData.carNo"
                placeholder=""
                class="input-with-select chose-province-out"
              >
                <div
                  id="carProvince"
                  slot="prepend"
                  v-clickoutside="handleClose"
                  class="chose-province"
                  @click="handleChange"
                >
                  <i>{{ carProvince }}</i>
                  <span
                    slot="prepend"
                    class="el-icon-arrow-down"
                    :class="{ 'is-reverse': carProvinceShow }"
                  />
                </div>
              </el-input>
              <div v-if="!isEdit">
                {{ carProvince }}{{ editeFormData.carNo }}
              </div>
            </el-form-item>
            <div style="width: 50%" />
          </div>
        </div>
        <template v-if="editeFormData.carGroupOpenStatus && chargeType === 2">
          <div class="flex-2">
            <el-form-item
              label="车位数："
              prop="carGroupNum"
              class="flex-50 form-item-1"
            >
              <el-input
                v-if="isEdit"
                ref="carGroupNum"
                v-model.number="editeFormData.carGroupNum"
                placeholder=""
                type="number"
              />
              <div v-else>{{ editeFormData.carGroupNum }}</div>
            </el-form-item>
            <div style="width: 50%" />
          </div>

          <div class="car-out">
            <div key="car-wraper" class="car-wraper">
              <el-form-item
                label="车牌号码1："
                prop="carNo"
                class="carNo-whith-province form-item-1"
              >
                <el-input
                  v-if="isEdit"
                  v-model="editeFormData.carNo"
                  placeholder=""
                  class="input-with-select chose-province-out"
                >
                  <div
                    id="carProvince"
                    slot="prepend"
                    v-clickoutside="handleClose"
                    class="chose-province"
                    @click="handleChange"
                  >
                    <i>{{ carProvince }}</i>
                    <span
                      slot="prepend"
                      class="el-icon-arrow-down"
                      :class="{ 'is-reverse': carProvinceShow }"
                    />
                  </div>
                </el-input>
                <el-button
                  v-if="isEdit"
                  class="self-button--minor-2 add-car"
                  type="primary"
                  @click="addCarNum"
                  v-atb="{
                    $route: $route,
                    type: window.applyApp === 'erp' ? 'hide' : 'show',
                    name: 'add'
                  }">
                  <i class="icon-billtubiao-xinzeng iconfont" />
                  新增
                </el-button>
                <div v-if="!isEdit">
                  {{ carProvince }}{{ editeFormData.carNo }}
                </div>
              </el-form-item>
              <div style="width: 50%" />
            </div>
            <div
              v-for="(item, index) in editeFormData.addCarNoList"
              :key="index"
              class="car-wraper"
            >
              <el-form-item
                :label="'车位牌号' + (index + 2) + '：'"
                class="carNo-whith-province form-item-1"
                :prop="'addCarNoList.' + index + '.carNo'"
                :rules="[
                  {
                    required: true,
                    message: '必填',
                    trigger: 'blur',
                  },
                  {
                    pattern:
                      /^[A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
                    message: '车牌号为省份简称 + 6位大写英文/数字组合',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-if="isEdit"
                  v-model="item.carNo"
                  placeholder=""
                  class="input-with-select chose-province-out"
                >
                  <div
                    :id="'carProvince' + index"
                    slot="prepend"
                    class="chose-province"
                    @click="provinceShow(item, index)"
                  >
                    <i>{{ item.province }}</i>
                    <span
                      slot="prepend"
                      class="el-icon-arrow-down"
                      :class="{ 'is-reverse': item.carProvinceShow }"
                    />
                  </div>
                </el-input>
                <carProvinceDialog
                  v-if="isEdit"
                  :ref="'carProvinceChose' + index"
                  :sticky-el-id="'carProvince' + index"
                  :show.sync="item.carProvinceShow"
                  @change="changeCarProvince"
                />
                <i
                  v-if="isEdit"
                  class="el-icon-remove car-remove"
                  @click="carNumRemove(index)"
                />
                <div v-if="!isEdit">{{ item.province }}{{ item.carNo }}</div>
              </el-form-item>
              <div style="width: 50%" />
            </div>
          </div>
        </template>
      </el-form>
    </self-dialog>

    <!-- 新增车辆 -->
    <self-dialog
      :title="`${editeTitle}车辆`"
      width="808px"
      :show-close="false"
      :visible.sync="isShowEditeDialog"
      :loading.sync="loading"
      @confirm="doOK"
      @closeDialog="cancel"
    >
      <el-form
        ref="addForm"
        :model="editeFormData"
        label-width="110px"
        :inline="false"
        :rules="rules"
      >
        <div class="flex-2" style="align-items: center">
          <div class="form-module-title" style="flex: 1; margin-top: 0">
            车主信息
          </div>
        </div>
        <div class="flex-2">
          <el-form-item
            class="form-item-1"
            label="车主姓名："
            prop="carOwnerName"
          >
            <el-input
              v-model="editeFormData.carOwnerName"
              placeholder="请输入车主姓名"
            />
          </el-form-item>
          <el-form-item label="车主电话：" prop="carOwnerPhone">
            <el-input
              v-model="editeFormData.carOwnerPhone"
              placeholder="请输入车主电话"
            />
          </el-form-item>
        </div>
        <div class="flex-2">
          <el-form-item class="form-item-1" label="门牌号：" prop="roomNo">
            <el-input v-model="editeFormData.roomNo" placeholder="请输入房号" />
          </el-form-item>
          <el-form-item label="车位编码：" prop="parkingCode">
            <el-input
              v-model="editeFormData.parkingCode"
              placeholder="请输入车位编码"
            />
          </el-form-item>
        </div>
        <div class="flex-2">
          <el-form-item label="备注：" prop="remark" class="form-item-1">
            <el-input
              v-model="editeFormData.remark"
              rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
          <div style="width: 50%" />
        </div>
        <div class="form-module-title">车辆信息</div>
        <div class="flex-2">
          <el-form-item class="form-item-1" label="车辆类型：" prop="carTypeId">
            <el-select
              v-model="editeFormData.carTypeId"
              clearable
              placeholder="请选择车辆类型"
              @change="carTypeIdChange"
            >
              <el-option
                v-for="item in carTypeRuleOption"
                :key="item.ruleId"
                :label="item.carTypeName"
                :value="item.ruleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="chargeType === 2"
            label="月租费用："
            prop="charge"
            class="flex-50"
          >
            <el-input v-model="monthlyRendCharge" placeholder="" disabled>
              <span slot="append">元</span>
            </el-input>
          </el-form-item>
          <div v-if="chargeType !== 2" style="width: 50%" />
        </div>
        <div v-if="chargeType !== 2" class="flex-2">
          <el-form-item class="form-item-1" label="生效时间：" prop="startTime">
            <el-date-picker
              v-model="editeFormData.startTime"
              placeholder="选择日期"
              :disabled="chargeType === 2"
              type="datetime"
              prefix-icon="el-icon-date"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="过期时间：" prop="endTime">
            <el-date-picker
              v-model="editeFormData.endTime"
              :disabled="chargeType === 2"
              placeholder="选择日期"
              type="datetime"
              default-time="23:59:59"
              prefix-icon="el-icon-date"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </div>
        <el-form-item
          v-if="chargeType === 2"
          label="多车位共享(车位组)："
          prop="carGroupOpenStatus"
          class="car-group"
        >
          <el-radio-group
            v-model="editeFormData.carGroupOpenStatus"
            @change="canUseCarGroup"
          >
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">不启用</el-radio>
          </el-radio-group>
          <p v-if="guse" class="exs">
            由于该车辆类型已经设置【拆分计费】，当前无法启用【车为组】功能；<br>您可在车辆类型管理中关闭【拆分计费】或联系运维人员开通此服务。
          </p>
        </el-form-item>
        <!-- <div class="flex-2">
          <el-form-item label="车牌号码：" prop="carNo" class="carNo-whith-province form-item-1">
            <el-input
              v-model="editeFormData.carNo"
              placeholder=""
              class="input-with-select chose-province-out"
            >
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
          <div style="width: 50%;" />
        </div> -->
        <div
          v-if="!editeFormData.carGroupOpenStatus || chargeType !== 2"
          class="car-out"
        >
          <div key="car-wraper" class="car-wraper">
            <el-form-item
              label="车牌号码："
              prop="carNo"
              class="carNo-whith-province form-item-1"
            >
              <el-input
                v-model="editeFormData.carNo"
                placeholder=""
                class="input-with-select chose-province-out"
              >
                <div
                  id="addCarProvince"
                  slot="prepend"
                  v-clickoutside="addHandleClose"
                  class="chose-province"
                  @click="addHandleChange"
                >
                  <i>{{ addCarProvince }}</i>
                  <span
                    slot="prepend"
                    class="el-icon-arrow-down"
                    :class="{ 'is-reverse': addCarProvinceShow }"
                  />
                </div>
              </el-input>
            </el-form-item>
            <div style="width: 50%" />
          </div>
        </div>
        <template v-if="editeFormData.carGroupOpenStatus && chargeType === 2">
          <div class="flex-2">
            <el-form-item
              label="车位数："
              prop="carGroupNum"
              class="flex-50 form-item-1"
            >
              <el-input
                ref="carGroupNum"
                v-model.number="editeFormData.carGroupNum"
                placeholder=""
                type="number"
              />
            </el-form-item>
            <div style="width: 50%" />
          </div>

          <div class="car-out">
            <div key="car-wraper" class="car-wraper">
              <el-form-item
                label="车牌号码1："
                prop="carNo"
                class="carNo-whith-province form-item-1"
              >
                <el-input
                  v-model="editeFormData.carNo"
                  placeholder=""
                  class="input-with-select chose-province-out"
                >
                  <div
                    id="addCarProvince"
                    slot="prepend"
                    v-clickoutside="addHandleClose"
                    class="chose-province"
                    @click="addHandleChange"
                  >
                    <i>{{ addCarProvince }}</i>
                    <span
                      slot="prepend"
                      class="el-icon-arrow-down"
                      :class="{ 'is-reverse': addCarProvinceShow }"
                    />
                  </div>
                </el-input>
                <el-button
                  class="self-button--minor-2 add-car"
                  type="primary"
                  @click="addCarNum"
                >
                  <i class="icon-billtubiao-xinzeng iconfont" />
                  新增
                </el-button>
              </el-form-item>
              <div style="width: 50%" />
            </div>
            <div
              v-for="(item, index) in editeFormData.addCarNoList"
              :key="index"
              class="car-wraper"
            >
              <!-- :rules="[
                { required: true, message: '必填', trigger: 'blur' },
                { pattern: /^[A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/, message: '车牌号为省份简称 + 6位大写英文/数字组合', trigger: 'blur' }
              ]" -->
              <el-form-item
                :label="'车位牌号' + (index + 2) + '：'"
                :prop="'addCarNoList.' + index + '.carNo'"
                class="carNo-whith-province form-item-1"
                :rules="[
                  {
                    required: true,
                    message: '必填',
                    trigger: 'blur',
                  },
                  {
                    pattern:
                      /^[A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
                    message: '车牌号为省份简称 + 6位大写英文/数字组合',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="item.carNo"
                  placeholder=""
                  class="input-with-select chose-province-out"
                >
                  <div
                    :id="'carProvince' + index"
                    slot="prepend"
                    class="chose-province"
                    @click="provinceShow(item, index)"
                  >
                    <i>{{ item.province }}</i>
                    <span
                      slot="prepend"
                      class="el-icon-arrow-down"
                      :class="{ 'is-reverse': item.carProvinceShow }"
                    />
                  </div>
                </el-input>
                <carProvinceDialog
                  :ref="'carProvinceChose' + index"
                  :sticky-el-id="'carProvince' + index"
                  :show.sync="item.carProvinceShow"
                  @change="changeCarProvince"
                />
                <i
                  class="el-icon-remove car-remove"
                  @click="carNumRemove(index)"
                />
              </el-form-item>
              <div style="width: 50%" />
            </div>
            <!-- <div name="list-complete" tag="div" class="car-number-list">
              <div v-for="(item, index) in addCarNoList" :key="item" class="car-number-item" :class="{'disabled': !isEdit}">
                <span>{{ item }}</span>
                <i class="el-icon-remove" @click="carNumRemove(index)" />
              </div>
            </div> -->
          </div>
        </template>
      </el-form>
    </self-dialog>

    <!-- 批量删除 -->
    <self-dialog
      :title="`批量删除`"
      width="358px"
      :show-close="false"
      :visible.sync="isShowDeleteDialog"
      :loading.sync="loading"
      @confirm="deleteByIds"
      @closeDialog="cancelDeleteDialog"
    >
      <!-- <div class="gs">
        <span v-for="(item,index) in delCars" :key="index">{{ item.carNo }}</span>
      </div> -->
      <div class="qs">
        <p><i class="el-icon-delete-solid" /></p>
        <p class="p1">
          确定删除<span class="c1">{{ delCars.length }}</span>辆车吗？
        </p>
        <p class="c2">请仔细审核!</p>
      </div>
    </self-dialog>

    <importCar
      ref="importCar"
      v-model="isShowImportDialog"
      :import-template-json="importTemplateJson"
      :export-template-by-url="exportTemplateByUrl"
      :export-template-json="exportTemplateJson"
      :export-template-data="exportTemplateData"
      :import-request-back-info="importRequestBackInfo"
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
          <el-form-item label="车辆类型：" prop="carTypeId">
            <el-select
              v-model="importFormData.carTypeId"
              clearable
              placeholder="请选择车辆类型"
              @change="importCarTypeIdChange"
            >
              <el-option
                v-for="item in carTypeRuleOption"
                :key="item.ruleId"
                :label="item.carTypeName"
                :value="item.ruleId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </importCar>

    <carProvinceDialog
      ref="carProvinceChose"
      v-model="carProvince"
      sticky-el-id="carProvince"
      :show.sync="carProvinceShow"
    />

    <carProvinceDialog
      ref="addCarProvince"
      v-model="addCarProvince"
      sticky-el-id="addCarProvince"
      :show.sync="addCarProvinceShow"
    />
  </div>
</template>
<script>
import {
  fixedCarDel,
  fixedCarAdd,
  fixedCarEdit,
  fixedCarPageList,
  fixedCarDetail,
  reverseRecharge,
  findRechargeDiscountByCarId,
  fixedCarRecharge,
  canStartTimeEditable,
  fixedCarExportSearch,
  fixedCarImportdata,
  lastRechargeRecord,
  calEndTimeWhenRecharge,
  findListCountByCondition,
  findRecords,
  batchDelFixedCar,
  getFixedCarstatisticInfo,
  checkCarGroupAndMonthEffect
} from './api/fixedCar'
import { carType } from './api/carType'
import dayjs from 'dayjs'
import importCar from './components/importCar'
import carProvinceDialog from './components/carProvinceDialog'
import clickoutside from './utils/clickoutside'
import { getFormatDate_XLSX } from './utils/dateFormat'
import mixin from "./mixin/index"
export default {
  name: 'FixedCar',
  mixins: [mixin],
  componentName: 'FixedCar',
  components: {
    importCar,
    carProvinceDialog
  },
  directives: {
    clickoutside
  },
  props:{
    // npm封装参数
    packParams: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      window: window,
      guse: false, // 是否允许开启车为组
      carIdList: [],
      delCars: [],
      isShowDeleteDialog: false,
      isEdit: false,
      isOnlyEdit: false,
      isShowDetailDialog: false,
      tabIndex: 1,
      importTemplateJson: [
        { field: 'carOwnerName', title: '车主名字' },
        { field: 'carOwnerPhone', title: '车主电话' },
        { field: 'roomNo', title: '门牌号', width: 30 },
        { field: 'parkingCode', title: '车位编码' },
        { field: 'carGroupNum', title: '车位数' },
        { field: 'carNo', title: '车牌号' },
        { field: 'startTime', title: '生效日期' },
        { field: 'endTime', title: '过期日期' },
        { field: 'remark', title: '备注' }
      ],
      exportTemplateByUrl:
        process.env.NODE_ENV === 'development'
          ? 'http://iot-page1.api1.cheweiguanjia.com/xlsl/固定车.xlsx'
          : 'http://siot.tingcheqianbao.com/xlsl/固定车.xlsx',
      exportTemplateJson: [
        { field: 'carOwnerName', title: '车主名字', width: 15 },
        { field: 'carOwnerPhone', title: '车主电话', width: 20 },
        { field: 'roomNo', title: '门牌号', width: 30 },
        { field: 'parkingCode', title: '车位编码', width: 15 },
        { field: 'carGroupNum', title: '车位数', width: 15 },
        { field: 'carNo', title: '车牌号', width: 15 },
        { field: 'startTime', title: '生效日期', width: 40 },
        { field: 'endTime', title: '过期日期', width: 40 },
        { field: 'remark', title: '备注', width: 60 }
      ],
      exportTemplateData: [
        {
          carOwnerName: '张三',
          carOwnerPhone: '15666666666',
          roomNo: '706',
          parkingCode: '12345',
          carGroupNum: '12',
          carNo: '京A12345/京B12345',
          startTime: '2010-01-01 12:00:00',
          endTime: '2010-01-01 12:00:00',
          remark: '此为导入模板范例'
        }
      ],
      importRequestBackInfo: {
        successNum: 0,
        importFixedCarFailVOs: [],
        failNum: 0
      },
      importFormData: {
        carTypeId: '',
        chargeType: ''
      },
      importFormRules: {
        carTypeId: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      carProvinceShow: false,
      addCarProvinceShow: false,
      extralJson: {},
      extralJsonRule: {},
      startTimeEnable: false,
      reverseRechargeInfo: {},
      months: [
        {
          key: 'oneMonthDiscount',
          month: 1
        },
        {
          key: 'twoMonthDiscount',
          month: 2
        },
        {
          key: 'threeMonthDiscount',
          month: 3
        },
        {
          key: 'fourMonthDiscount',
          month: 4
        },
        {
          key: 'fiveMonthDiscount',
          month: 5
        },
        {
          key: 'sixMonthDiscount',
          month: 6
        },
        {
          key: 'sevenMonthDiscount',
          month: 7
        },
        {
          key: 'eightMonthDiscount',
          month: 8
        },
        {
          key: 'nineMonthDiscount',
          month: 9
        },
        {
          key: 'tenMonthDiscount',
          month: 10
        },
        {
          key: 'elevenMonthDiscount',
          month: 11
        },
        {
          key: 'twelveMonthDiscount',
          month: 12
        }
      ],
      rechargeDiscount: {},
      isShowImportCar: false,
      excleJson: [],
      excelFileName: '',
      isShowImportDialog: false,
      importLoading: false,
      isShowRevokeChargeDialog: false,
      chargeTab: 0,
      chargeFormRule: {
        rechargeMonth: [{ required: true, message: '必填', trigger: 'change' }],
        startTime: [{ required: true, message: '必填', trigger: 'change' }],
        endTime: [{ required: true, message: '必填', trigger: 'change' }],
        rechargeAmount: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      chargeDetail: {},
      chargeFormData: {
        rechargeMonth: '',
        startTime: '',
        endTime: '',
        rechargeAmount: ''
      },
      isShowChargeDialog: false,
      carNumReg:
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][a-hj-np-zA-HJ-NP-Z][a-hj-np-zA-HJ-NP-Z0-9]{4,5}[a-hj-np-zA-HJ-NP-Z0-9挂学警港澳]$/,
      addCarNoList: [],
      addCarProvince: '京',
      carProvince: '京',
      loading: false,
      chargeType: -1,
      form: {
        btns: [
          {
            label: '查询',
            action: 'search'
          }
        ],
        data: [
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
            clearable: true
          },
          {
            type: 'input',
            label: '车牌号',
            field: 'carNo',
            value: '',
            placeholder: '车牌号',
            clearable: true
          },
          // {
          //   type: 'select',
          //   label: '状态',
          //   field: 'inExpiration',
          //   value: '',
          //   placeholder: '',
          //   options: [
          //     { label: '有效期内', value: 1 },
          //     { label: '已过期', value: 0 }
          //   ],
          //   filterable: true,
          //   optionLabel: 'label',
          //   optionValue: 'value',
          //   clearable: true
          // },
          {
            type: 'input',
            label: '车主姓名',
            field: 'carOwnerName',
            value: '',
            placeholder: '车主姓名',
            clearable: true
          },
          {
            type: 'datetimerange',
            label: '生效时间',
            field: 'date',
            value: [],
            placeholder: '生效时间',
            clearable: true,
            arr2Obj: {
              startTimeBegin: '',
              startTimeEnd: ''
            }
          },
          {
            type: 'datetimerange',
            label: '过期时间',
            field: 'date',
            value: [],
            placeholder: '过期时间',
            clearable: true,
            arr2Obj: {
              endTimeBegin: '',
              endTimeEnd: ''
            }
          }
        ]
      },
      form1: {
        btns: [
          {
            label: '查询',
            action: 'search'
          }
        ],
        data: [
          {
            type: 'datetimerange',
            label: '操作时间',
            field: 'date',
            value: [],
            placeholder: '操作时间',
            clearable: true,
            arr2Obj: {
              startTime: '',
              endTime: ''
            }
          }
        ]
      },
      form2: {
        btns: [
          {
            label: '查询',
            action: 'search'
          }
        ],
        data: [
          {
            type: 'datetimerange',
            label: '操作时间',
            field: 'date',
            value: [],
            placeholder: '操作时间',
            clearable: true,
            arr2Obj: {
              startoperationTime: '',
              endoperationTime: ''
            }
          }
        ]
      },
      carTypeRuleOption: [],
      isAdd: true,
      isShowEditeDialog: false,
      editeFormData: {
        carNo: '',
        carTypeId: '',
        carOwnerName: '',
        carOwnerPhone: '',
        parkingCode: '',
        roomNo: '',
        startTime: '',
        endTime: '',
        remark: '',
        carGroupNum: '',
        addCarNo: '',
        carGroupOpenStatus: false,
        addCarNoList: []
      },
      rules: {
        carTypeId: [
          { required: true, message: '必填', trigger: 'blur,change' }
        ],
        carNo: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            pattern: /^[A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
            message: '车牌号为省份简称 + 6位大写英文/数字组合',
            trigger: 'blur'
          }
        ],
        addCarNo: [
          { required: false, message: '必填', trigger: 'blur' },
          {
            pattern: /^[A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
            message: '车牌号为省份简称 + 6位大写英文/数字组合',
            trigger: 'blur'
          }
        ],
        carOwnerName: [{ required: true, message: '必填', trigger: 'blur' }],
        // carOwnerPhone: [
        //   { required: true, message: '必填', trigger: 'blur' },
        //   {
        //     pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        //     message: '手机号不合法',
        //     trigger: 'blur'
        //   }
        // ],
        startTime: [
          { required: true, message: '必填', trigger: 'blur,change' }
        ],
        endTime: [{ required: true, message: '必填', trigger: 'blur,change' }],
        parkingCode: [{ required: false, message: '必填', trigger: 'blur' }],
        roomNo: [{ required: false, message: '必填', trigger: 'blur' }],
        carGroupNum: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            required: true,
            type: 'number',
            min: 1,
            message: '最小为1',
            trigger: 'blur'
          }
        ],
        remark: [{ required: false, message: '必填', trigger: 'blur' }]
      },
      table: {
        options: {
          isPagination: true,
          isLoading: false,
          isSelection: true,
          isIndex: true,
          indexWidth: '60px',
          thead: {
            column: [
              {
                label: '车牌号码',
                prop: 'carNo',
                slotName: 'carNo',
                style: {
                  width: '180px'
                }
              },
              {
                label: '车辆类型',
                prop: 'carTypeName'
              },
              {
                label: '缴费类型',
                prop: 'chargeType',
                slotName: 'chargeType'
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
                label: '生效时间',
                prop: 'startTime',
                style: {
                  width: '160px'
                }
              },
              {
                label: '过期时间',
                prop: 'endTime',
                style: {
                  width: '160px'
                }
              },
              {
                label: '状态',
                prop: 'statusDesc',
                slotName: 'statusDesc',
                style: {
                  width: '85px'
                }
              },
              {
                label: '备注',
                prop: 'remark',
                slotName: 'remark'
              },
              {
                label: '操作',
                prop: 'action',
                slotName: 'action',
                fixed: 'right',
                style: {
                  width: '180px'
                }
              }
            ]
          },
          method: {
            interface: fixedCarPageList, // 调用表格数据接口方法
            parmas: {
              validStatus: ''
            } // 参
          }
        }
      },
      table1: {
        options: {
          isPagination: true,
          isLoading: false,
          isIndex: false,
          thead: {
            column: [
              {
                label: '车牌号码',
                prop: 'carNo',
                style: {
                  width: '90px'
                }
              },
              {
                label: '实收金额',
                prop: 'rechargeAmount',
                style: {
                  width: '90px'
                }
              },
              {
                label: '优惠金额',
                prop: 'discountAmount',
                style: {
                  width: '90px'
                }
              },
              {
                label: '充值时段',
                prop: 'startTime',
                slotName: 'time',
                style: {
                  "min-width": '180px'
                }
              },
              {
                label: '状态',
                prop: 'isRevoke',
                slotName: 'isRevoke',
                style: {
                  width: '90px'
                }
              },
              {
                label: '操作时间',
                prop: 'createTime',
                style: {
                  width: '180px'
                }
              },
              {
                label: '操作人',
                prop: 'operator',
                style: {
                  width: '100px'
                }
              },
              {
                label: '操作来源',
                prop: 'operationSource',
                style: {
                  width: '100px'
                }
              },
              {
                label: '操作',
                prop: 'action',
                slotName: 'action',
                style: {
                  width: '80px'
                }
              }
            ]
          },
          method: {
            interface: (val) => {
              val.fixedCarId = this.fixedCarId
              return findRecords(val)
            }, // 调用表格数据接口方法
            parmas: {} // 参
          }
        }
      },
      table2: {
        options: {
          isPagination: true,
          isLoading: false,
          isIndex: false,
          thead: {
            column: [
              {
                label: '操作时间',
                prop: 'operationTime',
                style: {
                  width: '180px'
                }
              },
              {
                label: '操作类型',
                prop: 'operationType',
                style: {
                  width: '120px'
                }
              },
              {
                label: '操作详情',
                prop: 'operationDetail'
              },
              {
                label: '操作人',
                prop: 'nickName',
                style: {
                  width: '100px'
                }
              },
              {
                label: '操作来源',
                prop: 'operationSource',
                style: {
                  width: '180px'
                }
              }
            ]
          },
          method: {
            interface: (val) => {
              val.fixedCarId = this.fixedCarId
              return findListCountByCondition(val)
            }, // 调用表格数据接口方法
            parmas: {} // 参
          }
        }
      },
      outTime: '',
      fixedCarId: '',
      addCarNoListCopy: [],
      provinceIdx: -1,
      editeFormDataCopy: {},
      tatisticInfo: {}
    }
  },
  computed: {
    // outTime() {
    //   const rechargeMonth = this.chargeFormData.rechargeMonth
    //   if (this.chargeTab === 0 && rechargeMonth > 0) {
    //     this.calEndTimeWhenRecharge({
    //       carId: this.chargeFormData.carId,
    //       rechargeMonth: rechargeMonth,
    //       startTime: this.chargeFormData.startTime
    //     })
    //   }
    //   if (rechargeMonth >= 2) {
    //     return dayjs(this.chargeFormData.startTime)
    //       .add(rechargeMonth - 1, 'months').endOf('month')
    //       .format('YYYY-MM-DD HH:mm:ss')
    //   } else {
    //     return dayjs(this.chargeFormData.startTime).endOf('month').format('YYYY-MM-DD HH:mm:ss')
    //   }
    // },
    editeTitle() {
      return this.isAdd ? '新增' : '编辑'
    },
    addCarNumFull() {
      return `${this.addCarProvince}${this.editeFormData.addCarNo}`
    },
    monthlyRendCharge() {
      const carTypeRuleOption = this.carTypeRuleOption
      const carTypeId = this.editeFormData.carTypeId
      if (carTypeRuleOption.length > 0 && carTypeId) {
        const carType = carTypeRuleOption.find(
          (item) => item.ruleId === carTypeId
        )
        if (carType) {
          return carType.charge
        }
      }
      return 0
    },
    chargeDialogRendCharge() {
      const carTypeRuleOption = this.carTypeRuleOption
      const carTypeId = this.chargeDetail.carTypeId
      if (carTypeRuleOption.length > 0 && carTypeId) {
        const carType = carTypeRuleOption.find(
          (item) => item.ruleId === carTypeId
        )
        if (carType) {
          return carType.charge
        }
      }
      return 0
    },
    discount() {
      if (this.chargeFormData.rechargeMonth) {
        return (
          this.rechargeDiscount[
            this.months[this.chargeFormData.rechargeMonth - 1].key
          ] || 0
        )
      }
      return 0
    }
  },
  watch: {
    'chargeFormData.rechargeMonth'() {
      const rechargeMonth = this.chargeFormData.rechargeMonth
      if (this.chargeTab === 0 && rechargeMonth > 0) {
        this.calEndTimeWhenRecharge({
          carId: this.chargeFormData.carId,
          rechargeMonth: this.chargeFormData.rechargeMonth,
          startTime: this.chargeFormData.startTime
        })
      } else {
        if (this.chargeFormData.startTime) {
          this.outTime = dayjs(this.chargeFormData.startTime)
            .endOf('month')
            .format('YYYY-MM-DD HH:mm:ss')
        } else {
          this.outTime = ''
        }
      }
    }
  },
  created() {
    this.carType()
    this.getFixedCarstatisticInfo()
  },
  methods: {
    async canUseCarGroup(val) {
      const { errorCode, message, data } = await checkCarGroupAndMonthEffect({
        carTypeId: this.editeFormData.carTypeId
      })
      if (errorCode === '0') {
        this.guse = !data
        if (data) {
          this.editeFormData.carGroupOpenStatus = val
        } else {
          this.editeFormData.carGroupOpenStatus = false
        }
      } else {
        this.$message.error(message)
      }
    },
    change(val) {
      // 有效期状态 0-未生效，1-有效期内 2-已过期 不传值：全部
      this.$refs['cys-ref-table'].page.current = 1
      this.table.options.method.parmas.validStatus = val
      this.$refs['cys-ref-table'].getTableData()
    },
    cancelDeleteDialog() {
      this.isShowDeleteDialog = false
    },
    getCarNos(carNos, hf) {
      if (carNos) {
        carNos = carNos.split(hf || ',')
        return {
          carNo: carNos.slice(0, 3).join('、'),
          num: carNos.length
        }
      } else {
        return {
          carNo: '',
          num: 0
        }
      }
    },
    changeTabIndex(i) {
      if (this.isEdit) {
        return
      }
      this.tabIndex = i
    },
    changeCarProvince(val) {
      this.editeFormData.addCarNoList[this.provinceIdx].province = val
    },
    provinceShow(data, index) {
      this.provinceIdx = index
      this.editeFormData.addCarNoList = this.editeFormData.addCarNoList.map(
        (e, i) => {
          if (index === i) {
            e.carProvinceShow = !e.carProvinceShow
          } else {
            e.carProvinceShow = false
          }
          return e
        }
      )
    },
    cancelEdit() {
      this.isEdit = !this.isEdit
      this.editeFormData = JSON.parse(JSON.stringify(this.editeFormDataCopy))
      this.editeFormData.addCarNoList = JSON.parse(
        JSON.stringify(this.addCarNoListCopy)
      )
      this.carProvince = this.editeFormData.carNo[0]
      this.editeFormData.carNo = this.editeFormData.carNo.slice(1)
    },
    getCarTypeName(type) {
      var typeObject = this.carTypeRuleOption.find((e) => {
        return e.ruleId === type
      })
      console.log('typeObject', typeObject)
      if (typeObject) {
        return typeObject.carTypeName
      } else {
        return ''
      }
    },
    async doCharge(row) {
      const chargeFormData = this.chargeFormData
      for (const key in chargeFormData) {
        chargeFormData[key] = ''
      }
      const { errorCode, data } = await findRechargeDiscountByCarId(
        row.fixedCarId
      )
      const res = await canStartTimeEditable(row.fixedCarId)
      const res1 = await fixedCarDetail(row.fixedCarId)
      this.isShowChargeDialog = true
      if (errorCode === '0' && data) {
        this.rechargeDiscount = data
      }
      this.chargeDetail = Object.assign({}, row)
      this.chargeFormData.carId = row.fixedCarId
      if (res1.errorCode === '0') {
        this.chargeDetail.carNo = res1.data.carNo
        if (res1.data.carGroupList && res1.data.carGroupList.length) {
          this.chargeDetail.carNo += '、' + res1.data.carGroupList.join('、')
        }
      }
      if (res.errorCode === '0') {
        this.startTimeEnable = res.data
        const milliseconds = +new Date()
        if (
          row.endTime === '2000-01-01 00:00:00' ||
          dayjs(row.endTime).valueOf() < milliseconds
        ) {
          this.chargeFormData.startTime =
            dayjs().format('YYYY-MM-DD') + ' 00:00:00'
        } else {
          this.chargeFormData.startTime = row.endTime
        }
      }
    },
    carTypeIdChange(val) {
      var chargeType = this.carTypeRuleOption.filter((e) => {
        return e.ruleId === val
      })
      console.log(this.carTypeRuleOption)
      if (chargeType.length) {
        this.chargeType = chargeType[0].chargeType
      }
      if (this.isAdd) {
        if (this.chargeType === 2) {
          this.editeFormData.startTime = '2000-01-01 00:00:00'
          this.editeFormData.endTime = '2000-01-01 00:00:00'
        } else {
          this.editeFormData.startTime = ''
          this.editeFormData.endTime = ''
        }
      }
    },
    carDialogChange(val) {
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
    async startUpload(excleData) {
      console.log(excleData)
      const timeReg = /(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})/
      const telReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (!excleData || excleData.length < 1) {
        return this.$message.warning('请选择文件')
      }
      this.importRequestBackInfo.importFixedCarFailVOs = []
      for (let i = 0; i < excleData.length; i++) {
        const e = excleData[i]
        const carNos = e.carNo.split('/')
        if (!timeReg.test(e.startTime)) {
          if (typeof e.startTime === 'number') {
            e.startTime = getFormatDate_XLSX(
              e.startTime,
              'YYYY-MM-DD HH:mm:ss'
            )
            if (!timeReg.test(e.startTime)) {
              this.importRequestBackInfo.importFixedCarFailVOs.push({
                carNo: e.carNo,
                failCause: '生效时间格式有误！时间格式例： 2010/01/01 00:00:00'
              })
              return
            }
          } else {
            this.importRequestBackInfo.importFixedCarFailVOs.push({
              carNo: e.carNo,
              failCause: '生效时间格式有误！时间格式例： 2010/01/01 00:00:00'
            })
            return
          }
        }
        if (!timeReg.test(e.endTime)) {
          if (typeof e.endTime === 'number') {
            e.endTime = getFormatDate_XLSX(e.endTime, 'YYYY-MM-DD HH:mm:ss')
            if (!timeReg.test(e.endTime)) {
              this.importRequestBackInfo.importFixedCarFailVOs.push({
                carNo: e.carNo,
                failCause: '过期时间格式有误！时间格式例： 2010/01/01 00:00:00'
              })
              return
            }
          } else {
            this.importRequestBackInfo.importFixedCarFailVOs.push({
              carNo: e.carNo,
              failCause: '过期时间格式有误！时间格式例： 2010/01/01 00:00:00'
            })
            return
          }
        }
        if (carNos.some((cn) => !this.carNumReg.test(cn))) {
          this.importRequestBackInfo.importFixedCarFailVOs.push({
            carNo: e.carNo,
            failCause: '车牌号格式有误'
          })
          return
        }
        if (!telReg.test(e.carOwnerPhone)) {
          this.importRequestBackInfo.importFixedCarFailVOs.push({
            carNo: e.carNo,
            failCause: '手机号格式有误'
          })
          return
        }
        if (!e.carOwnerName) {
          this.importRequestBackInfo.importFixedCarFailVOs.push({
            carNo: e.carNo,
            failCause: '车主姓名不能为空'
          })
          return
        }
      }
      this.$refs.importForm.validate((status) => {
        if (status) {
          const params = Object.assign({}, this.importFormData, {
            importFixedCarDTOList: excleData
          })
          fixedCarImportdata(params).then(res => {
            if (res.errorCode === '0') {
              this.importRequestBackInfo = res.data
              this.$refs['cys-ref-table'].getTableData()
            }
          })
        }
      })
    },
    revokeChargeCancel() {
      this.isShowRevokeChargeDialog = false
    },
    async revokeFun() {
      const { errorCode } = await reverseRecharge({
        carId: this.reverseRechargeInfo.fixedCarId,
        carNo: this.reverseRechargeInfo.carNo
      })
      if (errorCode === '0') {
        this.$message.success('撤销成功')
        this.$refs['cys-ref-table'].getTableData()
        if (this.isShowDetailDialog) {
          this.$refs['cys-ref-table1'].getTableData()
        }
      }
      this.isShowRevokeChargeDialog = false
    },
    async calEndTimeWhenRecharge(params) {
      const { errorCode, data } = await calEndTimeWhenRecharge(params)
      console.log('data', data)
      if (errorCode === '0') {
        this.outTime = data
        // this.outTime = data
      }
    },
    doRevokeChargeOK() {
      this.revokeFun()
      // this.showConfirm({
      //   customClass: 'car-revoke-confirm',
      //   promiseCallBack: this.revokeFun,
      //   promiseCallBackParams: {},
      //   defaultMsgboxEle: [
      //     this.$createElement('i', {
      //       class: {
      //         'iconfont': true,
      //         'icon-billjinggao': true
      //       }
      //     }),
      //     this.$createElement('p', {
      //       class: {
      //         'normal-text': true
      //       }
      //     }, [
      //       this.$createElement('span', null, '您确定撤销'),
      //       this.$createElement('em', { class: { confirmCarNo: true }}, `${this.reverseRechargeInfo.carNo}`),
      //       this.$createElement('span', null, '的充值吗？')
      //     ])
      //   ],
      //   title: '撤销充值'
      // })
    },
    handChargeTab(index) {
      this.chargeTab = index
    },
    async chargeFun() {
      const outTime = this.outTime
      const chargeTab = this.chargeTab
      const beforeOutTime = this.chargeDetail.endTime
      const chargeFormData = this.chargeFormData
      const startTime = chargeFormData.startTime
      if (dayjs(startTime).valueOf() < dayjs(beforeOutTime).valueOf()) {
        return this.$message.warning(
          '生效开始时间不能小于之前有效期的结束时间'
        )
      }
      const endTime = chargeTab === 0 ? outTime : chargeFormData.endTime
      var standardModeChargeAmount = Math.max(
        0,
        this.chargeDialogRendCharge * chargeFormData.rechargeMonth -
          this.discount
      )
      if (this.chargeDetail.carGroupOpenStatus) {
        standardModeChargeAmount = Math.max(
          0,
          (this.chargeDialogRendCharge * chargeFormData.rechargeMonth -
            this.discount) *
            this.chargeDetail.carGroupNum
        )
      }
      const params = Object.assign({}, this.chargeFormData, {
        endTime,
        carId: this.chargeDetail.fixedCarId,
        carNo: this.chargeDetail.carNo,
        rechargeType: chargeTab,
        rechargeAmount:
          chargeTab === 0
            ? standardModeChargeAmount
            : chargeFormData.rechargeAmount,
        rechargeMonth: chargeFormData.rechargeMonth || 0
      })
      if (chargeTab === 1) {
        if (
          dayjs(params.startTime).valueOf() > dayjs(params.endTime).valueOf()
        ) {
          return this.$message.warning('开始时间不能晚于结束时间')
        }
      }
      const { errorCode } = await fixedCarRecharge(params)
      if (errorCode === '0') {
        this.$message.success('充值成功')
        this.isShowChargeDialog = false
        this.$refs['cys-ref-table'].getTableData()
      }
    },
    chargeDoOK() {
      this.$refs.chargeform.validate((status) => {
        if (status) {
          const carNos = this.getCarNos(this.chargeDetail.carNo, '、')
          let cstr = ''
          if (carNos.num > 3) {
            cstr = carNos.carNo + `...共${carNos.num}辆`
          } else {
            cstr = carNos.carNo
          }
          this.showConfirm({
            customClass: 'car-charge-confirm',
            promiseCallBack: this.chargeFun,
            promiseCallBackParams: {},
            defaultMsgboxEle: [
              this.$createElement('i', {
                class: {
                  iconfont: true,
                  'icon-billtubiao-chongzhiqueren': true
                }
              }),
              this.$createElement(
                'p',
                {
                  class: {
                    'normal-text': true
                  }
                },
                [
                  this.$createElement('span', null, '您确定要对'),
                  this.$createElement(
                    'em',
                    { class: { confirmCarNo: true }},
                    cstr
                  ),
                  this.$createElement('span', null, '进行充值吗？')
                ]
              )
            ],
            title: '充值确认'
          })
        }
      })
    },
    chargeCancel() {
      this.isShowChargeDialog = false
    },
    async doChargeBack(row) {
      console.log('row', row)
      const { errorCode, data } = await lastRechargeRecord({
        fixedCarId: row.fixedCarId
      })
      const res = await fixedCarDetail(row.fixedCarId)
      if (errorCode === '0') {
        this.reverseRechargeInfo = Object.assign(row, data)
        this.reverseRechargeInfo.createTime = data.createTime
        if (res.errorCode === '0') {
          this.reverseRechargeInfo.carNo = res.data.carNo
          if (res.data.carGroupList && res.data.carGroupList.length) {
            this.reverseRechargeInfo.carNo +=
              '、' + res.data.carGroupList.join('、')
          }
        }
        // this.reverseRechargeInfo.startTime = data.startTime;
        this.isShowRevokeChargeDialog = true
      }
      // 撤销充值
      // this.doRevokeChargeOK()
    },
    doChargeSet() {},
    cancel() {
      this.editeFormData = {
        carNo: '',
        carTypeId: '',
        carOwnerName: '',
        carOwnerPhone: '',
        parkingCode: '',
        roomNo: '',
        startTime: '',
        endTime: '',
        remark: '',
        carGroupNum: '',
        addCarNo: '',
        carGroupOpenStatus: false,
        addCarNoList: []
      }
      this.isOnlyEdit = false
      if (this.isShowEditeDialog) {
        if (this.$refs.addForm) {
          this.$refs.addForm.resetFields()
        }
        this.isShowEditeDialog = false
        this.guse = false
      }
      if (this.isShowDetailDialog) {
        if (this.$refs.editeForm) {
          this.$refs.editeForm.resetFields()
        }
        this.isShowDetailDialog = false
      }
    },
    async carType() {
      const { errorCode, data } = await carType({})
      if (errorCode === '0') {
        this.carTypeRuleOption =
          data.filter((item) => [2, 4, 5].includes(item.chargeType)) || []
        this.form.data[0].options = this.carTypeRuleOption
      }
    },
    doImportCar() {
      this.isShowImportDialog = true
    },
    async exportCar() {
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
          title: '车主姓名',
          field: 'carOwnerName',
          width: 20
        },
        {
          title: '车主电话',
          field: 'carOwnerPhone',
          width: 15
        },
        {
          title: '门牌号',
          field: 'roomNo',
          width: 15
        },
        {
          title: '车位编码',
          field: 'parkingCode',
          width: 15
        },
        {
          title: '车位组',
          field: 'carGroupOpenStatus',
          width: 15
        },
        {
          title: '生效时间',
          field: 'startTime',
          width: 25
        },
        {
          title: '过期时间',
          field: 'endTime',
          width: 25
        },
        {
          title: '状态',
          field: 'statusDesc',
          width: 10
        },
        {
          title: '备注',
          field: 'remark',
          width: 100
        }
      ]
      const { errorCode, data } = await fixedCarExportSearch({})
      const { default: excelUtil } = await import(
        /* webpackChunkName: "excelUtil" */ './utils/excelUtil'
      )
      console.log(excelUtil)
      if (errorCode === '0') {
        // data.list.forEach(item => {
        //   item.inExpiration = item.inExpiration ? '生效中' : '已过期'
        // })
        const nowTime = dayjs(new Date()).format('YYYY年MM月DD日HH时mm分ss秒')
        const bookName = `${nowTime}_${this.packParams.parkName}_固定车辆.xlsx`
        excelUtil.export(cols, data.list, { bookName })
      }
    },
    async doDels() {
      this.isShowDeleteDialog = true
    },
    async doDel(data) {
      this.showConfirm({
        promiseCallBack: this.delRequest,
        promiseCallBackParams: data,
        title: '删除车辆',
        confirmButtonText: '删除',
        confirmText: '确认删除该车辆？'
      })
    },
    async delRequest(data) {
      const res = await fixedCarDel({
        fixedCarId: data.fixedCarId,
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
    doAdd() {
      this.editeFormData = {
        carNo: '',
        carTypeId: '',
        carOwnerName: '',
        carOwnerPhone: '',
        parkingCode: '',
        roomNo: '',
        startTime: '',
        endTime: '',
        remark: '',
        carGroupNum: '',
        addCarNo: '',
        carGroupOpenStatus: false,
        addCarNoList: []
      }
      this.editeFormData.addCarNoList = []
      this.isShowEditeDialog = true
      this.isAdd = true
      this.isOnlyEdit = false
    },
    async doEdite(row, type) {
      if (type === 2) {
        this.tabIndex = 1
        this.isEdit = true
        this.isOnlyEdit = true
      } else {
        this.tabIndex = 1
        this.isEdit = false
        this.isOnlyEdit = false
      }
      this.fixedCarId = row.fixedCarId
      const { errorCode, data } = await fixedCarDetail(row.fixedCarId)
      this.isAdd = false
      // this.isShowEditeDialog = true
      this.isShowDetailDialog = true
      if (errorCode === '0') {
        this.editeFormData = Object.assign({}, data)
        console.log('data.carGroupList', this.editeFormData)
        this.editeFormData.chargeTypeName = row.chargeTypeName
        this.editeFormDataCopy = Object.assign({}, data)
        this.editeFormDataCopy.chargeTypeName = row.chargeTypeName
        this.carProvince = this.editeFormData.carNo[0]
        this.editeFormData.carNo = this.editeFormData.carNo.slice(1)
        this.chargeType = data.chargeType
        console.log(this.chargeType, '===this.chargeType')
        // this.editeFormData.addCarNoList = []
        this.$set(this.editeFormData, 'addCarNoList', [])
        this.addCarNoListCopy = []
        data.carGroupList = data.carGroupList || []
        data.carGroupList.forEach((e) => {
          this.editeFormData.addCarNoList.push({
            province: e.slice(0, 1),
            carNo: e.slice(1),
            carProvinceShow: false
          })
          this.addCarNoListCopy.push({
            province: e.slice(0, 1),
            carNo: e.slice(1),
            carProvinceShow: false
          })
        })
        // this.addCarNoList = data.carGroupList || []
        // this.addCarNoListCopy = JSON.parse(JSON.stringify(data.carGroupList || []))
      }
    },
    selectionChange(val) {
      this.carIdList = val.map((r) => {
        return r.fixedCarId
      })
      this.delCars = val.map((r) => {
        return {
          fixedCarId: r.fixedCarId,
          carNo: r.carNo
        }
      })
    },
    async deleteByIds() {
      if (this.carIdList.length < 1) {
        this.$message({
          type: 'warning',
          message: '请选择删除车辆'
        })
        return
      }
      const { errorCode, message } = await batchDelFixedCar({
        carIdList: this.carIdList
      })
      if (errorCode === '0') {
        this.$refs['cys-ref-table'].getTableData()
        this.isShowDeleteDialog = false
      } else {
        this.$message({
          type: 'error',
          message: message
        })
      }
    },
    doOK() {
      var ref = 'editeForm'
      if (this.isAdd) {
        ref = 'addForm'
      }
      this.$refs[ref].validate(async(status) => {
        if (status) {
          const parmas = Object.assign({}, this.editeFormData)
          const startTime = dayjs(parmas.startTime).valueOf()
          const endTime = dayjs(parmas.endTime).valueOf()
          if (startTime > endTime) {
            return this.$message.warning('开始时间不能大于结束时间')
          }
          var res = {}
          const addCarNoList = []
          for (var i = 0; i < this.editeFormData.addCarNoList.length; i++) {
            if (this.editeFormData.addCarNoList[i].carNo) {
              var car =
                this.editeFormData.addCarNoList[i].province +
                this.editeFormData.addCarNoList[i].carNo
              if (
                /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z0]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}([A-Z0-9]{1})?$/g.test(
                  car
                )
              ) {
                addCarNoList.push(car)
              } else {
                this.$message.warning(
                  '车牌号为省份简称 + 6位大写英文/数字组合'
                )
                return
              }
            }
          }
          // this.addCarNoList.forEach((e) => {
          //   // if(){

          //   // }
          //   addCarNoList.push(e.province + e.carNo)
          // })
          parmas.monthlyRendCharge = this.monthlyRendCharge
          parmas.carGroupList = addCarNoList
          if (this.isAdd) {
            parmas.carNo = this.addCarProvince + parmas.carNo
          } else {
            parmas.carNo = this.carProvince + parmas.carNo
          }
          parmas.chargeType = this.chargeType
          delete parmas.addCarNoList
          if (this.carTypeRuleOption && this.carTypeRuleOption.length) {
            parmas.carTypeStr = this.carTypeRuleOption.find((e) => {
              return e.ruleId === parmas.carTypeId
            }).carTypeName
          }

          if (this.isAdd) {
            res = await fixedCarAdd(parmas)
          } else {
            res = await fixedCarEdit(parmas)
          }
          if (res.errorCode === '0') {
            this.$message.success(`${this.editeTitle}成功`)
            if (this.isAdd) {
              // this.doEdite({
              //   fixedCarId: res.data
              // })
              this.isShowEditeDialog = false
              this.guse = false
            } else {
              this.isShowDetailDialog = false
            }
            this.$refs['cys-ref-table'].getTableData()
          }
        }
      })
    },
    // addCarNum() {
    //   const carNumReg = this.carNumReg
    //   const addCarNumFull = this.addCarNumFull
    //   const addCarNoList = this.addCarNoList
    //   if (carNumReg.test(addCarNumFull)) {
    //     if (addCarNoList.find(item => item === addCarNumFull)) {
    //       return this.$message.warning('该车牌已经被添加')
    //     }
    //     addCarNoList.push(addCarNumFull)
    //   } else {
    //     this.$message.warning('请检查添加的车牌号')
    //   }
    // },
    addCarNum() {
      this.editeFormData.addCarNoList.unshift({
        province: '京',
        carNo: '',
        carProvinceShow: false
      })
      this.$forceUpdate()
    },
    carNumRemove(index) {
      this.editeFormData.addCarNoList.splice(index, 1)
      this.$forceUpdate()
    },
    handleChange() {
      if (this.carProvinceShow.show) {
        this.carProvinceShow = false
        return false
      }
      this.carProvinceShow = true
    },
    handleClose() {
      setTimeout(() => {
        this.carProvinceShow = false
      }, 16)
    },
    addHandleChange() {
      if (this.addCarProvinceShow) {
        this.addCarProvinceShow = false
        return false
      }
      this.addCarProvinceShow = true
    },
    addHandleClose() {
      setTimeout(() => {
        this.addCarProvinceShow = false
      }, 16)
    },
    importCarTypeIdChange(val) {
      const carTypeRuleOption = this.carTypeRuleOption
      const current = carTypeRuleOption.find((item) => item.ruleId === val)
      this.importFormData.chargeType = current.chargeType
    },
    async getFixedCarstatisticInfo() {
      const { errorCode, data } = await getFixedCarstatisticInfo()
      if (errorCode === '0') {
        this.tatisticInfo = data
      }
    }
  }
}
</script>
<style lang="scss">
.car-province {
  transform: translateY(calc(-100% - 36px));
}
.exs {
  margin: 0;
  line-height: 20px;
  color: red;
}
.gs {
  background: #f6f8fa;
  margin: -20px -20px 0;
  padding: 20px 0 10px;
  span {
    display: inline-block;
    width: 119px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    background: #ffffff;
    box-shadow: 0px 2px 5px 0px rgba(66, 68, 70, 0.1);
    border-radius: 4px;
    margin: 0 0px 15px 15px;
  }
}
.qs {
  text-align: center;
  .p1 {
    margin: 10px 0 0 0;
  }
  .c1 {
    color: #eb605c;
    margin: 0 3px;
  }
  .c2 {
    color: #eb605c;
    margin: 5px 0 0 0;
  }
  i {
    font-size: 28px;
    color: #eb605c;
  }
}
.delete {
  color: #eb605c;
  background-color: #fff;
  border: 1px solid #eb605c;
}
.delete.el-button.el-button--default:focus,
.delete.el-button.el-button--default:hover {
  color: #eb605c;
  background-color: #fff;
  border: 1px solid #eb605c;
}
.ay {
  display: flex;
  justify-content: space-between;
}
.sia {
  margin-top: 17px;
  .as {
    display: inline-block;
    width: 90px;
    height: 30px;
    line-height: 30px;
    margin-left: 10px;
    text-align: center;
    color: #333333;
    font-size: 14px;
    border: 1px solid #fff;
    border-radius: 15px;
    cursor: pointer;
    &.on {
      color: #186fe8;
      border: 1px solid #186fe8;
    }
  }
}
.car-number {
  // text-overflow: -o-ellipsis-lastline;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // display: -webkit-box;
  // -webkit-line-clamp: 2;
  // line-clamp: 2;
  // -webkit-box-orient: vertical;
  .car-number-count {
    display: inline-block;
    background: #333333;
    border-radius: 4px;
    font-size: 10px;
    color: #ffffff;
    line-height: 1;
    padding: 2px 4px;
  }
}

.el-icon-remove.car-remove {
  color: #eb605c;
  font-size: 18px;
  padding: 5px;
  position: absolute;
  cursor: pointer;
  opacity: 1;
  margin-top: 4px;
  transition: opacity 0.3s ease-in;
}

.records {
  text-align: right;
  color: #666666;
  font-size: 14px;
  padding: 0 5px 5px;
  span {
    color: #186fe8;
  }
}

.form-disabled {
  .el-form-item {
    margin-bottom: 0 !important;
  }
}

.add-car {
  position: absolute;
}

.form-module-title {
  font-size: 15px;
  font-weight: bold;
  color: #333333;
  margin-top: 20px;
  margin-bottom: 20px;
}

.form-item-1 {
  margin-right: 60px;
}

.detail-dialog {
  color: red;
  .el-dialog__header {
    padding: 0 !important;
  }
}

.top-btn {
  padding-bottom: 20px;
  background-color: #ffffff;
  text-align: right;
  &.shadow {
    box-shadow: 0px 4px 12px 0px rgba(222, 226, 230, 0.4);
  }
}
.tbs {
  margin-top: 5px;
  // border-bottom: 1px solid #E0E6ED;
  padding-left: 10px;
  span {
    width: 120px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    display: inline-block;
    color: #333;
    position: relative;
    cursor: pointer;
    &::before {
      width: 60px;
      height: 2px;
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -30px;
      bottom: 0;
      background: #436fed;
      display: none;
    }
    &:first-child {
      border-right: none;
    }
    &.on::before {
      display: block;
    }
    &.on {
      color: #186fe8;
    }
    &.disabled-tab {
      color: #999999;
    }
  }
}
.fixedCar {
  .el-form-item--small {
    .el-form-item__content {
      line-height: 36px;
    }
  }
  .el-select {
    width: 100%;
  }
  .form-item {
    display: flex;
    color: #333;
    font-size: 14px;
    height: 36px;
    align-items: center;
    .form-label {
      width: 100px;
      text-align: right;
      margin-right: 5px;
      font-weight: 700;
    }
    .form-value {
      .red {
        color: red;
      }
    }
  }
  .flex-50 {
    width: 50%;
  }
  .flex-2 {
    display: flex;
    .el-form-item {
      width: 50%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .car-group {
    .el-form-item__label {
      width: 150px !important;
    }
    .el-form-item__content {
      margin-left: 180px !important;
    }
  }
  .carNo-whith-province {
    .input-with-select {
      .el-select {
        .el-input__suffix {
          right: -40px;
        }
      }
    }
  }
  .car-out {
    .car-wraper {
      display: flex;
    }
    .el-form-item {
      width: 50%;
    }
    .el-button {
      max-height: 32px;
      background-color: #fff;
      color: #09b0ca;
      margin-left: 16px;
    }
    .car-number-list {
      padding-left: 0px;
      max-height: 230px;
      padding-top: 10px;
      margin-bottom: 20px;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      .car-number-item {
        transition: all 0.3s;
        width: 100px;
        height: 36px;
        background: #e9edf3;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
        .el-icon-remove {
          color: #eb605c;
          font-size: 18px;
          padding: 5px;
          position: absolute;
          right: -12px;
          top: -12px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease-in;
        }
        &:hover {
          background-color: #ecf4ff;
          .el-icon-remove {
            opacity: 1;
          }
        }
        &.disabled:hover {
          background: #e9edf3;
          .el-icon-remove {
            opacity: 0;
          }
        }
      }
    }
    .list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active for below version 2.1.8 */ {
      opacity: 0;
      transform: translateY(30px);
    }
    .list-complete-leave-active {
      position: absolute;
    }
  }
  .table-action-td .tr-action.el-popover__reference {
    margin-right: 26px;
  }
  .car-info {
    background-color: #ecf4ff;
    border-radius: 6px;
    padding: 16px;
    p {
      margin: 0;
      line-height: 1.7em;
    }
    .car-title-out {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      em {
        font-style: normal;
        font-weight: bold;
        color: #000;
        font-size: 16px;
        word-break: keep-all;
      }
      span {
        margin-left: 6px;
        padding: 3px 7px;
        background: #186fe8;
        border-radius: 2px;
        font-size: 12px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      i {
        margin-left: 6px;
        padding: 3px 7px;
        background: #186fe8;
        border-radius: 2px;
        font-size: 12px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: normal;
        background-color: #02830f;
      }
    }
  }
  .charge-dialog {
    .tab-out {
      margin: 30px auto;
      width: 196px;
      height: 32px;
      background: #e5e9f0;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #010101;
      span {
        width: 96px;
        height: 28px;
        border-radius: 4px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &.active {
          background-color: #fff;
        }
      }
    }
    .el-form {
      padding: 0 30px;
      .el-date-editor {
        width: 100%;
      }
      .startTime-tips {
        margin-top: 10px;
        padding-left: 90px;
        span {
          color: #186fe8;
        }
      }
      .charge-month-tips {
        padding-left: 90px;
        margin-top: 5px;
        .bill-tips {
          display: flex;
          justify-content: space-between;
          span {
            &:first-child {
              display: flex;
              align-items: center;
            }
          }
          i {
            font-size: 18px;
            color: #eb605c;
            font-style: normal;
          }
        }
        .discount-tips {
          margin-top: 5px;
          color: #eb605c;
          font-size: 13px;
        }
      }
    }
  }

  .standard {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__error {
        position: static;
      }
    }
  }

  .revoke-charge-dialog {
    .car-info {
      background-color: #fff;
      p {
        line-height: 2em;
      }
    }
  }
  .rechargeMonth-out {
    margin-bottom: 20px;
  }
  .importForm {
    .el-form-item__label {
      padding-right: 0;
      &::before {
        margin-right: 0 !important;
      }
    }
  }
}
</style>

<style lang="scss">
.cys-gjy{
  .cys-table table {
      table-layout: auto;
      width: 100%;
  }
}

.table-charge-popper {
  min-width: 116px !important;
  width: 116px !important;
  padding: 14px 15px;
  .table-charge {
    .charge-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #333;
      cursor: pointer;
      &:not(:first-child) {
        margin-top: 12px;
      }
    }
    .iconfont {
      color: #333;
    }
  }
}
.car-charge-confirm {
  .self-confirm-content {
    display: flex;
    .iconfont {
      color: #186fe8;
      font-size: 20px;
    }
    .normal-text {
      padding-left: 6px;
      font-weight: normal;
    }
    .confirmCarNo {
      color: #186fe8;
      font-style: normal;
      margin: 0 4px;
    }
  }
}
.car-revoke-confirm {
  .self-confirm-content {
    display: flex;
    .iconfont {
      color: #eb605c;
      font-size: 20px;
    }
    .normal-text {
      padding-left: 6px;
      font-weight: normal;
    }
    .confirmCarNo {
      color: #eb605c;
      font-style: normal;
      margin: 0 4px;
    }
  }
}
</style>
