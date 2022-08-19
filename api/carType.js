import request from '@/utils/request'
let applyApp = ""
if(window.applyApp === "erp"){
  // erp项目使用行云封装的npm包，追加一个前缀iot
  applyApp = "iot"
}
// 获取车辆类型列表
export function carType(data) {
  return request({
    url: `${applyApp}/parking/carTypeRule/list`,
    method: 'post',
    data
  })
}

// 获取车辆类型列表分页
export function carTypePageList(data) {
  return request({
    url: `${applyApp}/parking/carTypeRule/pageList`,
    method: 'post',
    data
  })
}

// 车辆类型新增
export function carTypeAdd(data) {
  return request({
    url: `${applyApp}/parking/carTypeRule/add`,
    method: 'post',
    data
  })
}

// 车辆类型编辑
export function carTypeEdit(data) {
  return request({
    url: `${applyApp}/parking/carTypeRule/edit`,
    method: 'post',
    data
  })
}

// 车辆类型删除
export function carTypeDelete(data) {
  return request({
    url: `${applyApp}/parking/carTypeRule/delete/${data.ruleId}?carTypeName=${data.carTypeName}`,
    method: 'delete'
  })
}

// 获取车场下计费规则
export function queryRuleConfigsByParkGuid(parkGuid) {
  return request({
    url: `${applyApp}/rule/actualChargeRule/queryRuleConfigsByParkGuid?parkGuid=${parkGuid}`,
    method: 'get'
  })
}

// 车辆类型详情
export function carTypeRuleDetail(ruleId) {
  return request({
    url: `${applyApp}/parking/carTypeRule/detail?ruleId=${ruleId}`,
    method: 'get'
  })
}

// 临时车默认
export function setDefaultUseCarType(ruleId) {
  return request({
    url: `${applyApp}/parking/carTypeRule/setDefaultUseCarType?ruleId=${ruleId}`,
    method: 'post'
  })
}

// 验证是否能开启月租车分区分时计费功能
export function checkCanOpenMonthEffect(params) {
  return request({
    url: `${applyApp}/parking/carTypeRule/checkCanOpenMonthEffect`,
    method: 'get',
    params
  })
}
