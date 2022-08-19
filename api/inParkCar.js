import request from '@/utils/request'
let applyApp = ""
if(window.applyApp === "erp"){
  // erp项目使用行云封装的npm包，追加一个前缀iot
  applyApp = "iot"
}
// 在场车列表 分页
export function inParkCarPageList(data) {
  return request({
    url: `${applyApp}/parking/inParkCar/pageList`,
    method: 'post',
    data
  })
}

// 在场车列表 不分页
export function inParkCarList(data) {
  return request({
    url: `${applyApp}/parking/inParkCar/list`,
    method: 'post',
    data
  })
}

// 异常出场
export function manualExceptionCarOut(carInId) {
  return request({
    url: `${applyApp}/parking/inParkCar/manualExceptionCarOut?carInId=${carInId}`,
    method: 'get'
  })
}

// 获取当前车场通道列表
export function getChannelList(params) {
  return request({
    url: `${applyApp}/parking/channel/getChannelList`,
    method: 'get',
    params
  })
}

// 在场车导入
export function inParkCarImport(data) {
  return request({
    url: `${applyApp}/parking/inParkCar/import`,
    method: 'post',
    data
  })
}

// 在场车批量出场
export function batchManualExceptionCarOut(data) {
  return request({
    url: `${applyApp}/parking/inParkCar/batchManualExceptionCarOut`,
    method: 'post',
    data
  })
}

// 在场车统计信息
export function getInParkCarstatisticInfo(params) {
  return request({
    url: `${applyApp}/parking/inParkCar/statisticInfo`,
    method: 'get',
    params
  })
}
