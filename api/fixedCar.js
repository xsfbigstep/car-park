import request from '@/utils/request'
let applyApp = ""
if(window.applyApp === "erp"){
  // erp项目使用行云封装的npm包，追加一个前缀iot
  applyApp = "iot"
}
// 删除固定车辆类型
export function fixedCarDel(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/del?fixedCarId=${data.fixedCarId}&carNo=${data.carNo}`,
    method: 'post',
    data
  })
}

// 新增固定车辆类型
export function fixedCarAdd(params) {
  return request({
    url: `${applyApp}/parking/fixedCar/add`,
    method: 'post',
    data: params
  })
}

// 固定车辆类型详情
export function fixedCarDetail(fixedCarId) {
  return request({
    url: `${applyApp}/parking/fixedCar/detail?fixedCarId=${fixedCarId}`,
    method: 'get'
  })
}

// 编辑固定车辆类型
export function fixedCarEdit(params) {
  return request({
    url: `${applyApp}/parking/fixedCar/edit`,
    method: 'post',
    data: params
  })
}

// 判断车牌是否存在
export function fixedCarExistsCarNo(carNo) {
  return request({
    url: `${applyApp}/parking/fixedCar/existsCarNo?carNo=${carNo}`,
    method: 'post'
  })
}

// 固定车辆类型列表
export function fixedCarPageList(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/pageList`,
    method: 'post',
    data
  })
}

// 月租车充值时获取折扣对象
export function findRechargeDiscountByCarId(carId) {
  return request({
    url: `${applyApp}/parking/fixedCar/findRechargeDiscountByCarId/${carId}`,
    method: 'get'
  })
}

// 撤销充值
export function reverseRecharge(params) {
  return request({
    url: `${applyApp}/parking/fixedCar/reverseRecharge`,
    method: 'get',
    params
  })
}

// 充值
export function fixedCarRecharge(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/recharge`,
    method: 'post',
    data
  })
}

// 充值时能否对开始时间进行编辑
export function canStartTimeEditable(carId) {
  return request({
    url: `${applyApp}/parking/fixedCar/canStartTimeEditable/${carId}`,
    method: 'get'
  })
}

// 固定车 导出查询-全量
export function fixedCarExportSearch(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/exportSearch`,
    method: 'post',
    data
  })
}

// 固定车 导入
export function fixedCarImportdata(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/importdata`,
    method: 'post',
    data
  })
}

// 撤销充值最后充值记录
export function lastRechargeRecord(params) {
  return request({
    url: `${applyApp}/parking/fixedCar/lastRechargeRecord`,
    method: 'get',
    params
  })
}

// 标准模式下计算失效时间
export function calEndTimeWhenRecharge(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/calEndTimeWhenRecharge`,
    method: 'post',
    data
  })
}

// 根据条件查询车辆变更记录（根据车辆维度记录变更情况）列表和分页
export function findListCountByCondition(data) {
  return request({
    url: `${applyApp}/parking/carOperationLog/findListCountByCondition`,
    method: 'post',
    data
  })
}

// 查询月租车充值记录列表
export function findRecords(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/findRecords`,
    method: 'post',
    data
  })
}

// 批量删除
export function batchDelFixedCar(data) {
  return request({
    url: `${applyApp}/parking/fixedCar/batchDel`,
    method: 'post',
    data
  })
}

// 有效期状态统计信息
export function getFixedCarstatisticInfo(params) {
  return request({
    url: `${applyApp}/parking/fixedCar/statisticInfo`,
    method: 'get',
    params
  })
}

// 验证是否能同时配置月租车车位组+分区分区功能。月组车编辑，新增、编辑固定车需验证
export function checkCarGroupAndMonthEffect(params) {
  return request({
    url: `${applyApp}/parking/fixedCar/checkCanOpenCarGroup`,
    method: 'get',
    params
  })
}
