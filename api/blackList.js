import request from '@/utils/request'
let applyApp = ""
if(window.applyApp === "erp"){
  // erp项目使用行云封装的npm包，追加一个前缀iot
  applyApp = "iot"
}
// 黑名单新增
export function carBlackListAdd(data) {
  return request({
    url: `${applyApp}/parking/carBlackList/add`,
    method: 'post',
    data
  })
}

// 黑名单删除
export function carBlackListDelete(data) {
  return request({
    url: `${applyApp}/parking/carBlackList/delete/${data.recordId}?carNo=${data.carNo}`,
    method: 'get'
  })
}

// 黑名单列表
export function carBlackListPageList(data) {
  return request({
    url: `${applyApp}/parking/carBlackList/pageList`,
    method: 'post',
    data
  })
}

// 黑名单列表
export function inParkCarSelectPage(data) {
  return request({
    url: `${applyApp}/parking/carBlackList/pageList`,
    method: 'post',
    data
  })
}

// 黑名单列表
export function inParkCarDetail(data) {
  return request({
    url: `${applyApp}/parking/carBlackList/pageList`,
    method: 'post',
    data
  })
}
