import request from '@/utils/request'
// import asyncRoutes from '../../mock/asyncRoutes'
let applyApp = ""
if(window.applyApp === "erp"){
  // erp项目使用行云封装的npm包，追加一个前缀iot
  applyApp = "iot"
}
// 获取图片地址前缀
export function getImageUrlPrefix(params) {
  // return request({
  //   url: '/mock/s-iot/parkConfig/getImageUrlPrefix',
  //   method: 'get',
  //   params
  // })
  return Promise.resolve({
    data: 'http://cwgj-charging-system.oss-cn-hangzhou.aliyuncs.com',
    errorCode: '0',
    message: '执行成功!',
    responseId: 'uENG7L6T1d12covl'
  })
}

// 用户登录
export function login(data) {
  return request({
    url: `${applyApp}/usr/account/login`,
    method: 'post',
    data
  })
}

// 新建资源菜单
export function resourceSave(data) {
  return request({
    url: `${applyApp}/usr/resource/save`,
    method: 'put',
    data
  })
}

// 修改资源菜单
export function resourceUpdate(data) {
  return request({
    url: `${applyApp}/usr/resource/update`,
    method: 'put',
    data
  })
}

// 删除资源菜单
export function resourceDelete(id) {
  return request({
    url: `${applyApp}/usr/resource/delete/${id}`,
    method: 'delete'
  })
}

// 资源菜单列表
export function findListCountByCondition(data) {
  return request({
    url: `${applyApp}/usr/resource/findListCountByCondition`,
    method: 'post',
    data
  })
}

// 获取当前登录用户菜单信息
export function getResourcesByAccountToken(params) {
  return request({
    url: `${applyApp}/usr/account/getResourcesByAccountToken`,
    method: 'get',
    params
  })
}

// 检查登录的用户是否是多个运营商创建
export function checkAccountIsMore(params) {
  return request({
    url: `${applyApp}/usr/account/checkAccountIsMore`,
    method: 'get',
    params
  })
}

export const addSystem = params => {
  return request({
    url: `${applyApp}/usr/system/add`,
    method: 'post',
    params
  })
}

export const modifySystem = params => {
  return request({
    url: `${applyApp}/usr/system/edit`,
    method: 'post',
    params
  })
}

// 系统列表
export const getSystemList = params => {
  return request({
    url: `${applyApp}/usr/system/getList`,
    method: 'get',
    params
  })
}

// 系统分页列表
export function getSystemtList(data) {
  return request({
    url: `${applyApp}/usr/system/getPagination`,
    method: 'post',
    data
  })
}

export const deleteSystem = params => {
  return request({
    url: `${applyApp}/usr/system/del`,
    method: 'post',
    params
  })
}

export const recoverSystem = params => {
  return request({
    url: `${applyApp}/usr/system/recover`,
    method: 'post',
    params
  })
}

export const setSystemEnable = params => {
  return request({
    url: `${applyApp}/usr/system/enable`,
    method: 'get',
    params
  })
}

export const setSystemDisable = params => {
  return request({
    url: `${applyApp}/usr/system/disable`,
    method: 'get',
    params
  })
}

// 修改用户密码
export function changePassword(data) {
  return request({
    url: `${applyApp}/usr/account/changePassword`,
    method: 'post',
    params: data
  })
}

// 我的车场
export function getMyParks(params) {
  return request({
    url: `${applyApp}/usr/account/getMyParks`,
    method: 'get'
  })
}

// 切换当前使用车场
export function switchCurrentPark(parkGuid) {
  return request({
    url: `${applyApp}/usr/account/switchCurrentPark/${parkGuid}`,
    method: 'get'
  })
}

// 用户管理列表
export function findUsersList(data) {
  return request({
    url: `${applyApp}/usr/accountnew/findListCountByCondition`,
    method: 'POST',
    data
  })
}

// 角色列表
export function roleList(params) {
  return request({
    url: `${applyApp}/usr/rolenew/getList`,
    method: 'get',
    params
  })
}

// 启用用户
export function userEnable(params) {
  return request({
    url: `${applyApp}/usr/accountnew/enable`,
    method: 'get',
    params
  })
}

// 禁用用户
export function userDisable(params) {
  return request({
    url: `${applyApp}/usr/accountnew/disable`,
    method: 'get',
    params
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: `${applyApp}/usr/accountnew/saveAccountAndRole`,
    method: 'post',
    data
  })
}

// 查询用户信息和用户数据权限和角色权限绑定关系
export function accountRoleDetail(params) {
  return request({
    url: `${applyApp}/usr/accountnew/accountRoleDetail`,
    method: 'get',
    params
  })
}

export function addRole(params) {
  return request({
    url: `${applyApp}/usr/rolenew/add`,
    method: 'post',
    params
  })
}

export function editRole(params) {
  return request({
    url: `${applyApp}/usr/rolenew/edit`,
    method: 'post',
    params
  })
}

export function disableRole(params) {
  return request({
    url: `${applyApp}/usr/rolenew/disable`,
    method: 'get',
    params
  })
}

export function enableRole(params) {
  return request({
    url: `${applyApp}/usr/rolenew/enable`,
    method: 'get',
    params
  })
}

export function deleteRole(params) {
  return request({
    url: `${applyApp}/usr/rolenew/del`,
    method: 'post',
    params
  })
}

export function getRoleByPagination(data) {
  return request({
    url: `${applyApp}/usr/rolenew/pagination`,
    method: 'post',
    data
  })
}

export function getResourcesZTree(params) {
  return request({
    url: `${applyApp}/usr/rolenew/getResourcesZTree`,
    method: 'get',
    params
  })
}

export function saveRoleResource(data) {
  return request({
    url: `${applyApp}/usr/rolenew/saveRoleResource`,
    method: 'post',
    data
  })
}

// 获取公私钥
export function getParkAccessKey(params) {
  return request({
    url: `${applyApp}/usr/secret/getParkAccessKey`,
    method: 'get',
    params
  })
}

// 删除用户
export function accountnewDelete(params) {
  return request({
    url: `${applyApp}/usr/accountnew/delete`,
    method: 'get',
    params
  })
}

// 获取到该用户创建的用户账户
export function getMyAcount(params) {
  return request({
    url: `${applyApp}/usr/accountnew/getMyAcount`,
    method: 'get',
    params
  })
}

// 重置密码
export function resetPassword(params) {
  return request({
    url: `${applyApp}/usr/accountnew/resetPassword`,
    method: 'get',
    params
  })
}

