import request from '@/utils/request'
let applyApp = ""
if(window.applyApp === "erp"){
  // erp项目使用行云封装的npm包，追加一个前缀iot
  applyApp = "iot"
}
// 获区域列表
export function getFreeAreaList(params) {
  return request({
    url: `${applyApp}/parking/area/getMyAreas`,
    method: 'get',
    params: params
  })
}

// 新增区域
export function addParkingArea(params) {
  return request({
    url: `${applyApp}/parking/area/addArea`,
    method: 'put',
    data: params
  })
}

// 新增区域
export function editParkingArea(params) {
  return request({
    url: `${applyApp}/parking/area/updateArea`,
    method: 'put',
    data: params
  })
}

// 查询我的车场
export function getMyParkDetail(params) {
  return request({
    url: `${applyApp}/parking/parkSet/getMyParkDetail`,
    method: 'get',
    data: params
  })
}

// 是否已经车场配置
export function hasSetParkSet(params) {
  return request({
    url: `${applyApp}/parking/area/hasSetParkSet`,
    method: 'get',
    data: params
  })
}

// 删除区域
export function deleteArea(areaId) {
  return request({
    url: `${applyApp}/parking/area/deleteArea/${areaId}`,
    method: 'delete'
  })
}

// 更换区域模式
export function changeMode(mode) {
  return request({
    url: `${applyApp}/parking/area/changeMode/${mode}`,
    method: 'get'
  })
}
