/*
 * @Description: 组件批量注册方法
 * @Autor: xiaoshifu
 */
import carPark from "./index.vue"
import dialog from './components/dialog/index.vue'
import empty from './components/empty/index.vue'
const coms = [carPark, dialog, empty]

// 批量注册组件

const install = (Vue) => {
  coms.forEach(com => {
    Vue.component(com.name, com)
  })
}

// 导出注册方法
export default install